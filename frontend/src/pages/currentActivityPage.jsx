import { useEffect, useState } from "react";
import {
  PageWrapper,
  Title,
  ActivityImage,
  StartButton,
  TimerText,
  ProgressBarContainer,
  ProgressBarFill,
  ControlButtons,
  ControlButton
} from "../styles/currentActivityPageStyled.js";

export const CurrentActivityPage = () => {
  const [activity, setActivity] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    const stored = localStorage.getItem("currentActivity");
    if (stored) {
      setActivity(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(180);
    setIsRunning(false);
    setHasStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = (timeLeft / 180) * 100;

  if (!activity) return <p>No activity selected. Go back to choose one.</p>;

  return (
    <PageWrapper>
      <Title>3 minutes</Title>
      <ActivityImage src={activity.image} alt={activity.title} />

      {!hasStarted ? (
        <StartButton onClick={handleStart}>▶</StartButton>
      ) : (
        <>
          <TimerText>{formatTime(timeLeft)}</TimerText>
          <ProgressBarContainer>
            <ProgressBarFill style={{ width: `${progressPercent}%` }} />
          </ProgressBarContainer>

          <ControlButtons>
            {isRunning ? (
              <ControlButton onClick={handlePause}>⏸</ControlButton>
            ) : (
              <ControlButton onClick={handleStart}>▶</ControlButton>
            )}
            <ControlButton onClick={handleReset}>🔁</ControlButton>
          </ControlButtons>
        </>
      )}
    </PageWrapper>
  );
};
