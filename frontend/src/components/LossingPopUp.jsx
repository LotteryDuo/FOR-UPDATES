import React from "react";
import { styled } from "styled-components";

// ✅ LosingPopup Component
const LosingPopup = ({ onClose }) => {
  return (
    <Overlay>
      <PopupContainer>
        <LosingText>YOU LOST!</LosingText>
        <CloseButton onClick={onClose}>OK</CloseButton>
      </PopupContainer>
    </Overlay>
  );
};

// ✅ Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
`;

const PopupContainer = styled.div`
  background: #9e9e9e;
  padding: 4rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  width: 500px;

  @media (max-width: 1440px) {
    width: 480px;
  }

  @media (max-width: 1024px) {
    width: 400px;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    width: 350px;
    padding: 2rem;
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 1.5rem;
  }
`;

const LosingText = styled.h2`
  font-size: 50px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
  font-family: "Jersey 20", sans-serif;

  @media (max-width: 1440px) {
    font-size: 46px;
  }

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 30px;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 10px 20px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

export default LosingPopup;
