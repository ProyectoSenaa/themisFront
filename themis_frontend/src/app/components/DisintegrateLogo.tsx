import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Corregido */
  width: 80vw; /* Corregido */
  position: relative;
`;

const LogoPiece = styled(motion.div)`
  background-image: url('/img/logoThemis.svg');
  background-size: 400px 400px; /* Tamaño total del logo dividido en piezas */
  width: 80px; /* Tamaño de cada pieza (ajustar según tamaño del logo) */
  height: 80px;
  position: absolute;
  top: 50%; /* Centrar verticalmente */
  left: 50%; /* Centrar horizontalmente */
  transform: translate(-50%, -50%); /* Centrar el logo */
`;

const generatePieces = () => {
  const rows = 5; // Número de filas
  const cols = 5; // Número de columnas
  const pieceArray = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieceArray.push({
        x: col * 100, // Ajustar según tamaño de cada pieza
        y: row * 100, // Ajustar según tamaño de cada pieza
        key: `${row}-${col}`,
        bgX: col * -100, // Ajustar según tamaño de cada pieza
        bgY: row * -100, // Ajustar según tamaño de cada pieza
      });
    }
  }
  return pieceArray;
};

const DisintegrateLogo = () => {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);
  const piecesArray = generatePieces();

  const handleClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    await controls.start((i) => ({
      opacity: 0,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 180, 180, 0],
      borderRadius: ["0%", "0%", "50%", "50%", "0%"],
      transition: { duration: 8, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] },
    }));

    setIsAnimating(false);
  };

  return (
    <LogoContainer onClick={handleClick}>
      {piecesArray.map(({ x, y, key, bgX, bgY }, index) => (
        // Dentro de DisintegrateLogo
        <LogoPiece
          key={key}
          custom={index}
          initial={{ opacity: 1, x: x - 200, y: y - 200 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["0%", "0%", "50%", "50%", "0%"],
          }}
          style={{
            backgroundPosition: `${bgX}px ${bgY}px`, // Ajustar según tamaño de cada pieza
          }}
          transition={{
            duration: 8, // Aumenta la duración de la animación a 5 segundos
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      ))}
    </LogoContainer>
  );
};

export default DisintegrateLogo;
