import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

const quickPrompts = [
  "How can I manage exam stress?",
  "Tips for improving focus",
  "I need help with time management",
  "How do I talk to a counsellor?",
];

const initialMessages = [
  {
    id: 1,
    role: "bot",
    text: "Hi! I’m your support assistant. Tell me what’s on your mind, and I’ll try to help.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getInitials = (value) => {
  if (!value || typeof value !== "string") return "U";

  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return parts[0].slice(0, 2).toUpperCase();
};

function ChatbotPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userInitials, setUserInitials] = useState("U");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const user = getUserFromToken();
    const displayName = user?.name || user?.fullName || user?.username || user?.email || user?.sub;
    setUserInitials(getInitials(displayName));
  }, []);

  // Fetch and restore chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await api.get("/api/chat/history");
        const historyMessages = response.data.map((chat) => [
          {
            id: `user-${chat.id}`,
            role: "user",
            text: chat.userMessage,
            time: new Date(chat.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          {
            id: `bot-${chat.id}`,
            role: "bot",
            text: chat.botResponse,
            time: new Date(chat.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]).flat();

        if (historyMessages.length > 0) {
          setMessages(historyMessages);
        }
      } catch (error) {
        console.log("No chat history found or error loading history");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, []);

  const addUserMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/api/chat/send", {
        message: trimmed,
      });

      const replyText = response.data?.response?.trim() || "I couldn't generate a response right now. Please try again.";

      const botReply = {
        id: Date.now() + 1,
        role: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      const status = error?.response?.status;

      const errorMessage =
        status === 401 || status === 403
          ? "Chatbot access denied. Please log in as a student and try again."
          : "Could not connect to chatbot server. Please make sure backend is running and try again.";

      const botReply = {
        id: Date.now() + 1,
        role: "bot",
        text: errorMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    void addUserMessage(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto h-full">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-1 sm:mb-2 flex items-center justify-center gap-1 sm:gap-2">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2.24c1.3.6 2.75.97 4.29.97C17.52 22 22 17.52 22 12S17.52 2 12 2zm0 18c-1.41 0-2.73-.36-3.88-.99l-.28-.15-2.89 1.08.84-2.58-.18-.3C4.5 15.43 4 13.8 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            AI Support Assistant
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2">
            Chat with our intelligent assistant for instant support and guidance
          </p>
        </div>

        {/* Main Chat Card */}
        <div className="card bg-white/95 shadow-xl border border-slate-200 rounded-xl sm:rounded-2xl">
          <div className="card-body p-3 sm:p-4 md:p-6">
            {/* Quick Prompts */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2 sm:mb-3 uppercase tracking-wide">Quick Questions</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {quickPrompts.map((prompt) => (
                  <span
                    key={prompt}
                    className="text-xs sm:text-sm text-slate-500 italic"
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="divider my-2 sm:my-4 md:my-6"></div>

            {/* Chat Messages Area */}
            <div className="h-[calc(100vh-28rem)] sm:h-96 md:h-[28rem] lg:h-[32rem] overflow-y-auto overflow-x-hidden rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-50 to-white p-2 sm:p-4 md:p-6 border border-slate-200/50">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <p className="mt-4 text-slate-600 text-sm">Loading chat history...</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className={`chat px-0.5 sm:px-1 md:px-2 my-1.5 sm:my-2 md:my-3 ${message.role === "user" ? "chat-end" : "chat-start"}`}>
                      <div className="chat-image avatar placeholder self-start">
                        <div
                          className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full ring-1 sm:ring-2 shadow-md flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase leading-none transition-all duration-200 ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white ring-blue-200"
                              : "bg-gradient-to-br from-cyan-500 to-teal-500 text-white ring-cyan-200"
                          }`}
                        >
                          <span>{message.role === "user" ? userInitials : "AI"}</span>
                        </div>
                      </div>
                      <div className="chat-header text-[10px] sm:text-xs opacity-70 mb-0.5 sm:mb-1">
                        {message.role === "user" ? "You" : "Assistant"}
                        <time className="ml-1 sm:ml-2">{message.time}</time>
                      </div>
                      <div
                        className={`chat-bubble rounded-md sm:rounded-lg md:rounded-xl shadow-sm max-w-[75vw] sm:max-w-xs md:max-w-md text-xs sm:text-sm md:text-base leading-snug sm:leading-relaxed ${
                          message.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-slate-200 text-slate-800 rounded-bl-none"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="chat chat-start px-0.5 sm:px-1 md:px-2 my-1.5 sm:my-2 md:my-3">
                      <div className="chat-image avatar placeholder self-start">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full ring-1 sm:ring-2 ring-cyan-200 shadow-md bg-gradient-to-br from-cyan-500 to-teal-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase leading-none">
                          <span>AI</span>
                        </div>
                      </div>
                      <div className="chat-bubble bg-slate-200 text-slate-800 rounded-bl-none rounded-md sm:rounded-lg md:rounded-xl shadow-sm">
                        <span className="loading loading-dots loading-xs sm:loading-sm"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 md:mt-6 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="input input-bordered input-sm sm:input-md w-full rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 text-xs sm:text-sm md:text-base px-2"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-sm sm:btn-md btn-primary rounded-lg sm:rounded-xl bg-blue-400 hover:bg-blue-600 border-none shadow-md hover:shadow-lg transition-all duration-200 sm:w-auto px-3 sm:px-4 text-xs sm:text-sm"
                disabled={!input.trim() || isTyping}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.9702544,11.6889879 22.9702544,11.5318905 22.9702544,11.3747931 L4.13399899,1.16346272 C3.34915502,0.9-0.0463324,0.9 C2.41,0.8063241 1.77946707,-0.0791628 1.15159189,0.546894 L3.03521743,7.27127768 C3.03521743,7.42837506 3.34915502,7.5844725 3.50612381,7.5844725 L16.6915026,8.3699594 C16.6915026,8.4636352 17.1624089,8.4636352 17.1624089,8.4636352 L17.1624089,12.52 C17.1624089,12.52 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
                </svg>
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-4 sm:mt-6 md:mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <div className="flex gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-0.5 sm:mb-1">Note</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-blue-800 leading-snug sm:leading-normal">
                This chatbot is powered by AI and provides general support. For urgent concerns, please contact your counsellor directly through the booking page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
