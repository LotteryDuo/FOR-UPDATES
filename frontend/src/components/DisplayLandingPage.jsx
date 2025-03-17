import React from "react";
import { styled } from "styled-components";
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert.jsx";
import LottoIcon from "../assets/images/icon-1.png";
import SecondIcon from "../assets/images/icon-2.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonWithSound from "./ButtonWithSound.jsx";

export default function DisplaySignIn() {
  return (
    <>
      <GlobalStyle />
      <div className="w-screen min-h-screen flex flex-col ">
        <div
          className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col mobile-bg"
          style={{
            backgroundImage: "url('src/assets/images/background-image.png')",
          }}
        >
          <div
            className="absolute"
            style={{
              backgroundImage: "url('src/assets/images/final-logo.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              top: "20px",
              left: "2%",
              width: "200px",
              height: "200px",
              zIndex: "10",
            }}
          ></div>

          <PlayWinClaimContainer>
            <h1>
              <span className="play">Play</span> -{" "}
              <span className="win">Win</span> -
              <span className="claim"> Claim</span>
            </h1>

            <p>
              Get ready to strike it rich in just sixty seconds. Our Minute
              Lotto is the quickest way to turn your luck into cash!
            </p>
          </PlayWinClaimContainer>

          <IconContainer>
            <img src={LottoIcon} alt="Lotto Icon" className="icon" />
            <img src={SecondIcon} alt="Second Icon" className="icon" />
          </IconContainer>

          <StyledButton>
            <button className="btn-23">
              <span className="text">Sign In</span>
              <span aria-hidden className="marquee">
                Sign In
              </span>
            </button>
          </StyledButton>
        </div>
      </div>
    </>
  );
}

const PlayWinClaimContainer = styled.div`
  text-align: center;
  margin-top: 130px;

  h1 {
    font-size: 5rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
    font-family: "Jersey 20", sans-serif;
    background-color: #41644a;
    display: inline-block;
    padding: 4px 80px;
    border: 20px solid #ffcf50;
  }
  .play {
    color: #f55d06;
  }

  .win {
    color: #5dd77c;
  }

  .claim {
    color: #e8ac41;
  }

  p {
    font-size: 2rem;
    color: #000;
    margin: 0 auto 15px auto;
    font-family: "Jersey 20", sans-serif;
    text-align: center;
    max-width: 50%;
    line-height: 1.2;
    margin-top: 1%;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.8rem;
      padding: 10px 30px;
      border: 10px solid #ffcf50;
      margin-top: 15%;
    }

    p {
      font-size: 1.2rem;
      max-width: 80%;
      margin-top: 5%;
    }
  }
`;

const StyledButton = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 0px; 
  
  .btn-23,
  .btn-23 *,
  .btn-23 :after,
  .btn-23 :before,
  .btn-23:after,
  .btn-23:before {
    border: 0 solid;
    box-sizing: border-box;
  }

  .btn-23 {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: button;
    background-color: #D01010;
    background-image: none;
    color: #fff;
    cursor: pointer;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    font-size: 100%;
    font-weight: 900;
    line-height: 1.5;
    margin: 0;
    -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
    padding: 0;
    text-transform: uppercase;
    margin-top: 2%; 
    padding: 1rem 4rem; /* Increase padding for a larger button */
    font-size: 1.5rem; /* Increase font size for bigger text */
    border-width: 3px; /* Optional: Adjust border thickness */S

  }

  .btn-23:disabled {
    cursor: default;
  }

  .btn-23:-moz-focusring {
    outline: auto;
  }

  .btn-23 svg {
    display: block;
    vertical-align: middle;
  }

  .btn-23 [hidden] {
    display: none;
  }

  .btn-23 {
    border-radius: 99rem;
    cursor:pointer;
    border-width: 2px;
    overflow: hidden;
    padding: 0.8rem 3rem;
    position: relative;
  }

  .btn-23 span {
    display: grid;
    inset: 0;
    place-items: center;
    position: absolute;
    transition: opacity 0.2s ease;
  }

  .btn-23 .marquee {
    --spacing: 5em;
    --start: 0em;
    --end: 5em;
    -webkit-animation: marquee 1s linear infinite;
    animation: marquee 1s linear infinite;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
    opacity: 0;
    position: relative;
    text-shadow: #fff var(--spacing) 0, #fff calc(var(--spacing) * -1) 0,
      #fff calc(var(--spacing) * -2) 0;
  }
  
  .btn-23:hover {
    background-color:rgba(252, 21, 21, 1); 
    box-shadow: 0px 0px 10px 3px rgba(208, 16, 16, 0.8); 
    transition: all 0.3s ease-in-out; 
  }
    
  .btn-23:hover .marquee {
    -webkit-animation-play-state: running;
    animation-play-state: running;
    opacity: 1;
  }

  .btn-23:hover .text {
    opacity: 0;
  }

  @-webkit-keyframes marquee {
    0% {
      transform: translateX(var(--start));
    }

    to {
      transform: translateX(var(--end));
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(var(--start));
    }

    to {
      transform: translateX(var(--end));
    }

  @media (max-width: 768px) {
    .btn-23 {
      font-size: 1.2rem;
      padding: 0.8rem 2rem;
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 23%;
  margin: 1rem auto;
  align-items: center;

  .icon {
    width: 180px;
    height: 180px;
  }

  @media (max-width: 768px) {
    .icon {
      width: 130px;
      height: 100px;
      margin: 0 10px;
    }

    justify-content: center;
  }
`;

const GlobalStyle = styled.div`
  @media (max-width: 768px) {
    .mobile-bg {
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      height: 100% !important;
      width: 100% !important;
    }
  }
`;
