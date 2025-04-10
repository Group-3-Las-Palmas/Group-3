// Group-3/frontend/src/components/activity/activity.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllExercises } from '../../services/exerciseServices'; // Import service to get exercises
import {
  // Assuming you have a generic container or specific ones
  MeditationContainer,
  MeditationDesc,
  // Import other styled containers if needed (or use a generic one)
  // BreathingContainer, BreathingDesc, StretchingContainer, StretchingDesc
} from "./activityStyled";

// Import icons (ensure paths are correct)
import MeditationIcon from "../../assets/Meditation.svg";
import favoriteIcon from "../../assets/favoriteIcon.svg";
import unfavoriteIcon from "../../assets/unfavoriteIcon.svg";
import BreathingIcon from "../../assets/breathingIcon.svg";
import StretchingIcon from "../../assets/stretchingIcon.svg"; // Corrected variable name

// --- Favorite Button Component ---
// (Added exerciseId prop for potential future use, like saving favorites to backend)
export const FavoriteButton = ({ exerciseId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // TODO: Implement backend call to toggle favorite status using exerciseId
  const handleClick = () => {
    setIsFavorite(!isFavorite);
    console.log(`Toggled favorite for exercise ID: ${exerciseId}`); // Placeholder
  };

  return (
    <button
      onClick={handleClick}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "0" }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <img
        style={{ display: "block", width: "15px", height: "15px" }}
        src={isFavorite ? favoriteIcon : unfavoriteIcon}
        alt="favorite"
      />
    </button>
  );
};

// --- Main Component to List Activities ---
export const ActivityList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de categoría a icono (ajusta según tus categorías reales)
  const categoryIcons = {
    Meditation: MeditationIcon,
    Breathing: BreathingIcon,
    Stretching: StretchingIcon, // Corrected variable name
    default: MeditationIcon // Icono por defecto si la categoría no coincide
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        // Llama al servicio para obtener todos los ejercicios del backend
        const data = await getAllExercises();
        setExercises(data || []); // Asegúrate de que sea un array
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Could not load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para guardar los datos del ejercicio seleccionado en localStorage
  const handleSelectActivity = (exercise) => {
    const activityData = {
      exercise_id: exercise.exercise_id, // <-- IMPORTANTE: Incluir el ID real
      title: exercise.title,
      description: exercise.description,
      time: exercise.time || 180, // Usa el tiempo del ejercicio o 180s por defecto
      // Asigna el icono basado en la categoría del ejercicio
      image: categoryIcons[exercise.category] || categoryIcons.default,
    };
    localStorage.setItem('currentActivity', JSON.stringify(activityData));
    console.log("Saved to localStorage:", activityData); // Para depuración
  };

  // Renderizado condicional para carga y error
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading activities...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</p>;
  if (exercises.length === 0) return <p style={{ textAlign: 'center', padding: '2rem' }}>No activities found.</p>;


  // Renderizado de la lista de ejercicios
  return (
    <>
      {exercises.map((exercise) => {
        // Determina qué componente contenedor usar (aquí se usa MeditationContainer como ejemplo genérico)
        // Podrías tener lógica para usar BreathingContainer, StretchingContainer, etc. basado en exercise.category si son distintos
        const ContainerComponent = MeditationContainer; // Ajusta si tienes contenedores diferentes
        const DescComponent = MeditationDesc;       // Ajusta si tienes descripciones diferentes

        return (
          <ContainerComponent key={exercise.exercise_id}>
            <img
              src={categoryIcons[exercise.category] || categoryIcons.default}
              alt={exercise.category || 'Activity'}
              style={{ width: '50px', height: '50px', objectFit: 'contain' }} // Estilo de ejemplo
            />
            <DescComponent>
              <Link
                to="/current-activityPage"
                onClick={() => handleSelectActivity(exercise)} // Pasa el objeto ejercicio completo
              >
                <h4>{exercise.title}</h4>
              </Link>
              {/* Usa la descripción del ejercicio o un texto por defecto */}
              <h6>{exercise.description || 'Mindfulness exercise.'}</h6>
            </DescComponent>
            <FavoriteButton exerciseId={exercise.exercise_id} />
          </ContainerComponent>
        );
      })}
    </>
  );
};

export default ActivityList;