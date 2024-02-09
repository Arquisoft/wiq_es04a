import React, { useState, useEffect } from 'react';

const Clock = () => {
    const[count, setCount] = useState(15)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count => count - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <h1>Reloj</h1>
            <p>{count}</p>
        </div>
    );
}

export default Clock;