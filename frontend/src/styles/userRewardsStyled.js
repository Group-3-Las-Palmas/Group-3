// Group-3/frontend/src/components/reward/userRewardsStyled.js
import styled from 'styled-components';

// Contenedor principal para la cuadrícula de premios
export const RewardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; // Permite que los elementos pasen a la siguiente línea
  gap: 1rem;       // Espacio entre premios (similar a gap-4 de Tailwind)
  justify-content: center; // Centra los premios horizontalmente
  padding: 1rem 0; // Añade algo de padding vertical
`;

// Contenedor para cada premio individual (imagen + nombre)
export const RewardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 96px; // Ancho fijo (similar a w-24 de Tailwind)
`;

// Estilo para la imagen del badge
export const BadgeImage = styled.img`
  width: 40px;         // Ancho de la imagen (similar a w-20)
  height: 40px;        // Altura de la imagen (similar a h-20)
  object-fit: contain; // Asegura que la imagen quepa sin distorsión
  border-radius: 8px;  // Bordes redondeados (similar a rounded-lg)
  margin-bottom: 0.5rem; // Espacio entre imagen y nombre (similar a mt-2 en el <p>)
`;

// Estilo para el nombre del premio
export const RewardName = styled.p`
  font-size: 0.875rem; // Tamaño de fuente (similar a text-sm)
  color: #333;        // Color de texto
  word-wrap: break-word; // Permite que el texto largo se divida
  line-height: 1.2;    // Ajusta el interlineado si es necesario
`;