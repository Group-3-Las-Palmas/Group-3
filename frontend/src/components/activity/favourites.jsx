
import React, { useState, useEffect } from "react"; 

import { getFavouriteExercisesByUser } from '../../services/userExerciseServices';

const FavouriteExercises = ({ userId }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchFavourites = async () => {
       if (!userId) { 
            setLoading(false);
            return;
        }
      try {
        setLoading(true);
        setError(null);
        const data = await getFavouriteExercisesByUser(userId);
        console.log("Fetched favourites for profile:", data); 
        setFavourites(data || []); 
      } catch (err) {
        console.error("Error fetching favourites", err);
        setError("Could not load favourite activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [userId]); 

  if (loading) return <p>Loading favourites...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="favourites">
    
      <ul className="list-disc pl-5 space-y-1">
        {favourites.length > 0 ? (
          favourites.map((item) => (
           
            <li key={item.id || item.exercise_id}> 
              <strong>{item.Exercise?.title || 'Unknown Title'}</strong>
             
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