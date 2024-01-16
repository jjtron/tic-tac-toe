import React, { StrictMode } from "react";
import { useState } from 'react';

export default function Game() {
  const [sort, setSort] = useState(false);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  let isDraw = false;
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
          let noWinMsg = "";
          let w = calculateWinner(squares);
          if (w[0] !== null) {
          } else {
            if (currentMove === 9) {
                noWinMsg = ", and there is no winner.";
                isDraw = true;
            }
          }
          return (
            <li key={move}>
              <div>You are at move # {move} {noWinMsg}</div>
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
        <Board xIsNext={xIsNext} sqrs={currentSquares} onPlay={handlePlay} isDraw={isDraw} />
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

function Square({ value, onSqrClik, styleVar }) {
  return (
    <button className="square" onClick={onSqrClik} style={styleVar}>
      {value}
    </button>
  );
}

function Board({ xIsNext, sqrs, onPlay, isDraw }) {
  function do_Clik(i) {
    
    if (sqrs[i] || calculateWinner(sqrs)[0]) {
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
  const winnerArray = calculateWinner(sqrs);
  const winner = winnerArray[0];
  const winnerSquares  = winnerArray[1];
  
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Game over: a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let boardSquares = [];
  let boardRows = [];
  let winStyle = { backgroundColor: '#fff', };

  for (let i = 0; i <= 2; i++){
    for (let j = 0; j <= 2; j++){
      if (winnerSquares !== undefined)  {
          if (sqrs[j + 3 * i] === winner ) { 
            for (let n = 0; n <= 2; n++) {
                if (winnerSquares[n] === j + 3 * i) {
                    winStyle = { backgroundColor: 'red', };
                }
            }
          }
      }
      boardSquares.push(<Square key={j} value={sqrs[j + 3 * i]} styleVar={winStyle} onSqrClik={() => do_Clik(j + 3 * i)} />);
      winStyle = { backgroundColor: '#fff', };
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
      return [squares[a], lines[i]];
    }
  }
  return [null];
}
