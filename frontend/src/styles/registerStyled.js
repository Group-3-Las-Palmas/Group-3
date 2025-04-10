import styled from "styled-components";

export const Container = styled.div`
  background-color: #fff2d9;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Form = styled.form`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  width: 320px;
  padding: 2rem;
  border-radius: 10px;
`;

export const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #ffc04d;
    box-shadow: 0 0 0 2px rgba(255, 192, 77, 0.3);
  }
`;

export const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #ffc04d;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #f5b93d;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

export const FooterText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #333;

  a {
    color: #69a578;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
