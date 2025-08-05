import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">AI-Powered Content Assistant</h1>
      <p className="text-lg mb-6 text-gray-600 max-w-xl">
        Generate high-quality content with the help of AI. Summarize, expand, rewrite, or create from scratch.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="bg-gray-200 text-black px-6 py-2 rounded hover:bg-gray-300">
          Register
        </Link>
      </div>
    </div>
  );
}
