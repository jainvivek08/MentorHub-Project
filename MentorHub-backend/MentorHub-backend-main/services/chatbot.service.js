const UserModel = require("../models/user.model");
const ServiceModel = require("../models/service.model");
const config = require("../config");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

/**
 * Very lightweight "RAG": pull a handful of approved mentors + active
 * services whose tags/name/description loosely match words in the user's
 * message, and hand that as grounding context to the model. This keeps the
 * bot's mentor recommendations honest (based on real DB data) instead of
 * the model guessing/hallucinating mentor names.
 */
const buildMentorContext = async (message) => {
  const words = message
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return "";

  const regexes = words.map((w) => new RegExp(w, "i"));

  const mentors = await UserModel.find({
    role: "mentor",
    approvalStatus: "approved",
    $or: [
      { "profile.tags": { $in: regexes } },
      { "profile.title": { $in: regexes } },
      { "profile.bio": { $in: regexes } },
    ],
  })
    .select("name username profile.title profile.tags profile.bio")
    .limit(5)
    .lean();

  if (mentors.length === 0) return "";

  const mentorIds = mentors.map((m) => m._id);
  const services = await ServiceModel.find({
    mentor: { $in: mentorIds },
    active: true,
  })
    .select("mentor name description duration price")
    .lean();

  const context = mentors.map((mentor) => {
    const mentorServices = services.filter(
      (s) => String(s.mentor) === String(mentor._id)
    );
    return {
      name: mentor.name,
      username: mentor.username,
      title: mentor.profile?.title || "",
      tags: mentor.profile?.tags || [],
      services: mentorServices.map((s) => ({
        name: s.name,
        duration: s.duration,
        price: s.price,
      })),
    };
  });

  return `Relevant mentors currently on the platform (only recommend from this list, and only if they genuinely fit; otherwise tell the user to browse the "All Mentors" page):\n${JSON.stringify(
    context,
    null,
    2
  )}`;
};

const SYSTEM_PROMPT = `You are the support assistant embedded in MentorHub, a platform where students book 1:1 sessions with mentors.
- Answer questions about how MentorHub works: browsing mentors, booking a session, payments, messaging a mentor, leaving reviews, becoming a mentor.
- If the user is looking for a mentor in a specific skill/topic, use the "Relevant mentors" context if it's provided, and suggest 1-3 by name with their username so the user can look them up. Never invent mentors, prices, or availability that aren't in the provided context.
- If no relevant mentor context is provided, tell the user to check the "All Mentors" page and search/filter by skill.
- Keep answers short (2-5 sentences), friendly, and practical.
- You cannot see account-specific data (bookings, payments, messages) — for those, tell the user to check their dashboard or contact support.`;

const sendMessage = async (message, history = []) => {
  if (!config.groq?.apiKey) {
    throw new ApiError(
      httpStatus.internalServerError,
      "Chatbot is not configured. Missing GROQ_API_KEY."
    );
  }

  const mentorContext = await buildMentorContext(message);

  // Groq's API is OpenAI-compatible: the system prompt is just the first
  // message in the array with role "system", unlike Anthropic which takes
  // it as a separate top-level field.
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((turn) => ({ role: turn.role, content: turn.content })),
    {
      role: "user",
      content: mentorContext
        ? `${mentorContext}\n\nUser question: ${message}`
        : message,
    },
  ];

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.groq.apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 500,
        messages,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Groq API error:", response.status, errBody);
    throw new ApiError(
      httpStatus.serviceUnavailable,
      "The chatbot is temporarily unavailable. Please try again shortly."
    );
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  return reply || "Sorry, I couldn't come up with a reply. Please try rephrasing.";
};

module.exports = {
  sendMessage,
};