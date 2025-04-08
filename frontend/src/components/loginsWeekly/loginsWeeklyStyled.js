import styled from 'styled-components';

export const Circle = styled.div`
  width: 30px;
  height: 30px;
  margin: 8px;
  border-radius: 50%;
  border: 2px solid #65A46D;
  background-color: ${props => (props.filled ? '#65A46D' : 'transparent')};
`;

export const TrackerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

export const CirclesRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
