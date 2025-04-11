
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getAllExercises } from '../../services/exerciseServices';

import { toggleFavoriteExercise } from '../../services/userExerciseServices';
import {
  MeditationContainer, MeditationDesc, 
} from "./activityStyled";

// Import icons
import MeditationIcon from "../../assets/Meditation.svg";
import favoriteIcon from "../../assets/favoriteIcon.svg"; 
import unfavoriteIcon from "../../assets/unfavoriteIcon.svg"; 
import BreathingIcon from "../../assets/breathingIcon.svg";
import StretchingIcon from "../../assets/stretchingIcon.svg";


const categoryIcons = {
    Meditation: MeditationIcon,
    Breathing: BreathingIcon,
    Stretching: StretchingIcon,
    default: MeditationIcon
};


export const FavoriteButton = ({ exerciseId, initialIsFavorite }) => {
  
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false); 

  
  useEffect(() => {
    setIsFav(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleClick = async () => {
    if (isLoading) return; 

    const previousIsFav = isFav; 
    setIsLoading(true);
    setIsFav(!isFav); 

    try {
     
      const response = await toggleFavoriteExercise(exerciseId);
      
      console.log(`Toggled favorite for ${exerciseId} to ${response.is_favourite}`);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFav(previousIsFav); 
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading} 
      style={{ background: "none", border: "none", cursor: isLoading ? "default": "pointer", padding: "0", opacity: isLoading ? 0.5 : 1 }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <img
        style={{ display: "block", width: "15px", height: "15px" }}
        src={isFav ? favoriteIcon : unfavoriteIcon} 
        alt="favorite toggle"
      />
    </button>
  );
};


export const ActivityList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAllExercises();
        console.log("Fetched exercises:", data); 
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
        const ContainerComponent = MeditationContainer; 
        const DescComponent = MeditationDesc;       

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
           
            <FavoriteButton
              exerciseId={exercise.exercise_id}
              initialIsFavorite={exercise.is_favourite} 
            />
          </ContainerComponent>
        );
      })}
    </>
  );
};

export default ActivityList; 