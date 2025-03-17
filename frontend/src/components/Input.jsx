import React from "react";
import { styled } from "styled-components";

const Input = () => {
  return (
    <StyledWrapper>
      <div className="form__group field">
        <input
          type="input"
          className="form__field"
          placeholder="enter-bet"
          required
          style={{ fontSize: "16px" }} // Change font size here
        />
        <label
          htmlFor="enter-bet"
          className="form__label"
          style={{ fontSize: "14px" }}
        >
          Enter Bet
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form__group {
    position: relative;
    padding: 20px 0 0;
    width: 100%;
    max-width: 180px;
    margin: 0 auto; /* Centers the input */
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: none;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 14px;
    color: #fff;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
  }

  .form__field::placeholder {
    color: transparent;
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 17px;
    cursor: text;
    top: 20px;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 10px;
    color: #9b9b9b;
    pointer-events: none;
  }

  .form__field:focus {
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, #116399, #38caef);
    border-image-slice: 1;
  }

  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 17px;
    color: #38caef;
    font-weight: 700;
  }

  /* reset input */
  .form__field:required,
  .form__field:invalid {
    box-shadow: none;
  }
`;

export default Input;
