import styled from 'styled-components';

export const QuoteCard = styled.div`
  padding: 20px;
  margin-top: 20px;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #1E3220;
  width: 100%;
  max-width: 1200px;
  line-height: 1.1;

  @media (max-width: 1024px) {
    font-size: 24px;
    max-width: 90%;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    max-width: 95%;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;
