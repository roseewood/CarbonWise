import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiMessageCircle,
  FiVideo,
  FiFileText,
  FiBookOpen,
  FiGlobe,
} from "react-icons/fi";

export default function CoachPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="coach-layout">
      {/* Left main area */}
      <div className="coach-main">
        <h1 className="coach-title">AI Coach</h1>

        <h2 className="ask-heading">Ask Anything...</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Transport, food-choices, waste etc."
          />
          <button className="mic-btn">🎙️</button>
        </div>
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
