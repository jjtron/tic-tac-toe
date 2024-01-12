import React, { StrictMode } from "react";
import { useState } from 'react';
function Square({ value, onSqrClik }) {
  return (
    <button className="square" onClick={onSqrClik}>
      {value}
    </button>
  );
}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [sqrs, setSqrs] = useState(Array(9).fill(null));
  function do_Clik(i) {
    if (sqrs[i]) {
      return;
    }
    const nextSquares = sqrs.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSqrs(nextSquares);
    setXIsNext(!xIsNext);
  }
  return (
    <>
      <div className="board-row">
        <Square value={sqrs[0]} onSqrClik={() => do_Clik(0)} />
        <Square value={sqrs[1]} onSqrClik={() => do_Clik(1)} />
        <Square value={sqrs[2]} onSqrClik={() => do_Clik(2)} />
      </div>
      <div className="board-row">
        <Square value={sqrs[3]} onSqrClik={() => do_Clik(3)} />
        <Square value={sqrs[4]} onSqrClik={() => do_Clik(4)} />
        <Square value={sqrs[5]} onSqrClik={() => do_Clik(5)} />
      </div>
      <div className="board-row">
        <Square value={sqrs[6]} onSqrClik={() => do_Clik(6)} />
        <Square value={sqrs[7]} onSqrClik={() => do_Clik(7)} />
        <Square value={sqrs[8]} onSqrClik={() => do_Clik(8)} />
      </div>
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
