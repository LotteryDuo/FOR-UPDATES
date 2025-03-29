import React from "react";
import { styled } from "styled-components";

// ✅ WinningPopup Component
const WinningPopup = ({ onClose }) => {
  return (
    <Overlay>
      <div className="flex flex-col items-center">
        {/* Winning Images */}
        <WinningImages>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              style={{
                backgroundImage: "url('/assets/images/winning-img.png')",
              }}
            ></div>
          ))}
        </WinningImages>

        {/* Winning Message */}
        <PopupContainer>
          <WinningText>YOU WON!</WinningText>
          <CloseButton onClick={onClose}>OK</CloseButton>
        </PopupContainer>
      </div>
    </Overlay>
  );
};

// ✅ Styled Components with Media Queries
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
`;

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffcf50;
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

const WinningImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: -20px;

  div {
    width: 100px;
    height: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    margin: 5px;

    @media (max-width: 1440px) {
      width: 90px;
      height: 90px;
    }

    @media (max-width: 1024px) {
      width: 80px;
      height: 80px;
    }

    @media (max-width: 768px) {
      width: 70px;
      height: 70px;
    }

    @media (max-width: 480px) {
      width: 60px;
      height: 60px;
    }
  }
`;

const WinningText = styled.h2`
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

export default WinningPopup;
