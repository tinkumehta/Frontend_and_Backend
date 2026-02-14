import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState(0);
  const [showRing, setShowRing] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [matrixMode, setMatrixMode] = useState(false);

  const proposalLines = [
    "> Initializing Love Protocol v2.0...",
    "> Scanning heart parameters...",
    "> Found critical dependency: [REDACTED]",
    "> Analyzing compatibility matrix...",
    "> COMPATIBILITY: 100% - EXCEPTION: Missing component",
    "> Required component: [YOU]",
    "> Attempting to install [YOU] into [MY LIFE]...",
    "> ERROR: Cannot install without mutual consent",
    "> Initiating manual override...",
    "> [YOUR NAME] requests merge with [THEIR NAME]",
    "> Please confirm merge request:"
  ];

  useEffect(() => {
    if (step < proposalLines.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleYes = () => {
    setShowRing(true);
    setMatrixMode(true);
    setTimeout(() => {
      setMatrixMode(false);
    }, 5000);
  };

  const handleNo = () => {
    alert("ERROR: Invalid option. System override initiated.");
    setStep(proposalLines.length - 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'y' || e.key === 'Y') {
      handleYes();
    } else if (e.key === 'n' || e.key === 'N') {
      handleNo();
    }
  };

  return (
    <div className={`terminal-container ${matrixMode ? 'matrix-rain' : ''}`}>
      <div className="terminal-header">
        <span className="terminal-title">♥ LOVE_TERMINAL v2.0 ♥</span>
        <div className="terminal-controls">
          <span className="control close">✕</span>
          <span className="control minimize">─</span>
          <span className="control maximize">□</span>
        </div>
      </div>

      <div className="terminal-content" onKeyDown={handleKeyPress} tabIndex={0}>
        {/* ASCII Heart Animation */}
        <pre className="ascii-heart">
          {`
    @@@    @@@ 
   @@@@@  @@@@@ 
  @@@@@@@@@@@@@
   @@@@@@@@@@@
     @@@@@@@
       @@@
        @
          `}
        </pre>

        {/* Terminal Lines */}
        <div className="terminal-lines">
          {proposalLines.slice(0, step).map((line, index) => (
            <div key={index} className="terminal-line">
              <span className="prompt">{index === step - 1 ? '>' : '$'}</span>
              <span className={`line-text ${index === step - 1 ? 'typing' : ''}`}>
                {line}
              </span>
              {index === step - 1 && index < proposalLines.length - 1 && (
                <span className="cursor">█</span>
              )}
            </div>
          ))}

          {/* User Input Section */}
          {step >= proposalLines.length && !showRing && (
            <div className="user-input-section">
              <div className="terminal-line">
                <span className="prompt">?</span>
                <span className="line-text highlight">
                  ACCEPT MERGE REQUEST? (Y/N)
                </span>
              </div>
              <div className="input-container">
                <span className="prompt">{'>'}</span>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.toLowerCase())}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      if (userInput === 'y' || userInput === 'yes') {
                        handleYes();
                      } else if (userInput === 'n' || userInput === 'no') {
                        handleNo();
                      }
                    }
                  }}
                  placeholder="type your answer..."
                  autoFocus
                />
                <span className="cursor">█</span>
              </div>
              <div className="button-group">
                <button className="terminal-btn yes-btn" onClick={handleYes}>
                  [ YES ]
                </button>
                <button className="terminal-btn no-btn" onClick={handleNo}>
                  [ NO ]
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showRing && (
            <div className="success-message">
              <div className="confetti">
                {'🎉'.repeat(20)}
              </div>
              <pre className="success-ascii">
                {`
    ╔══════════════════════════════════╗
    ║     MERGE SUCCESSFUL! ♥          ║
    ║     [YOU] + [ME] = FOREVER       ║
    ║     COMPILATION COMPLETE          ║
    ╚══════════════════════════════════╝
                `}
              </pre>
              <div className="ring-reveal">
                <div className="ring-box">
                  <div className="ring-lid"></div>
                  <div className="ring">💍</div>
                </div>
                <p className="proposal-text">
                  क्या आप करेंगे मुझसे शादी <br />
                  <span className="blink">_</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <span>♥ HEART: 100%</span>
          <span>⚡ LOGIC: OVERRIDDEN</span>
          <span>💾 SAVE POINT: FOREVER</span>
        </div>
      </div>
    </div>
  );
}

export default App;