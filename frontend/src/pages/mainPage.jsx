// Group-3/frontend/src/pages/mainPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import LoginTracker from "../components/loginsWeekly/loginsWeekly";
import Quotes from "../components/quotes/quotes";
import {
    MeditationContainer,
    MeditationDesc,
    BreathingContainer,
    BreathingDesc,
    // Importa StretchingContainer/Desc si los necesitas específicamente
    // StretchingContainer,
    // StretchingDesc
} from "../components/activity/activityStyled";
import { MainPageContainer } from "../styles/mainPageStyled";
import { FavoriteButton } from "../components/activity/activity";
import { getAllExercises } from '../services/exerciseServices';

// --- Importar TODOS los iconos necesarios ---
import MeditationIcon from "../assets/Meditation.svg";
import BreathingIcon from "../assets/breathingIcon.svg";
import StretchingIcon from "../assets/stretchingIcon.svg"; // <-- AÑADIR ESTA LÍNEA
// -------------------------------------------

// Mapeo de iconos
const categoryIcons = {
    Mindfulness: MeditationIcon,
    Cardio: BreathingIcon,      // Ajusta si prefieres otro icono para Cardio
    Fuerza: StretchingIcon,     // Ahora StretchingIcon está definido
    // Añade otras categorías y sus iconos si es necesario
    default: MeditationIcon     // Icono por defecto
};


export const MainPage = () => {
    const [featuredExercises, setFeaturedExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedExercises = async () => {
            try {
                setLoading(true);
                setError(null);
                const allExercises = await getAllExercises();
                console.log("Raw exercises fetched in MainPage:", allExercises);

                // Ajusta este filtro a las categorías que realmente quieres mostrar aquí
                const filtered = (allExercises || []).filter(ex =>
                    ex.category === 'Mindfulness' || ex.category === 'Cardio' || ex.category === 'Fuerza'
                    // Ejemplo mostrando las 3 categorías encontradas en tus datos
                );
                console.log("Filtered exercises for MainPage:", filtered);
                setFeaturedExercises(filtered);

            } catch (err) {
                console.error("Error fetching featured exercises for MainPage:", err);
                setError("Could not load activities.");
                setFeaturedExercises([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedExercises();
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
       console.log("Saved to localStorage from MainPage:", activityData);
     };


    return (
        <>
            <section>
                <Quotes />
                <LoginTracker />
            </section>
            <MainPageContainer>
                <h1>Select a Mindful activity</h1>
                <h6>Earn badges by finishing activities!</h6>
            </MainPageContainer>
            <section>
                {loading && <p>Loading activities...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && featuredExercises.length === 0 && <p>No featured activities available.</p>}

                {!loading && !error && featuredExercises.map(exercise => {
                    // Lógica simple para seleccionar contenedor basado en categoría
                    let ContainerComponent = MeditationContainer; // Por defecto
                    let DescComponent = MeditationDesc;        // Por defecto

                    if (exercise.category === 'Breathing') { // Asumiendo que Cardio usa el estilo de Breathing
                        ContainerComponent = BreathingContainer;
                        DescComponent = BreathingDesc;
                    } else if (exercise.category === 'Fuerza') {
                         // Asume que tienes un StretchingContainer/Desc o usa uno genérico
                         // ContainerComponent = StretchingContainer; // Si existe
                         // DescComponent = StretchingDesc;        // Si existe
                         // Si no, se quedará con MeditationContainer/Desc
                    } // Puedes añadir más 'else if' para otras categorías

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
                                initialIsFavorite={exercise.is_favourite} // asumiendo que la API devuelve esto
                            />
                        </ContainerComponent>
                    );
                })}
            </section>
        </>
    );
}

export default MainPage;