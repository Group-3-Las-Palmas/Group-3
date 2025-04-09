// Group-3/frontend/src/components/settingsUserComponent/settingsUserStyled.js
import styled from "styled-components";

const breakpointMobile = "361px";

export const SettingsUserContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  box-sizing: border-box;
  width: 100vw;
  min-height: 100vh;
  padding-bottom: 80px; // Espacio para NavBar
  overflow-x: hidden;

  @media (min-width: ${breakpointMobile}) {
    padding: 2rem;
    padding-bottom: 100px; // Un poco más de espacio en pantallas grandes
  }
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem; /* Reducido de 1rem */
  /* border: 2px solid #e0e0e0; */ /* <-- BORDE ELIMINADO */


  @media (min-width: ${breakpointMobile}) {
    width: 150px;
    height: 150px;
    margin-bottom: 1rem; /* Reducido de 1.5rem */
    /* border-width: 3px; */ /* <-- BORDE ELIMINADO */
  }
`;

export const ImagePlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem; /* Reducido de 1rem */
  border: 2px solid #ccc; // Mantenemos borde en placeholder
  color: #555;
  font-size: 0.8rem;
  cursor: pointer; // Hacer que el placeholder también sea clickeable

  @media (min-width: ${breakpointMobile}) {
    width: 150px;
    height: 150px;
    margin-bottom: 1rem; /* Reducido de 1.5rem */
    font-size: 0.9rem;
    border-width: 3px;
  }
`;

export const FileInput = styled.input`
  display: none; // Mantenemos el input oculto
`;

export const UploadButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; // Permite que los botones pasen a la siguiente línea si no caben
  justify-content: center;
  gap: 0.8rem; // Espacio entre botones
  margin-bottom: 0.5rem; // Espacio antes del texto de error o confirmación
  width: 100%;
  max-width: 320px; // Limita el ancho del contenedor de botones

  @media (min-width: ${breakpointMobile}) {
    gap: 1rem;
  }
`;

// *** ActionButton DEFINIDO ANTES de ser usado en DeleteConfirmContainer ***
export const ActionButton = styled.button`
  /* ESTILOS BASE (SE APLICAN AL BOTÓN "GUARDAR" USERNAME cuando NO está deshabilitado) */
  background-color: #65a46d; // Verde principal
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #58915f; // Verde más oscuro hover
  }
  &:disabled {
    background-color: #ccc; // Gris deshabilitado general
    cursor: not-allowed;
    opacity: 0.7;
  }

  /* ESTILOS ESPECÍFICOS PARA BOTONES CON CLASE "cancel" (Cancelar Username) */
  &.cancel {
    background-color: #e74c3c; // Rojo para cancelar username
    &:hover:not(:disabled) {
      background-color: #c0392b; // Rojo oscuro hover
    }
    &:disabled {
        background-color: #f5b7b1; // Rojo pálido deshabilitado
    }
  }

  @media (min-width: ${breakpointMobile}) {
      padding: 0.6rem 1.2rem;
      font-size: 0.95rem;
  }
`;

// --- DeleteConfirmContainer ahora se define DESPUÉS de ActionButton ---
export const DeleteConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem;
  border: 1px solid #e74c3c; // Borde rojo
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background-color: #fceded; // Fondo rojo muy claro
  max-width: 320px;
  width: 90%;

  p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #c0392b; // Texto rojo oscuro
    font-weight: bold;
    text-align: center;
  }

  div { // Contenedor para los botones Sí/No
    display: flex;
    justify-content: center;
    gap: 1rem;

    ${ActionButton} { // Aplica estilos específicos a los botones DENTRO de este contenedor
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;

      /* Botón "No" (cancel) DENTRO DE LA CONFIRMACIÓN */
      &.cancel {
        background-color: #65a46d;  // <-- Verde
        &:hover:not(:disabled) {
          background-color: #58915f; // <-- Hover verde oscuro
        }
        &:disabled {
           background-color: #ccc;
        }
      }

      /* Botón "Sí, eliminar" (confirmar) */
      &:not(.cancel) {
        background-color: #c0392b; // Rojo oscuro
        &:hover:not(:disabled) {
          background-color: #a93226;
        }
         &:disabled {
             background-color: #e74c3c; // Rojo más claro
             opacity: 0.7;
         }
      }
    }
  }
`;

