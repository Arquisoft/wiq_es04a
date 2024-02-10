import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./css/timer.css" 

const Clock = () => {
    const[count, setCount] = useState(15)
    const [showClock, setShowClock] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            if(count > 0)
               setCount(count => count - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [count])

    const handleReset = () => {
        setCount(15);
    };

    const toggleClock = () => {
        setShowClock(!showClock);
    };

    return (
        <div>
          <button onClick={toggleClock}>Mostrar/ocultar reloj</button>
          {showClock && (
            <div>
              <h1>Reloj</h1>
              <p>
                <i className="material-icons">access_time</i>
                {count}
              </p>
              <button onClick={handleReset}>Reiniciar contador</button>
              <CountdownCircleTimer
                isPlaying
                duration={15}
                colors={["#0bfc03", "#F7B801", "#f50707", "#A30000"]}
                colorsTime={[10, 6, 3, 0]}
                onComplete={() => ({ shouldRepeat: true, delay: 1 })}
              >
                {({ remainingTime }) => {
                  return (
                    <div className="timer">
                      <div className="value">
                        <span>{remainingTime}</span>
                      </div>
                      <div className="text">seconds</div>
                    </div>
                  );
                }}
              </CountdownCircleTimer>
            </div>
          )}
        </div>
      );
    };

export default Clock;