import React from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 300px;
  padding: 40px 20px 20px 20px;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  background-color: #f2f2f2;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const ModalComponent = ({ onClose }) => {
  return (
    <ModalWrapper>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <MenuContainer>
          <MenuButton>All activities</MenuButton>
          <MenuButton>Community</MenuButton>
          <MenuButton>Profile</MenuButton>
          <LogoutButton>Log out</LogoutButton>
        </MenuContainer>
      </ModalContent>
    </ModalWrapper>
  );
};

export default ModalComponent;