export const UsernameBox = styled.div`
  background-color: #ffffff;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 0.75rem; /* Reducido de 1rem */
  margin-bottom: 1rem;
  width: 85%;
  max-width: 260px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    color: #1e311f;
    margin: 0;
    font-size: 1.1rem;
    flex-grow: 1;
    text-align: left;
    margin-right: 0.5rem;
    overflow-wrap: break-word;
    word-break: break-all;
  }

  @media (min-width: ${breakpointMobile}) {
    padding: 0.8rem 1.5rem;
    width: auto;
    max-width: 320px;
     h3 {
        font-size: 1.2rem;
        margin-right: 1rem;
     }
  }
`;

export const EditUsernameForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  max-width: 260px;
  margin-top: 0.75rem; /* Reducido de 1rem */
  margin-bottom: 1.5rem;

  @media (min-width: ${breakpointMobile}) {
      margin-bottom: 2rem; /* Mantenido para separar del botón Logout */
      max-width: 320px;
  }
`;

export const UsernameInput = styled.input`
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  @media (min-width: ${breakpointMobile}) {
      padding: 0.8rem;
      font-size: 1.1rem;
  }
`;

export const EditButtonsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem; // Espacio después del ErrorText (o Input si no hay error)

   @media (min-width: ${breakpointMobile}) {
       gap: 1rem;
   }
`;

export const EditIcon = styled.span`
  cursor: pointer;
  font-size: 1.1rem;
  margin-left: 0.5rem;
  color: #65a46d;
  transition: color 0.2s ease;

  &:hover {
    color: #58915f;
  }

  @media (min-width: ${breakpointMobile}) {
      font-size: 1.2rem;
  }
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  min-height: 1.2em;
  width: 100%;
  max-width: 320px;
  text-align: center;

   @media (min-width: ${breakpointMobile}) {
       font-size: 0.9rem;
   }
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  color: #e74c3c; // Rojo
  border: 1px solid #e74c3c;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #e74c3c;
    color: white;
  }
  &:disabled {
    color: #ccc;
    border-color: #ccc;
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (min-width: ${breakpointMobile}) {
     font-size: 0.85rem;
     padding: 0.45rem 0.9rem;
  }
`;

export const LogoutButton = styled.button`
  background-color: #FFC965; // Amarillo Lumo
  color: #1E311F; // Verde oscuro texto
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background-color 0.2s ease, transform 0.1s ease;
  /* margin-top: 1.5rem; */ /* <-- ELIMINADO margin-top */

  &:hover:not(:disabled) {
    background-color: #FAC462;
  }
  &:active:not(:disabled) {
    background-color: #F0B850;
    transform: scale(0.98);
  }
   &:disabled {
       background-color: #ffe0a6; // Amarillo pálido
       color: #a5a5a5; // Texto gris
       cursor: not-allowed;
       opacity: 0.8;
   }

  @media (min-width: ${breakpointMobile}) {
      padding: 0.8rem 1.8rem;
      font-size: 1rem;
  }
`;

// --- NUEVO CONTENEDOR PARA BOTONES INFERIORES ---
export const BottomButtonsContainer = styled.div`
  display: flex;
  justify-content: center; // Centrar botones horizontalmente
  gap: 1rem; // Espacio entre botones
  margin-top: 1.5rem; // Espacio arriba, separando del resto
  width: 100%; // Opcional: tomar todo el ancho disponible
  max-width: 400px; // Opcional: limitar el ancho máximo
`;
// --- FIN NUEVO CONTENEDOR ---