import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import Layout from "../components/Layout";
import messageAPI from "../apiManger/message";
import useUserStore from "../store/user";

const POLL_INTERVAL_MS = 4000;

const Chat = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await messageAPI.getMessages(bookingId);
      setMessages(res?.data?.messages || []);
    } catch (error) {
      // Silently ignore poll failures (e.g. a transient network blip);
      // the next poll will try again.
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await messageAPI.sendMessage(bookingId, trimmed);
      setMessages((prev) => [...prev, res.data.message]);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="container flex flex-col max-w-3xl p-4 mx-auto" style={{ minHeight: "70vh" }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex flex-col flex-1 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              Session Chat
            </h2>
            <p className="text-xs text-gray-400">
              Messages are only visible to you and the other person on this
              booking.
            </p>
          </div>

          <div className="flex-1 p-5 space-y-3 overflow-y-auto" style={{ maxHeight: "50vh" }}>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spin size="large" />
              </div>
            ) : messages.length === 0 ? (
              <p className="py-10 text-sm text-center text-gray-400">
                No messages yet. Say hello!
              </p>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender?._id === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                        isMine
                          ? "bg-purple-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {!isMine && (
                        <p className="mb-0.5 text-xs font-semibold opacity-70">
                          {msg.sender?.name || "User"}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-4 border-t border-gray-100"
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              maxLength={2000}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="flex items-center justify-center w-10 h-10 text-white bg-purple-600 rounded-full hover:bg-purple-700 disabled:opacity-50"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
