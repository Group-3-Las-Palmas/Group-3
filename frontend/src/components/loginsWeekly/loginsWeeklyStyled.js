import styled from 'styled-components';

export const TrackerWrapper = styled.div`
  display: flex;
  width: 327px;
  height: 143px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-shrink: 0;
  margin: 0 auto;
  text-align: center;
`;


export const LoginMessage = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1E3220;
  //font-family: 'Poppins', sans-serif;
  margin: 0;
`;

export const CirclesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const Circle = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #6ba367;
  background-color: ${props => (props.filled ? '#65A46D' : 'transparent')};
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #6ba367;
  opacity: 0.7;
  margin-top: 10px;
`;
