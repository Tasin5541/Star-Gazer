import React, { useState, useEffect } from "react";
import utils from "../math-utils";
import useGameState from "../customHooks/useGameState";

import StarsDisplay from "./StarsDisplay";
import PlayNumber from "./PlayNumber";
import PlayAgain from "./PlayAgain";

// const useGameState = () => {
//   const [stars, setStars] = useState(utils.random(1, 9));
//   const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
//   const [candidateNums, setCandidateNums] = useState([]);
//   const [secondsLeft, setSecondsLeft] = useState(10);

//   useEffect(() => {
//     if (secondsLeft > 0 && availableNums.length > 0) {
//       const timerId = setTimeout(
//         () => setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1),
//         1000
//       );
//       return () => clearTimeout(timerId);
//     }
//   }, [secondsLeft, availableNums]);

//   const setGameState = (newCandidateNums) => {
//     if (utils.sum(newCandidateNums) !== stars) {
//       setCandidateNums(newCandidateNums);
//     } else {
//       const newAvailableNums = availableNums.filter(
//         (n) => !newCandidateNums.includes(n)
//       );
//       setStars(utils.randomSumIn(newAvailableNums, 9));
//       setAvailableNums(newAvailableNums);
//       setCandidateNums([]);
//     }
//   };

//   return { stars, availableNums, candidateNums, secondsLeft, setGameState };
// };

const Game = (props) => {
  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus =
    availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "active";

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return "used";
    }

    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate";
    }

    return "available";
  };

  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === "used" || secondsLeft === 0) {
      return;
    }

    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter((cn) => cn !== number);

    setGameState(newCandidateNums);
  };

  return (
    <div className="d-flex align-items-center min-vh-100">
      <div className="game">
        <div className="help">
          <h2>Star Gazer</h2>
        </div>
        <div className="body">
          <div className="left">
            {gameStatus !== "active" ? (
              <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
            ) : (
              <StarsDisplay count={stars} />
            )}
          </div>
          <div className="right">
            {utils.range(1, 9).map((number) => (
              <PlayNumber
                key={number}
                status={numberStatus(number)}
                number={number}
                onClick={onNumberClick}
              />
            ))}
          </div>
        </div>
        <div className="timer text-danger">Time Remaining: {secondsLeft}</div>
        <div className="rules">
          <h4>
            <strong>Rules:</strong>
          </h4>
          <ul>
            <li>
              Select a number that sums upto the numbers of stars displayed on
              the left
            </li>
            <li>Example: 9 stars = 9 or (8+1) or (5+4)</li>
            <li>
              If the sum of numbers exceeds the total star count, the number
              will turn red
            </li>
            <li>
              You can de-select a number if it's red or blue. You can't
              de-select a green number
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Game;
