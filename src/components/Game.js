import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import Bird from "./Bird";
import Pipe from "./Pipe";
import Foreground from "./Foreground";

import BgImage from "../images/bg.png";
import BgImageTop from "../images/bgtop.png";
import BgMusic from "../audio/hasina.mp3";
import Scoreboard from "./Score";

let gameLoop;
let pipeGenerator;

const Game = ({ status, start, fly }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0); // Add score state
  const [restart, setRestart] = useState(false);

  if (status === "game-over") {
    clearInterval(gameLoop);
    clearInterval(pipeGenerator);
  }

  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGame(true);
      setTimeout(() => {
        setIsBlurred(false);
      }, 1000); // 1-second transition for the blur effect
    }, 3000); // 3-second delay before showing the game

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (restart === false) {
      const handleKeyPress = (e) => {
        fly();

        if (status !== "playing" && status !== "game-over") {
          start(setScore);
        }
        e.preventDefault();
      };

      // Add event listeners for both mouse clicks and touch events
      document.addEventListener("click", handleKeyPress);
      document.addEventListener("touchend", handleKeyPress);

      return () => {
        document.removeEventListener("click", handleKeyPress);
        document.removeEventListener("touchend", handleKeyPress);
      };
    }
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.warn("Audio playback failed:", error);
        });
      }
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchend", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchend", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchend", handleUserInteraction);
    };
  }, [status]);

  useEffect(() => {
    if (status && audioRef.current) {
      if (status === "playing") {
        audioRef.current.play().catch((error) => {
          console.warn("Audio playback failed:", error);
        });
      }
      return () => {
        // Stop music when the game is over
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Reset music to the start
        }
      };
    }
  }, [status]);

  const handleTryAgain = () => {
    // Dispatch action to restart the game and reset the score
    setScore(0);
    setRestart(true);
    start(setScore);
  };

  // useEffect(() => {
  //   if (status === "game-over") {
  //     setScore(0); // Reset score on game over
  //   }
  // }, [status]);

  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `url(${BgImageTop}) no-repeat center center`,
    backgroundSize: "cover",
    overflow: "hidden",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",
  };

  const mobileStyle = {
    backgroundSize: "contain", // Ensures the whole background image is visible on smaller screens
    backgroundPosition: "center top", // Adjusts the background positioning to focus more on the top
    background: `url(${BgImageTop}) repeat center center`,
  };

  return (
    <div
      style={{
        ...containerStyle,
        ...(window.innerWidth < 768 ? mobileStyle : {}),
      }}
    >
      {showGame && (
        <div
          style={{
            position: "relative",
            width: 288,
            height: 512,
            background: `url(${BgImage})`,
            overflow: "hidden",
            filter: isBlurred ? "blur(10px)" : "blur(0)",
            transition: "filter 1s ease-in-out",
            border: "6px solid white",
          }}
        >
          <audio ref={audioRef} src={BgMusic} loop />

          <Bird />
          <Pipe />
          <Foreground />
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            স্বজন: {score}
          </div>
          {status === "game-over" && (
            <Scoreboard score={score} onTryAgain={handleTryAgain} />
          )}
        </div>
      )}
    </div>
  );
};

const fly = () => {
  return (dispatch) => {
    dispatch({ type: "FLY" });
  };
};

const start = (setScore) => {
  return (dispatch, getState) => {
    const { status } = getState().game;

    if (status !== "playing") {
      gameLoop = setInterval(() => {
        dispatch({ type: "FALL" });
        dispatch({ type: "RUNNING" });

        check(dispatch, getState, setScore);
      }, 200);

      pipeGenerator = setInterval(() => {
        dispatch({ type: "GENERATE" });
      }, 3000);

      dispatch({ type: "START" });
    }
  };
};

const check = (dispatch, getState, setScore) => {
  const state = getState();
  const birdY = state.bird.y;
  const pipes = state.pipe.pipes;
  const x = state.pipe.x;

  const challenge = pipes
    .map(({ topHeight, passed }, i) => {
      return {
        index: i, // Track the index of the pipe
        x1: x + i * 200,
        y1: topHeight,
        x2: x + i * 200,
        y2: topHeight + 100,
        passed: passed, // Use the `passed` status from Redux state
      };
    })
    .filter(({ x1 }) => x1 > 0 && x1 < 288);

  if (birdY > 512 - 108) {
    dispatch({ type: "GAME_OVER" });
  }

  if (challenge.length) {
    const { x1, y1, x2, y2, index, passed } = challenge[0];

    if (
      (x1 < 120 && 120 < x1 + 52 && birdY < y1) ||
      (x2 < 120 && 120 < x2 + 52 && birdY > y2)
    ) {
      dispatch({ type: "GAME_OVER" });
    } else if (x1 + 52 < 120 && !passed) {
      setScore((prevScore) => prevScore + 1);
      dispatch({ type: "MARK_PASSED", index }); // Mark this pipe as passed
    }
  }
};

const mapStateToProps = ({ game }) => ({ status: game.status });
const mapDispatchToProps = { start, fly };

export default connect(mapStateToProps, mapDispatchToProps)(Game);
