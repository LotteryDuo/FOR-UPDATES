import React from "react";
import PropTypes from "prop-types";

const Button = ({ text, onClick, className, key }) => {
  return (
    <button
      key={key}
      text={text}
      onClick={onClick}
      //   className={`w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      className={`p-2 text-white font-semibold focus:outline-none bg-sky-500 hover:bg-sky-700 ${className}`}
    >
      {text}
    </button>
  );
};

Button.prototype = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Button;
