import { useState, useEffect } from 'react';
import ti from './assets/ti.jpeg'
import mush from './assets/mush.jpeg'

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);

  // Generate floating hearts
  useEffect(() => {
    const hearts = [];
    for (let i = 0; i < 20; i++) {
      hearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 2 + 1,
        emoji: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '💖', '💝', '💕'][Math.floor(Math.random() * 10)]
      });
    }
    setFloatingHearts(hearts);
  }, []);

  // Love messages with emojis
  const loveMessages = [
    { emoji: "💖", text: "You make my heart skip a beat!" },
    { emoji: "🥰", text: "Every day with you is special" },
    { emoji: "💫", text: "You're my dream come true" },
    { emoji: "🌹", text: "My love for you grows every day" },
    { emoji: "🎵", text: "You're the rhythm to my heart" },
    { emoji: "☀️", text: "You light up my world" },
    { emoji: "🌈", text: "You color my world with joy" },
    { emoji: "⭐", text: "You're my shining star" }
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loveMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-rose-200 
                    flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Floating Background Hearts */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float pointer-events-none select-none"
          style={{
            left: `${heart.left}%`,
            animation: `float ${heart.size * 4}s linear infinite`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}rem`,
            opacity: 0.6,
            bottom: '-10%'
          }}
        >
          {heart.emoji}
        </div>
      ))}

      {/* Main Card */}
      <div className={`
        relative max-w-2xl w-full transform transition-all duration-1000
        ${isOpen ? 'scale-100 rotate-0' : 'scale-95 -rotate-1'}
      `}>
        {/* Envelope (shown when closed) */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-br from-red-400 to-pink-500 
                     rounded-3xl shadow-2xl p-12 cursor-pointer 
                     transform hover:scale-105 transition-all duration-300
                     border-4 border-white/50 backdrop-blur-sm
                     animate-pulse-slow group"
          >
            <div className="text-center space-y-6">
              <div className="text-8xl animate-bounce">
                💌
              </div>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg
                           group-hover:scale-110 transition-transform">
                Click to Open 💕
              </h2>
              <p className="text-pink-100 text-xl animate-pulse">
                A special message awaits...
              </p>
              <div className="flex justify-center gap-4 text-4xl">
                <span className="animate-spin-slow">💝</span>
                <span className="animate-bounce delay-100">💖</span>
                <span className="animate-ping">💗</span>
              </div>
            </div>
          </div>
        )}

        {/* Open Card */}
        {isOpen && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl 
                        overflow-hidden border-4 border-pink-200
                        animate-slide-up">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 
                          p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full 
                              transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full 
                              transform translate-x-1/2 translate-y-1/2"></div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 
                           drop-shadow-lg relative z-10">
                I LOVE YOU 3000! 💝
              </h1>
              
              <div className="flex justify-center gap-4 text-5xl relative z-10 
                            animate-float-delayed">
                <span>💕</span>
                <span>💖</span>
                <span>💗</span>
                <span>💓</span>
                <span>💘</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 space-y-8">
              
              {/* Rotating Love Message */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 
                            rounded-2xl p-6 text-center transform 
                            hover:scale-105 transition-all duration-500">
                <div className="text-7xl mb-4 animate-bounce">
                  {loveMessages[currentMessage].emoji}
                </div>
                <p className="text-2xl text-gray-700 font-medium 
                            animate-fade-in">
                  {loveMessages[currentMessage].text}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full bg-pink-400 
                                animate-ping`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Love Emoji Grid */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4 
                            justify-items-center">
                {['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
                  '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖',
                  '💘', '💝', '💟', '💌', '🩷', '🧡', '💛', '💚'].map((emoji, index) => (
                  <div
                    key={index}
                    className="text-3xl hover:scale-150 transition-all 
                             duration-300 cursor-pointer hover:rotate-12
                             animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setShowSurprise(true)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>

              {/* Love Letter */}
              <div className="bg-pink-50 rounded-2xl p-8 space-y-4 
                            border-2 border-pink-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-6xl opacity-10 
                              transform rotate-12">
                  💌
                </div>
                
                <p className="text-2xl text-gray-700 leading-relaxed relative z-10">
                  My SOULMATE, <br /><br />
                  <span className="text-3xl block text-center my-4">
                    💕 💖 💗
                  </span>
                  First Message:-  19/10/2024 <br />First kiss :- 25/12/2024<br />
                  <img src={ti} alt="" className='w-80' />
                  <img src={mush} alt=""  className='w-80'/>
                  <span className="block text-center text-4xl my-4">
                    🥰 🌹 💫
                  </span>
                  Forever yours, <br />
                  <span className="text-3xl font-bold text-pink-500 
                                 block mt-2">
                    [Mush] 💝
                  </span>
                </p>
              </div>

              {/* Surprise Button */}
              {!showSurprise ? (
                <button
                  onClick={() => setShowSurprise(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 
                           text-white text-2xl font-bold py-6 rounded-2xl
                           transform hover:scale-105 transition-all duration-300
                           shadow-lg hover:shadow-2xl relative overflow-hidden
                           group"
                >
                  <span className="relative z-10 flex items-center 
                                 justify-center gap-4">
                    Click for a Surprise! 🎁
                    <span className="text-4xl group-hover:rotate-12 
                                   transition-transform">
                      💝
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r 
                                from-yellow-400 to-pink-500 opacity-0 
                                group-hover:opacity-100 transition-opacity 
                                duration-500"></div>
                </button>
              ) : (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 
                              rounded-2xl p-8 text-center text-white 
                              animate-bounce-in">
                  <p className="text-4xl mb-4">🎉 🎊 🎈</p>
                  <h3 className="text-3xl font-bold mb-2">
                    I LOVE YOU! 💖
                  </h3>
                  <p className="text-xl">
                    You are the best thing that ever happened to me!
                  </p>
                  <div className="flex justify-center gap-4 mt-6 text-5xl">
                    <span className="animate-spin-slow">💕</span>
                    <span className="animate-bounce">💞</span>
                    <span className="animate-pulse">💓</span>
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSurprise(false);
                }}
                className="text-pink-400 hover:text-pink-600 
                         transition-colors duration-300 text-lg 
                         flex items-center gap-2 mx-auto"
              >
                <span>💌</span>
                Close Card
                <span>💌</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}

export default App;