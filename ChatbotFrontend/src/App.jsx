import { useState } from 'react'
import './App.css'
import ChatBox from './components/ChatBox'

function App() {
  
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-2xl font-bold p-6">💬 Price Compare Chatbot</h1>
      <ChatBox />
    </div>
  )
}

export default App
