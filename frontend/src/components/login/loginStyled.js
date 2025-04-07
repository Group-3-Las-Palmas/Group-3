import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #FFF2D6;

  a{
    text-decoration: none;
    color: #64A46C;
    font-weight: bold;
    font-size: 14px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  background-color: #FFF2D6;
`;

export const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Button = styled.button`
  background-color: #FAC462;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;
