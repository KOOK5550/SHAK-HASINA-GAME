import React from "react";
import ScoreboardImage from "../images/score.png";

const Scoreboard = ({ score, onTryAgain }) => {
  const containerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    color: "white",
    textAlign: "center",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
  };

  const textStyle = {
    marginTop: "5px",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const pookieStyle = {
    marginTop: "-50%",
    fontSize: "18px",
    fontStyle: "italic",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#ff5722",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <div style={containerStyle}>
      <img src={ScoreboardImage} alt="Scoreboard" style={imageStyle} />
      <div style={pookieStyle}>Pookie,</div>
      <div style={textStyle}>আপনি {score}টি স্বজন হারিয়েছেন</div>
      <button
        style={buttonStyle}
        onClick={() => {
          onTryAgain();
        }}
        onTouchStart={() => {
          onTryAgain();
        }}
      >
        Try Again
      </button>
    </div>
  );
};

export default Scoreboard;
