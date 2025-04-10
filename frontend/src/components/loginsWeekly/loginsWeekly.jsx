import React, { useEffect, useState } from "react";
import {
  Circle,
  TrackerWrapper,
  CirclesRow,
  LoginMessage,
} from "./loginsWeeklyStyled";
import { fetchLoginHistory } from "../../services/apiServices";

// Get week dates
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Set Monday as [0]
  const dayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Diff between days
  const diffToMonday = dayIndex;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - diffToMonday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate);
    date.setDate(mondayDate.getDate() + i);
    weekDates.push(date.toISOString().slice(0, 10)); // Format YYYY-MM-DD
  }
  // Return array as ["LunFecha", "MarFecha", ..., "DomFecha"]
  return weekDates;
};

const LoginTracker = () => {
  const [loginDates, setLoginDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedDates = await fetchLoginHistory();
        console.log("Datos recibidos del backend:", fetchedDates);
        if (Array.isArray(fetchedDates)) {
          setLoginDates(fetchedDates);
        } else {
          console.warn(
            "Login history response was not an array:",
            fetchedDates
          );
          setLoginDates([]);
        }
      } catch (err) {
        console.error("Error fetching login history:", err);
        setError(`Failed to load login data. ${err.message}`);
        setLoginDates([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Get current week dates
  const currentWeekDays = getCurrentWeekDates();


  // Counter based in current week
  const loginCount = currentWeekDays.filter((date) =>
    loginDates.includes(date)
  ).length;

  if (isLoading) return <p>Loading login data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <TrackerWrapper>
      <LoginMessage>
        You have logged in {loginCount} {loginCount === 1 ? "time" : "times"}{" "}
        this week!
      </LoginMessage>
      <CirclesRow>
        {/* Map days from current week*/}
        {currentWeekDays.map((date, idx) => (
          <Circle
            key={idx} //index
            $filled={loginDates.includes(date)}
          />
        ))}
      </CirclesRow>
    </TrackerWrapper>
  );
};

export default LoginTracker;
