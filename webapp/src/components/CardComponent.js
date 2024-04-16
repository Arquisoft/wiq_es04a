import { Typography } from '@mui/material';
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
        opacity: '0.8',
    },
    textBox: {
        opacity: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        transition: '0.2s ease-in-out',
        zIndex: 2,
        width:'100%'
    },
    textBoxHovered: {
        opacity: 1
    },
    text: {
        fontWeight: 'bold',
        color:'white'
    },
    head: {
        fontSize: {
            xs: '0rem', // Tamaño para dispositivos extra pequeños
            sm: '0rem', // Tamaño para dispositivos pequeños
            md: '1rem', // Tamaño para dispositivos medianos
            lg: '1.4rem', // Tamaño para dispositivos grandes
            xl: '1.8rem' // Tamaño para dispositivos extra grandes
        },
        WebkitTextStroke: '0.07rem black',
        textStroke: '0.07rem black',

    },
};

function CardComponent({ imageUrl, title, isActive }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{ ...styles.card, ...(hovered ? styles.cardHovered : {}), ...(isActive ? styles.cardHovered : {})}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src={imageUrl} alt={title} style={{ ...styles.img, ...(hovered ? styles.imgHovered : {}), ...(isActive ? styles.imgHovered : {})}} />
            <div style={{ ...styles.textBox, ...(hovered ? styles.textBoxHovered : {}), ...(isActive ? styles.textBoxHovered : {})}}>
                <Typography sx={{ ...styles.text, ...styles.head }}>{title}</Typography>
            </div>
        </div>
    );
}

export default CardComponent;


