// Group-3/frontend/src/pages/currentActivityPage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  PageWrapper,
  Title,
  ActivityImage,
  StartButton,
  TimerText,
  ProgressBarContainer,
  ProgressBarFill,
  ControlButtons,
  ControlButton,
  // Asegúrate de añadir CompletionMessage a tus styled-components si quieres un estilo específico
  // CompletionMessage
} from "../styles/currentActivityPageStyled.js";
// Importar el nuevo servicio para marcar como completado
import { markExerciseAsCompleted } from "../services/userExerciseServices";

// (Opcional) Define CompletionMessage aquí si no lo hiciste en el archivo Styled.js
const CompletionMessage = ({ children }) => (
  <p style={{ marginTop: '1rem', color: 'green', fontWeight: 'bold' }}>
    {children}
  </p>
);


export const CurrentActivityPage = () => {
  const [activity, setActivity] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [initialTime, setInitialTime] = useState(180); // Tiempo inicial por defecto (3 min)
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [completionStatus, setCompletionStatus] = useState(''); // Mensaje al completar
  const [isCompleting, setIsCompleting] = useState(false); // Estado para evitar llamadas múltiples

  const timerRef = useRef(null); // Ref para el intervalo del temporizador

  // Carga la actividad desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem("currentActivity");
    if (stored) {
      try {
        const parsedActivity = JSON.parse(stored);
        setActivity(parsedActivity);
        // Establece el tiempo inicial basado en el ejercicio, con fallback a 180s
        const duration = parseInt(parsedActivity.time, 10) || 180;
        setInitialTime(duration);
        setTimeLeft(duration);
        console.log("Loaded activity:", parsedActivity); // Para depuración
      } catch (e) {
        console.error("Failed to parse activity from localStorage", e);
        setActivity(null); // Maneja el error si el JSON es inválido
      }
    }
  }, []); // Se ejecuta solo una vez

  // Efecto para manejar la lógica del temporizador
  useEffect(() => {
    // Si está corriendo y queda tiempo
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    // Si el tiempo llega a 0 mientras está corriendo
    else if (timeLeft === 0 && isRunning) {
      setIsRunning(false); // Detiene el temporizador visualmente
      clearInterval(timerRef.current); // Limpia el intervalo
      handleCompletion(); // Llama a la función para registrar la finalización
    }
    // Si no está corriendo o el tiempo es <= 0 (ya se completó o pausó)
    else {
      clearInterval(timerRef.current);
    }

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    // o antes de que el efecto se re-ejecute debido a cambios en las dependencias.
    return () => clearInterval(timerRef.current);

  }, [isRunning, timeLeft]); // Dependencias: re-ejecuta si cambia isRunning o timeLeft

  // Función para registrar la finalización en el backend
  const handleCompletion = async () => {
    // Verifica que haya una actividad, un exercise_id y no esté ya completándose
    if (!activity || !activity.exercise_id || isCompleting) return;

    console.log(`Activity ${activity.exercise_id} completed! Logging...`);
    setIsCompleting(true); // Marca como "completando" para deshabilitar botones
    setCompletionStatus('Logging completion...'); // Mensaje de estado inicial

    try {
      // Llama al servicio que hace la petición POST al backend
      const response = await markExerciseAsCompleted(activity.exercise_id);
      console.log("Completion response:", response); // Muestra la respuesta del backend

      // Actualiza el mensaje basado en si se ganó un premio
      if (response.rewardEarned) {
         setCompletionStatus(`Exercise complete! 🎉 You earned a reward!`);
      } else {
         setCompletionStatus('Exercise complete! Well done!');
      }
    } catch (error) {
      console.error("Error logging completion:", error);
      // Muestra un mensaje de error
      setCompletionStatus(`Failed to log completion: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCompleting(false); // Restablece el estado "completando"
    }
  };

  // --- Handlers para los botones ---

  const handleStart = () => {
    // Solo inicia si queda tiempo y no está en proceso de completarse
     if (timeLeft > 0 && !isCompleting) {
         setIsRunning(true);
         setHasStarted(true);
         setCompletionStatus(''); // Limpia mensajes anteriores al reiniciar/reanudar
     }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (isCompleting) return; // No permitir reset mientras se guarda
    clearInterval(timerRef.current); // Detiene cualquier intervalo activo
    setTimeLeft(initialTime); // Restablece el tiempo al inicial
    setIsRunning(false);
    setHasStarted(false);
    setCompletionStatus(''); // Limpia cualquier mensaje
  };

  // --- Función de formato de tiempo (sin cambios) ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Cálculo del progreso para la barra
  const progressPercent = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

  // Si no hay datos de actividad, muestra un mensaje
  if (!activity) {
    return (
      <PageWrapper>
        <p>Loading activity data or no activity selected. Go back to choose one.</p>
      </PageWrapper>
    );
  }

  // Renderizado principal
  return (
    <PageWrapper>
      {/* Usa el título de la actividad o uno genérico */}
      <Title>{activity.title || "Mindfulness Activity"}</Title>
      {/* Muestra la imagen si existe */}
      {activity.image && <ActivityImage src={activity.image} alt={activity.title || 'Activity'} />}

      {/* Muestra botón Start si no ha empezado */}
      {!hasStarted ? (
        <StartButton onClick={handleStart} disabled={isCompleting}>▶</StartButton>
      ) : (
        // Muestra temporizador y controles si ya empezó
        <>
          <TimerText>{formatTime(timeLeft)}</TimerText>
          <ProgressBarContainer>
            {/* La barra de progreso se actualiza basada en timeLeft */}
            <ProgressBarFill style={{ width: `${progressPercent}%` }} />
          </ProgressBarContainer>

          <ControlButtons>
            {isRunning ? (
              // Botón Pausa si está corriendo
              <ControlButton onClick={handlePause} disabled={isCompleting}>⏸</ControlButton>
            ) : (
              // Botón Play si está pausado (deshabilitado si tiempo=0 o completando)
              <ControlButton onClick={handleStart} disabled={timeLeft === 0 || isCompleting}>▶</ControlButton>
            )}
            {/* Botón Reset (deshabilitado si está completando) */}
            <ControlButton onClick={handleReset} disabled={isCompleting}>🔁</ControlButton>
          </ControlButtons>
        </>
      )}

      {/* Muestra el mensaje de estado o finalización */}
      {completionStatus && <CompletionMessage>{completionStatus}</CompletionMessage>}

    </PageWrapper>
  );
};

// Exporta el componente
export default CurrentActivityPage;