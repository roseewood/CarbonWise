import { useState, useRef } from "react";
import {
  FiMenu,
  FiX,
  FiMessageCircle,
  FiVideo,
  FiFileText,
  FiBookOpen,
  FiGlobe,
  FiMic,
} from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { getCoach } from "../api";

// ---------- Types ----------
type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

type CoachResponse = {
  answer?: string;
};

// ---------- Web Speech API minimal types ----------
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// ---------- Component ----------
export default function CoachPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  function createMessage(role: ChatRole, text: string): ChatMessage {
    return { role, text };
  }

  async function handleAsk() {
    if (!question.trim()) return;

    const newMessages = [...messages, createMessage("user", question)];
    setMessages(newMessages);
    setLoading(true);

    try {
      const data: CoachResponse = await getCoach({
        locale: "IN",
        question,
      });
      setMessages([
        ...newMessages,
        createMessage("assistant", data.answer || "No answer received."),
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred.";
      setMessages([
        ...newMessages,
        createMessage("assistant", "❌ Error: " + errorMessage),
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  }

  function handleMicClick() {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("❌ Speech Recognition is not supported in this browser.");
      return;
    }

    // Stop existing recognition before restarting
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Recognition stop error:", e);
      }
      recognitionRef.current = null;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎙️ Mic started, listening...");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("🛑 Mic stopped.");
      setListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log("✅ Heard:", transcript);
      setQuestion(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("❌ Speech recognition error:", event.error);
      setListening(false);
      alert("Mic error: " + event.error);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("❌ Could not start recognition:", err);
    }
  }

  return (
    <main className="coach-layout">
      {/* Left main area */}
      <div className="coach-main">
        <h1 className="coach-title">AI Coach</h1>

        {messages.length === 0 ? (
          <>
            <h2 className="ask-heading">Ask Anything...</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Transport, food-choices, waste etc."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <button
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={handleMicClick}
              >
                <FiMic size={20} />
              </button>
              <button className="post-icon" onClick={handleAsk}>
                <IoSend />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Chat messages */}
            <div className="chat-box">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    msg.role === "user" ? "user" : "assistant"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
              {loading && <p className="thinking">⏳ Thinking...</p>}
            </div>

            {/* Search bar pinned at bottom */}
            <div className="search-bar chat-input">
              <input
                type="text"
                placeholder="Type your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <button
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={handleMicClick}
              >
                <FiMic size={20} />
              </button>
              <button className="post-icon" onClick={handleAsk}>
                <IoSend />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right sidebar */}
      <aside className={`side-panel ${isOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className="side-nav">
          <a href="#">
            <FiMessageCircle />
            {isOpen && <span>New Chats</span>}
          </a>
          <a href="#">
            <FiVideo />
            {isOpen && <span>Videos</span>}
          </a>
          <a href="#">
            <FiFileText />
            {isOpen && <span>News</span>}
          </a>
          <a href="#">
            <FiBookOpen />
            {isOpen && <span>Articles</span>}
          </a>
          <a href="#">
            <FiGlobe />
            {isOpen && <span>Blogs</span>}
          </a>
          <a href="#" className="side-chats">
            {isOpen && <span>Chats</span>}
          </a>
        </nav>
      </aside>
    </main>
  );
}
