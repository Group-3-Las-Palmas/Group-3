import React, { useState } from "react";
import NavBarContainer from "./navBarStyled.js";
import ModalComponent from "./ModalComponent";

export const NavBar = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <NavBarContainer>
      <ul>
        <li>
          <button onClick={toggleModal} style={{ background: "none", border: "none" }}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </li>
        <li>{/* Andre navlinks */}</li>
      </ul>
      {isModalOpen && <ModalComponent onClose={toggleModal} />}
    </NavBarContainer>
  );
};