import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./styles.css";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey bud! Can I help you with anything?" }
  ]);
  const [input, setInput] = useState("");
  const sessionId = Date.now().toString();

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");

    const loadingMessage = {
      role: "assistant",
      content: "Buddy is thinking..."
    };
    setMessages([...newMessages, loadingMessage]);

    try {
      const response = await fetch("/.netlify/functions/openrouter-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-4.1-mini",
          messages: newMessages
        })
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry bud, something went wrong.";

      const updatedMessages = [
        ...newMessages,
        { role: "assistant", content: reply }
      ];
      setMessages(updatedMessages);

      await fetch("/.netlify/functions/log-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userMessage: text,
          buddyReply: reply,
          sessionId: sessionId
        })
      });

    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Oops! Buddy had a little hiccup. Try again in a bit." }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <img src="/buddy text.png" alt="Buddy" />
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#DCF8C6" : "white",
              color: msg.role === "user" ? "#000" : "#2e7d32"
            }}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}
