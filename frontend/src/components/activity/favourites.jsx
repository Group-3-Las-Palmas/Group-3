// Group-3/frontend/src/components/activity/favourites.jsx
import React, { useState, useEffect } from "react"; // Añadido import React
// Asume que userExerciseServices tiene getFavouriteExercisesByUser usando fetchApi
import { getFavouriteExercisesByUser } from '../../services/userExerciseServices';

const FavouriteExercises = ({ userId }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchFavourites = async () => {
       if (!userId) { // No hacer nada si no hay userId
            setLoading(false);
            return;
        }
      try {
        setLoading(true);
        setError(null);
        const data = await getFavouriteExercisesByUser(userId);
        console.log("Fetched favourites for profile:", data); // Log para depurar
        setFavourites(data || []); // Asegurar que sea un array
      } catch (err) {
        console.error("Error fetching favourites", err);
        setError("Could not load favourite activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [userId]); // Se re-ejecuta si cambia userId

  if (loading) return <p>Loading favourites...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="favourites">
      {/* Estilos con Tailwind u otros */}
      <ul className="list-disc pl-5 space-y-1">
        {favourites.length > 0 ? (
          favourites.map((item) => (
            // Asegúrate que accedes al título correctamente (puede ser item.Exercise.title)
            <li key={item.id || item.exercise_id}> {/* Usa item.id si es la PK de user_exercises */}
              <strong>{item.Exercise?.title || 'Unknown Title'}</strong>
              {/* Puedes mostrar más info si quieres, como completed_times */}
              {/* <span> Completed: {item.completed_times} {item.completed_times === 1 ? 'time' : 'times'}</span> */}
            </li>
          ))
        ) : (
          <p className="text-gray-500">You haven't marked any activity as favourite yet.</p>
        )}
      </ul>
    </div>
  );
}

export default FavouriteExercises;