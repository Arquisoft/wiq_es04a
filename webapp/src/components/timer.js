import React, { useState, useEffect } from 'react';

const Clock = () => {
    const[count, setCount] = useState(15)

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

    return (
        <div>
            <h1>Reloj</h1>
            <p><i className="material-icons">access_time</i>{count}</p>
            <button onClick={handleReset}>Reiniciar contador</button>
        </div>
    );
}

export default Clock;