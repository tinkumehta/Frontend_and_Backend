import { useState } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.get(`http://localhost:5000/api/compare?url=${encodeURIComponent(input)}`);
      const data = res.data;

      let reply = `📦 Product: ${data.product || "Unknown"}\n`;
      if (data.amazon) reply += `🛒 Amazon: ${data.amazon.price || "N/A"}\n`;
      if (data.flipkart) reply += `🛍️ Flipkart: ${data.flipkart.price || "N/A"}\n`;

      const botMsg = { sender: "bot", message: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botMsg = { sender: "bot", message: "❌ Failed to fetch prices. Please try a valid product URL." };
      setMessages((prev) => [...prev, botMsg]);
    }

    setInput("");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded-lg shadow-xl">
      <div className="h-96 overflow-y-auto bg-white p-4 rounded mb-4 border">
        {messages.map((msg, index) => (
          <MessageBubble key={index} {...msg} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          placeholder="Paste Amazon or Flipkart product URL..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
