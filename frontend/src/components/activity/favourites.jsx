import { getFavouriteExercisesByUser } from '../../services/userExerciseServices';
import { useState, useEffect } from "react";

const FavouriteExercises = ({ userId }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const data = await getFavouriteExercisesByUser(userId);
        setFavourites(data);
      } catch (err) {
        console.error("Error fetching favourites", err);
      }
    };

    fetchFavourites();
  }, [userId]);

  return (
    <div className="favourites">
      <ul className="list-disc pl-5 space-y-1">
        {favourites.length > 0 ? (
          favourites.map((item) => (
            <li key={item.exercise_id}>
              <strong>{item.Exercise?.title || 'Unknown'}</strong>
              <span> Completed: {item.completed_times} {item.completed_times === 1 ? 'time' : 'times'}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">You don't got any activity as favourite.</p>
        )}
      </ul>
    </div>
  );
}

export default FavouriteExercises;
