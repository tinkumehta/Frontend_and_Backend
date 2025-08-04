export default function MessageBubble({ message, sender }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div className={`p-3 rounded-lg max-w-xs text-sm ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
        {message}
      </div>
    </div>
  );
}
