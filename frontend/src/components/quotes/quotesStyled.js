import styled from 'styled-components';

export const QuoteWrapper = styled.div`
  text-align: center;
  padding: 32px 20px;
`;

export const QuoteText = styled.p`
  color: #1E3220;
  //font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0.24px;
  max-width: 90%;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 600px;
  }
`;
