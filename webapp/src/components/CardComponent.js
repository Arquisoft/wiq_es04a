import React, { useState } from 'react';

const styles = {
    card: {
        width: '100%',
        height: '100%',
        background: '#313131',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: '0.2s ease-in-out',
        transform: 'scale(1) rotate(0deg)',
        margin:'1rem',

    },
    cardHovered: {
        transform: 'scale(1.04) rotate(-1deg)'
    },
    img: {
        height: '100%',
        position: 'absolute',
        transition: '0.2s ease-in-out',
        zIndex: 1,
        borderRadius:'10px'
    },
    imgHovered: {
        height: '100%',
        filter: 'blur(7px)',
        opacity: '0.8'
    },
    textBox: {
        opacity: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        transition: '0.2s ease-in-out',
        zIndex: 2
    },
    textBoxHovered: {
        opacity: 1
    },
    text: {
        fontWeight: 'bold',
        color:'white'
    },
    head: {
        fontSize: '1rem'
    },
};

function CardComponent({ imageUrl, title, subtitle }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{ ...styles.card, ...(hovered ? styles.cardHovered : {}) }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src={imageUrl} alt={title} style={{ ...styles.img, ...(hovered ? styles.imgHovered : {}) }} />
            <div style={{ ...styles.textBox, ...(hovered ? styles.textBoxHovered : {}) }}>
                <p style={{ ...styles.text, ...styles.head }}>{title}</p>
            </div>
        </div>
    );
}

export default CardComponent;


