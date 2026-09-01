import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Section = ({ title, children, id }) => (
  <section id={id} className="mb-14 scroll-mt-24">
    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
      {title}
    </h2>
    <div className="space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">
      {children}
    </div>
  </section>
);

const categories = [
  "Career Growth Mentors",
  "Skill Development Mentors",
  "Entrepreneurship Mentors",
  "Freelancing & Gig Economy Mentors",
  "Tech & Engineering Mentors",
  "Creative Arts Mentors",
  "Marketing & Sales Mentors",
  "Finance & Investment Mentors",
  "Health & Wellness Mentors",
  "Education & Teaching Mentors",
  "Personal Development Mentors",
  "Social Impact Mentors",
];

const navItems = [
  { id: "what-is-mentorhub", label: "What is MentorHub" },
  { id: "how-it-works", label: "How it works" },
  { id: "categories", label: "Mentor categories" },
  { id: "for-mentors", label: "For mentors" },
  { id: "pricing", label: "Pricing & payments" },
  { id: "faq", label: "FAQ" },
];

const Documentation = () => {
  return (
    <Layout>
      <div className="bg-[#150822]">
        <div className="px-4 py-16 mx-auto text-center sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">
            MentorHub Documentation
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-gray-300">
            Everything you need to know about how MentorHub works, for
            mentees looking for guidance and mentors looking to give it.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-10 px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:flex-row">
          {/* Side nav */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                On this page
              </p>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-[#00DFBD] transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                to="/"
                className="inline-flex items-center mt-8 text-sm font-medium text-purple-600 dark:text-[#00DFBD] hover:underline"
              >
                ← Back to home
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="max-w-3xl">
            <Section title="What is MentorHub" id="what-is-mentorhub">
              <p>
                MentorHub is a platform that connects people who want to grow
                &mdash; in their career, a specific skill, or a new venture
                &mdash; with experienced mentors who've already walked that
                path. Instead of generic courses, you get one-on-one guidance
                tailored to your goals, your pace, and your questions.
              </p>
              <p>
                Whether you're switching careers, learning to code, starting a
                business, or trying to get healthier, there's a mentor
                category built around it.
              </p>
            </Section>

            <Section title="How it works" id="how-it-works">
              <ol className="pl-5 space-y-3 list-decimal">
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Browse or search
                  </span>{" "}
                  &mdash; explore mentor categories or search for a specific
                  skill, industry, or mentor.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Check profiles
                  </span>{" "}
                  &mdash; every mentor profile lists their experience,
                  specialities, availability, and rates.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Book a session
                  </span>{" "}
                  &mdash; pick a time slot that works for you and confirm your
                  booking directly on the platform.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Meet and grow
                  </span>{" "}
                  &mdash; join your session, get personalized guidance, and
                  book follow-ups as you progress.
                </li>
              </ol>
            </Section>

            <Section title="Mentor categories" id="categories">
              <p>MentorHub currently covers these areas:</p>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-2 mt-2 sm:grid-cols-2">
                {categories.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="For mentors" id="for-mentors">
              <p>
                If you have experience worth sharing, you can sign up as a
                mentor from the "Become a Mentor with Us" button in the
                navigation bar. You'll set up a profile, list your areas of
                expertise, and define your own availability and rates.
                Mentees book sessions directly against your calendar.
              </p>
            </Section>

            <Section title="Pricing & payments" id="pricing">
              <p>
                Session pricing is set individually by each mentor, so rates
                vary by category and experience level. Payments are handled
                securely through the platform at the time of booking &mdash;
                you won't need to arrange payment separately with your
                mentor.
              </p>
            </Section>

            <Section title="FAQ" id="faq">
              <p>
                For answers to common questions about accounts, bookings, and
                rescheduling, check the FAQ section on the{" "}
                <Link to="/" className="text-purple-600 dark:text-[#00DFBD] hover:underline">
                  home page
                </Link>
                . If you can't find what you're looking for, reach out through
                our social channels linked in the footer.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
