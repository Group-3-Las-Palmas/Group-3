import styled from "styled-components";

export const NavBarContainer = styled.nav`
  background-color: #FFC965;
  margin: 0;
  padding: 0;
  width: 100%;
  position: sticky;
bottom: 0;
left: 0;
right: 0;
z-index: 999;


  ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 1rem 2rem;
    margin: 0;
  }

  li a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #1E3220;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;

    img {
      width: 20px;
      height: 20px;
      transition: filter 0.3s ease;
      filter: brightness(0) saturate(100%) invert(12%) sepia(17%) saturate(849%) hue-rotate(67deg) brightness(96%) contrast(86%);
      /* dette simulerer #1E3220 */
    }

    &:hover {
      background-color: #fff; /* evt. eller behold samme baggrund */
      color: #65A46D;

      img {
        filter: brightness(0) saturate(100%) invert(57%) sepia(10%) saturate(2057%) hue-rotate(77deg) brightness(90%) contrast(85%);
        /* dette simulerer #65A46D */
      }
    }
  }
`;
