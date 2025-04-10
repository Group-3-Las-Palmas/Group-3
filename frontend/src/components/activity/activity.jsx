// Group-3/frontend/src/components/activity/activity.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Asume que exerciseServices ahora tiene getAllExercises usando fetchApi
import { getAllExercises } from '../../services/exerciseServices';
// Importa el nuevo servicio para el toggle
import { toggleFavoriteExercise } from '../../services/userExerciseServices';
import {
  MeditationContainer, MeditationDesc, /* otros si usas */
} from "./activityStyled";

// Import icons
import MeditationIcon from "../../assets/Meditation.svg";
import favoriteIcon from "../../assets/favoriteIcon.svg"; // Corazón lleno
import unfavoriteIcon from "../../assets/unfavoriteIcon.svg"; // Corazón vacío
import BreathingIcon from "../../assets/breathingIcon.svg";
import StretchingIcon from "../../assets/stretchingIcon.svg";

// Mapeo de iconos de categoría
const categoryIcons = {
    Meditation: MeditationIcon,
    Breathing: BreathingIcon,
    Stretching: StretchingIcon,
    default: MeditationIcon
};

// --- Componente FavoriteButton MODIFICADO ---
export const FavoriteButton = ({ exerciseId, initialIsFavorite }) => {
  // Estado local para la UI, inicializado con el prop
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar mientras se guarda

  // Actualizar estado si el prop inicial cambia
  useEffect(() => {
    setIsFav(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleClick = async () => {
    if (isLoading) return; // Evitar clicks múltiples

    const previousIsFav = isFav; // Guardar estado anterior por si falla
    setIsLoading(true);
    setIsFav(!isFav); // Actualización optimista de la UI

    try {
      // Llamar al backend para cambiar el estado real
      const response = await toggleFavoriteExercise(exerciseId);
      // Opcional: Forzar la actualización del estado con la respuesta del backend
      // setIsFav(response.is_favourite); // Más seguro pero puede causar pequeño parpadeo
      console.log(`Toggled favorite for ${exerciseId} to ${response.is_favourite}`);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFav(previousIsFav); // Revertir la UI si falla la llamada al backend
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading} // Deshabilitar mientras carga
      style={{ background: "none", border: "none", cursor: isLoading ? "default": "pointer", padding: "0", opacity: isLoading ? 0.5 : 1 }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <img
        style={{ display: "block", width: "15px", height: "15px" }}
        src={isFav ? favoriteIcon : unfavoriteIcon} // Cambia icono según estado local
        alt="favorite toggle"
      />
    </button>
  );
};

// --- Componente ActivityList MODIFICADO ---
export const ActivityList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ahora getAllExercises debería devolver 'is_favourite'
        const data = await getAllExercises();
        console.log("Fetched exercises:", data); // Log para depurar
        setExercises(data || []);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Could not load activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleSelectActivity = (exercise) => {
    const activityData = {
      exercise_id: exercise.exercise_id,
      title: exercise.title,
      description: exercise.description,
      time: exercise.time || 180,
      image: categoryIcons[exercise.category] || categoryIcons.default,
    };
    localStorage.setItem('currentActivity', JSON.stringify(activityData));
    console.log("Saved to localStorage:", activityData);
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading activities...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</p>;
  if (exercises.length === 0) return <p style={{ textAlign: 'center', padding: '2rem' }}>No activities found.</p>;

  return (
    <>
      {exercises.map((exercise) => {
        const ContainerComponent = MeditationContainer; // Ajusta si es necesario
        const DescComponent = MeditationDesc;       // Ajusta si es necesario

        return (
          <ContainerComponent key={exercise.exercise_id}>
            <img
              src={categoryIcons[exercise.category] || categoryIcons.default}
              alt={exercise.category || 'Activity'}
              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            />
            <DescComponent>
              <Link
                to="/current-activityPage"
                onClick={() => handleSelectActivity(exercise)}
              >
                <h4>{exercise.title}</h4>
              </Link>
              <h6>{exercise.description || 'Mindfulness exercise.'}</h6>
            </DescComponent>
            {/* Pasar el ID y el estado inicial de favorito */}
            <FavoriteButton
              exerciseId={exercise.exercise_id}
              initialIsFavorite={exercise.is_favourite} // <-- Pasar el estado desde los datos
            />
          </ContainerComponent>
        );
      })}
    </>
  );
};

export default ActivityList; // Exporta ActivityList por defecto