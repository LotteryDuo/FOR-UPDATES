import React from "react";
import clickSound from "../assets/sounds/click.mp3"; // ✅ Import click sound

const ButtonWithSound = ({ children, onClick, className, style }) => {
  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.volume = 0.75; // ✅ Adjust volume (0.0 - 1.0)
    audio.playbackRate = 5.0; // ✅ Speed up sound (2x)
    audio.play().catch((error) => {
      console.error("Audio play error:", error);
    });
  };

  const handleClick = () => {
    playClickSound();
    if (onClick) {
      onClick(); // ✅ Call the button's actual function
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ style }}
      className={`${className} p-2 text-white font-semibold focus:outline-none transition`}
    >
      {children}
    </button>
  );
};

export default ButtonWithSound;
