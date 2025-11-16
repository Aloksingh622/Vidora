import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

function RenderColdStartLoader({ serverUrl, onReady }) {
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    let dotInterval;
    if (isWarmingUp) {
      dotInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
    }
    return () => clearInterval(dotInterval);
  }, [isWarmingUp]);

  useEffect(() => {
    const checkServerStatus = async () => {
      const startTime = Date.now();
      
      try {
        // Try to ping the server with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${serverUrl}/api/health`, {
          signal: controller.signal,
          method: 'GET',
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        // If response takes longer than 3 seconds, it's likely a cold start
        if (responseTime > 3000 || !response.ok) {
          setIsWarmingUp(true);
          // Wait a bit more for server to fully warm up
          setTimeout(() => {
            setIsWarmingUp(false);
            onReady();
          }, 2000);
        } else {
          onReady();
        }
      } catch (error) {
        // Network error or timeout - likely cold start
        setIsWarmingUp(true);
        
        // Retry connection
        const retryInterval = setInterval(async () => {
          try {
            const retryResponse = await fetch(`${serverUrl}/api/health`, {
              method: 'GET',
            });
            
            if (retryResponse.ok) {
              clearInterval(retryInterval);
              setTimeout(() => {
                setIsWarmingUp(false);
                onReady();
              }, 1000);
            }
          } catch (retryError) {
            // Keep waiting
            console.log("Retrying server connection...");
          }
        }, 2000);
        
        // Fallback: stop trying after 30 seconds
        setTimeout(() => {
          clearInterval(retryInterval);
          setIsWarmingUp(false);
          onReady();
        }, 30000);
      }
    };

    checkServerStatus();
  }, [serverUrl, onReady]);

  if (!isWarmingUp) return null;

  return (
    <div className="fixed inset-0 bg-[#0f0f0f] z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-4">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#efaf6a]/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative flex flex-col items-center">
            <span 
              className="text-[#efaf6a] font-black text-5xl sm:text-6xl tracking-wider uppercase" 
              style={{ 
                fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif", 
                letterSpacing: '0.1em' 
              }}
            >
              VIDORA
            </span>
            <span 
              className="text-[#795d3f] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase -mt-1" 
              style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}
            >
              AI Powered
            </span>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative">
          <ClipLoader size={50} color="#efaf6a" />
          <div className="absolute inset-0 bg-[#efaf6a]/10 blur-xl rounded-full animate-pulse"></div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-[#efaf6a] text-lg sm:text-xl font-semibold">
            Waking up the server{dots}
          </p>
          <p className="text-slate-400 text-sm max-w-md">
            Please wait while we prepare everything for you. This usually takes 10-15 seconds.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#795d3f] to-[#efaf6a] rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 50%;
            margin-left: 25%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default RenderColdStartLoader;