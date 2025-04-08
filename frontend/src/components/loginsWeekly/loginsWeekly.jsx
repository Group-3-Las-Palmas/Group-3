import React, { useEffect, useState } from 'react';
import { Circle, TrackerWrapper, CirclesRow } from './loginsWeeklyStyled';

// finding the last week
const getLast7Days = () => {
  const today = new Date();
  return [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date.toISOString().slice(0, 10);
  });
};

// track the logins from past week
const LoginTracker = () => {
  const [loginDates, setLoginDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const last7 = getLast7Days();
  const loginCount = last7.filter(date => loginDates.includes(date)).length;

  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const response = await fetch('/api/logins');
        const data = await response.json();
        setLoginDates(data);
      } catch (err) {
        console.error('Error fetching logins:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogins();
  }, []);

  if (isLoading) return <p>Loading login data...</p>;

  // Showing logins!
  return (
    <TrackerWrapper>
      <h2>You have logged in {loginCount} {loginCount === 1 ? 'time' : 'times'} this week!</h2>
      <CirclesRow>
        {last7.map((date, idx) => (
          <Circle key={idx} filled={loginDates.includes(date)} />
        ))}
      </CirclesRow>
    </TrackerWrapper>
  );
};

export default LoginTracker;
