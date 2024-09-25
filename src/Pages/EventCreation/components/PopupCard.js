import React, { useState } from "react";
import "../styles/EventCreationStyles.css";

const PopupOverlay = ({ title, children, onClose, notButton }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="title">
        <h3>{title}</h3>
        <button onClick={handleClose} id="close-button">X</button>
      </div>
      <div className="popup-content">{children}</div>
      <div className="popup-footer">
        {notButton && (
          <button onClick={handleClose} className="done-button buttons">
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default PopupOverlay;
