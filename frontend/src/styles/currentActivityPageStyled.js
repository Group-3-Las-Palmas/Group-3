import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
  text-align: center;
  background-color: #f7f7f7;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const ActivityImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 1rem;
`;

export const StartButton = styled.button`
  width: 60px;
  height: 60px;
  font-size: 2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #45a049;
  }
`;

export const TimerText = styled.h2`
  font-size: 2rem;
  margin-top: 1rem;
`;

export const ProgressBarContainer = styled.div`
  width: 80%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 1rem;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #4caf50;
  transition: width 1s linear;
`;

export const ControlButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background-color: #eee;
  color: #333;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;
