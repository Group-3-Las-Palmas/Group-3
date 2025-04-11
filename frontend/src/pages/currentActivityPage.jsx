
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
 
} from "../styles/currentActivityPageStyled.js";

import { markExerciseAsCompleted } from "../services/userExerciseServices";


const CompletionMessage = ({ children }) => (
  <p style={{ marginTop: '1rem', color: 'green', fontWeight: 'bold' }}>
    {children}
  </p>
);


export const CurrentActivityPage = () => {
  const [activity, setActivity] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [initialTime, setInitialTime] = useState(180); 
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [completionStatus, setCompletionStatus] = useState(''); 
  const [isCompleting, setIsCompleting] = useState(false); 
  const timerRef = useRef(null); 

 
  useEffect(() => {
    const stored = localStorage.getItem("currentActivity");
    if (stored) {
      try {
        const parsedActivity = JSON.parse(stored);
        setActivity(parsedActivity);
       
        const duration = parseInt(parsedActivity.time, 10) || 180;
        setInitialTime(duration);
        setTimeLeft(duration);
        console.log("Loaded activity:", parsedActivity); 
      } catch (e) {
        console.error("Failed to parse activity from localStorage", e);
        setActivity(null); 
      }
    }
  }, []); 

 
  useEffect(() => {
    
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
   
    else if (timeLeft === 0 && isRunning) {
      setIsRunning(false); 
      clearInterval(timerRef.current);
      handleCompletion(); 
    }
    
    else {
      clearInterval(timerRef.current);
    }

   
    return () => clearInterval(timerRef.current);

  }, [isRunning, timeLeft]);

  
  const handleCompletion = async () => {
   
    if (!activity || !activity.exercise_id || isCompleting) return;

    console.log(`Activity ${activity.exercise_id} completed! Logging...`);
    setIsCompleting(true); 
    setCompletionStatus('Logging completion...'); 

    try {
      
      const response = await markExerciseAsCompleted(activity.exercise_id);
      console.log("Completion response:", response); 

      
      if (response.rewardEarned) {
         setCompletionStatus(`Exercise complete! 🎉 You earned a reward!`);
      } else {
         setCompletionStatus('Exercise complete! Well done!');
      }
    } catch (error) {
      console.error("Error logging completion:", error);
      
      setCompletionStatus(`Failed to log completion: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCompleting(false); 
    }
  };

 

  const handleStart = () => {
    
     if (timeLeft > 0 && !isCompleting) {
         setIsRunning(true);
         setHasStarted(true);
         setCompletionStatus(''); 
     }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (isCompleting) return;
    clearInterval(timerRef.current); 
    setTimeLeft(initialTime); 
    setIsRunning(false);
    setHasStarted(false);
    setCompletionStatus(''); 
  };

 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };


  const progressPercent = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

 
  if (!activity) {
    return (
      <PageWrapper>
        <p>Loading activity data or no activity selected. Go back to choose one.</p>
      </PageWrapper>
    );
  }

 
  return (
    <PageWrapper>
     
      <Title>{activity.title || "Mindfulness Activity"}</Title>
      
      {activity.image && <ActivityImage src={activity.image} alt={activity.title || 'Activity'} />}

   
      {!hasStarted ? (
        <StartButton onClick={handleStart} disabled={isCompleting}>▶</StartButton>
      ) : (

        <>
          <TimerText>{formatTime(timeLeft)}</TimerText>
          <ProgressBarContainer>
          
            <ProgressBarFill style={{ width: `${progressPercent}%` }} />
          </ProgressBarContainer>

          <ControlButtons>
            {isRunning ? (
            
              <ControlButton onClick={handlePause} disabled={isCompleting}>⏸</ControlButton>
            ) : (
      
              <ControlButton onClick={handleStart} disabled={timeLeft === 0 || isCompleting}>▶</ControlButton>
            )}

            <ControlButton onClick={handleReset} disabled={isCompleting}>🔁</ControlButton>
          </ControlButtons>
        </>
      )}


      {completionStatus && <CompletionMessage>{completionStatus}</CompletionMessage>}

    </PageWrapper>
  );
};


export default CurrentActivityPage;