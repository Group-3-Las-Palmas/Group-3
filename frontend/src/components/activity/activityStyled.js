import styled from "styled-components";

const sharedContainerStyles = `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFF2D6;
  width: 90%;
  max-width: 360px;
  margin: 12px auto;
  padding: 16px;
`;

export const MeditationContainer = styled.section`
  ${sharedContainerStyles}

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  h6 {
    color: #1E3220;
    font-size: 12px;
    margin-top: 4px;
  }
`;

export const MeditationDesc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 16px;

  a {
    text-decoration: none;
    color: #1E3220;
  }

  h4 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

export const BreathingContainer = styled.section`
  ${sharedContainerStyles}

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  h6 {
    color: #1E3220;
    font-size: 12px;
    margin-top: 4px;
  }
`;

export const BreathingDesc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 16px;

  a {
    text-decoration: none;
    color: #1E3220;
  }

  h4 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

export const StretchingContainer = styled.section`
  ${sharedContainerStyles}

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  h6 {
    color: #1E3220;
    font-size: 12px;
    margin-top: 4px;
  }
`;

export const StretchingDesc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 16px;

  a {
    text-decoration: none;
    color: #1E3220;
  }

  h4 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;
