import React, { useEffect, useRef, useState } from "react";
import { BiMessageRoundedDots, BiX, BiSend } from "react-icons/bi";
import chatbotApi from "../apiManger/chatbot";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm the MentorHub assistant. Ask me how booking works, or tell me what you'd like to learn and I'll point you to mentors.",
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      // send the last few turns (excluding the welcome message) so the bot
      // has short-term memory, matching the backend's history cap of 10
      const history = nextMessages
        .filter((m) => m !== WELCOME_MESSAGE)
        .slice(-10, -1);

      const res = await chatbotApi.sendMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't reach the assistant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center justify-between bg-purple-700 px-4 py-3 text-white">
            <span className="font-semibold">MentorHub Assistant</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded p-1 hover:bg-purple-600"
            >
              <BiX size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-800 shadow"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-white px-3 py-2 text-sm text-gray-400 shadow">
                  Typing...
                </div>
              </div>
            )}
            {error && (
              <div className="text-center text-xs text-red-500">{error}</div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-gray-200 p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="rounded-full bg-purple-600 p-2 text-white disabled:opacity-40"
            >
              <BiSend size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl hover:bg-purple-700"
      >
        {open ? <BiX size={26} /> : <BiMessageRoundedDots size={26} />}
      </button>
    </div>
  );
};

export default ChatbotWidget;