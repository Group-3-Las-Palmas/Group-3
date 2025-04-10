import React, { useEffect, useState } from "react";
import {
  Circle,
  TrackerWrapper,
  CirclesRow,
  LoginMessage,
} from "./loginsWeeklyStyled";
import { fetchLoginHistory } from "../../services/apiServices"; // Asegúrate que la ruta es correcta

// --- NUEVA FUNCIÓN para obtener las fechas de Lunes a Domingo de la semana actual ---
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

  // Ajustar para que Lunes sea el primer día (índice 0)
  // Si hoy es Domingo (0), lo tratamos como día 7 para calcular el lunes anterior.
  const dayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Calcular cuántos días atrás está el lunes de esta semana
  const diffToMonday = dayIndex;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - diffToMonday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate);
    date.setDate(mondayDate.getDate() + i);
    weekDates.push(date.toISOString().slice(0, 10)); // Formato YYYY-MM-DD
  }
  // Retorna un array como ["LunFecha", "MarFecha", ..., "DomFecha"]
  return weekDates;
};
// --- FIN NUEVA FUNCIÓN ---

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
        console.log("Datos recibidos del backend:", fetchedDates); // <-- AÑADE ESTO
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

  // --- Usar la nueva función para obtener las fechas de la semana actual ---
  const currentWeekDays = getCurrentWeekDates();
  // --- Fin cambio ---

  // Calcular el contador basado en los días de la semana actual
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
        {/* Mapear sobre los días de la semana actual (Lunes a Domingo) */}
        {currentWeekDays.map((date, idx) => (
          <Circle
            key={idx} // El índice ahora corresponde a 0=Lunes, 1=Martes, 2=Miércoles...
            $filled={loginDates.includes(date)}
          />
        ))}
      </CirclesRow>
    </TrackerWrapper>
  );
};

export default LoginTracker;
