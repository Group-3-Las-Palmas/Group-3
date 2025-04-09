// Group-3/frontend/src/styles/profilePageStyled.js
import styled from 'styled-components';

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 6rem; // Padding arriba/lados/abajo (espacio extra abajo para NavBar)
  font-family: 'Poppins', sans-serif; // Usando Poppins como en index.html
  /* background-color: #FFF2D6; // Color base que mencionaste */
  min-height: 100vh; // Asegura que ocupe al menos toda la altura
  box-sizing: border-box;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column; /* Cambiado a columna para móvil */
  align-items: center;
  margin-bottom: 2rem;
  text-align: center; /* Centrar texto debajo de la imagen */

  @media (min-width: 768px) { /* Estilos para pantallas más grandes */
    flex-direction: row; /* Volver a fila en pantallas grandes */
    text-align: left; /* Alinear texto a la izquierda en pantallas grandes */
    gap: 1.5rem;
  }
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem; /* Espacio debajo de la imagen en móvil */

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 0; /* Quitar espacio inferior en pantallas grandes */
  }
`;

export const UserName = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  color: #1E3220; // Color de texto oscuro (ajusta si es necesario)
`;

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1E3220;
  margin-bottom: 1rem;
  text-align: center; // Centrar títulos de sección
`;

export const Separator = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0; // Línea divisoria sutil
  width: 80%;
  max-width: 400px;
  margin: 2rem auto; // Espacio arriba y abajo, centrada
`;

export const Section = styled.section`
  width: 100%;
  max-width: 500px; // Limitar ancho de las secciones
  margin-bottom: 2rem;
`;