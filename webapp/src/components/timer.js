import React, { useState, useEffect } from 'react';

const Clock = () => {
    const[time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <h1>Reloj</h1>
            <p>{time.toLocaleTimeString()}</p>
        </div>
    );
}

export default Clock;