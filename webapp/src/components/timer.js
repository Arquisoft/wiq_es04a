import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./css/timer.css" 
import Navbar from './navBar';
import { Button, Typography, Box } from '@mui/material';

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

    //Just test code (very bad)
    return (
        <div>
          <Navbar/>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">

            <Typography variant="h2" style={{ fontFamily: 'inherit' }} >Prueba de reloj</Typography>
            <Button variant='contained' color='primary' onClick={toggleClock} style={{ marginTop: '1em' }}>
              Mostrar/ocultar reloj
            </Button>
          
            {showClock && (
              <div>
                <p>
                  <i className="material-icons">access_time</i>
                  {count}
                </p>
                <Button variant='contained' color='primary' onClick={handleReset} style={{ marginBot: '1em' }}>
                  Reiniciar contador
                </Button>
                
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
          </Box>
        </div>
      );
    };

export default Clock;