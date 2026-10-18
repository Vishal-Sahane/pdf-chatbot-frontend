import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  addUserMessage,
  addBotMessage,
  setLoading,
  setError,
} from "../features/chat/chatSlice";
import { resetPdf } from "../features/pdf/pdfSlice";
import { clearChat } from "../features/chat/chatSlice";

export default function ChatScreen() {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state) => state.chat);
  const { fileName, fileId, totalPages } = useSelector((state) => state.pdf);

  const [input, setInput] = useState("");
  const messageAreaRef = useRef(null);

  useEffect(() => {
    const messageArea = messageAreaRef.current;
    if (messageArea) {
      messageArea.scrollTo({
        top: messageArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleNewPdf = () => {
    dispatch(resetPdf());
    dispatch(clearChat());
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    dispatch(addUserMessage(question));
    dispatch(setLoading(true));
    try {
      const response = await axios.post("http://192.168.1.118:8000/chat", {
        file_id: fileId,
        question,
      });
      dispatch(addBotMessage(response.data.answer));
    } catch (err) {
      const message =
        err.response?.data?.detail || "Something went wrong. Try again.";
      dispatch(setError(message));
      dispatch(addBotMessage("⚠️ " + message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
      <div className="h-dvh w-full max-w-full min-w-0 bg-[#0F0D08] flex flex-col overflow-hidden">
      {/* Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(24rem,100vw)] h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 bg-[#1A1608] border-b border-[#2E2510] px-4 py-3 flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-black text-xs font-bold">
            P
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium max-w-full min-w-0 whitespace-normal break-all">
              {fileName}
            </p>
            <p className="text-gray-600 text-xs">
              {totalPages} pages · Ask anything
            </p>
          </div>
        </div>

        <button
          onClick={handleNewPdf}
          className="shrink-0 text-xs text-gray-400 hover:text-white bg-[#221C09] hover:bg-[#2A2210] border border-[#2E2510] hover:border-amber-500/50 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          + New PDF
        </button>
      </div>

      {/* Messages Area */}
      <div ref={messageAreaRef} className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 py-6 space-y-4">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 mt-20">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/20 rounded-2xl flex items-center justify-center text-2xl">
              💬
            </div>
            <p className="text-gray-500 text-sm text-center">
              Ask your first question about
            </p>
            <p className="text-violet-400 text-sm font-medium text-center w-full min-w-0 px-8 whitespace-normal break-all">
              {fileName}
            </p>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-black text-xs font-bold shrink-0 mt-1">
                P
              </div>
            )}

            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
    ${
      msg.role === "user"
        ? "bg-violet-600 text-white rounded-br-sm font-medium"
        : "bg-[#16162A] border border-[#2A2A45] text-gray-200 rounded-bl-sm"
    } break-words [overflow-wrap:anywhere]`}
            >
              {msg.role === "user" ? (
                msg.text
              ) : (
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => (
                      <span className="font-semibold text-violet-300">
                        {children}
                      </span>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 mt-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-200">{children}</li>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 bg-[#221C09] border border-[#2E2510] rounded-lg flex items-center justify-center text-amber-500 text-xs font-bold shrink-0 mt-1">
                V
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-black text-xs font-bold shrink-0 mt-1">
              P
            </div>
            <div className="bg-[#1A1608] border border-[#2E2510] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-[#1A1608] border-t border-[#2E2510] px-4 py-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-[#221C09] border border-[#2E2510] focus-within:border-amber-500/50 rounded-xl px-4 py-2 transition-colors duration-200">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your PDF..."
              className="flex-1 min-w-0 bg-transparent text-white text-sm placeholder-gray-600 resize-none outline-none py-1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  input.trim() && !isLoading
                    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                    : "bg-[#2A2210] text-gray-600 cursor-not-allowed"
                }`}
            >
              Send
            </button>
          </div>
          <p className="text-gray-700 text-xs text-center mt-2">
            Press Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
