import React, { StrictMode } from "react";
import { useState } from 'react';

export default function Game() {
  const [sort, setSort] = useState(false);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares, noSort) {
    if (noSort) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);   
    } else {
        setSort(!sort);
    }
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function mapHistory(history, sort) {
      let theMap = history.map((squares, move) => {
        let description;
        if (move > 0 && currentMove === move) {
          return (
            <li key={move}>
              <div>You are at move # {move}</div>
              <div>&nbsp;</div>
            </li>
        );
        } else if (move > 0 && currentMove !== move) {
          description = 'Go to move #' + move;
          return showMoveButton(move, description, jumpTo);
        } else {
          description = 'Go to game start';
          return showMoveButton(move, description, jumpTo);
        }
      });
      if (sort) {
          return theMap.reverse();
      } else {
          return theMap;
      }
      
  }
  const moves = mapHistory(history, sort);
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} sqrs={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function showMoveButton(move, description, jumpTo) {
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
        <div>&nbsp;</div>   
      </li>
    );
}

function Square({ value, onSqrClik }) {
  return (
    <button className="square" onClick={onSqrClik}>
      {value}
    </button>
  );
}

function Board({ xIsNext, sqrs, onPlay }) {
  function do_Clik(i) {
    if (sqrs[i] || calculateWinner(sqrs)) {
      return;
    }
    const nextSquares = sqrs.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, true);
  }
  function onSort() {
      onPlay(null, false);
  }
  const winner = calculateWinner(sqrs);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let boardSquares = [];
  let boardRows = [];
  for (let i = 0; i <= 2; i++){
    for (let j = 0; j <= 2; j++){
      boardSquares.push(<Square key={j} value={sqrs[j + 3 * i]} onSqrClik={() => do_Clik(j + 3 * i)} />);
    }
    boardRows.push(<div key={i} className="board-row">{boardSquares}</div>);
    boardSquares = [];
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
      <br></br>
      <button onClick={onSort}>Sort Moves</button>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
