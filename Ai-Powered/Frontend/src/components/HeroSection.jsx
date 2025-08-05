import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center text-center px-4">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Write Smarter, Not Harder.
      </motion.h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-xl">
        AI-Powered Assistant to Generate Blogs, Emails, and Social Media Posts Instantly.
      </p>
      <motion.a
        href="/register"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
      >
        Get Started Free
      </motion.a>
    </section>
  );
}
