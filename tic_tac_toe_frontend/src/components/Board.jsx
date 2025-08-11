import React from 'react';

/**
 * Square button for a single cell on the board
 */
// PUBLIC_INTERFACE
export function Square({ value, onClick, index }) {
  /** Renders a single clickable square for the Tic Tac Toe grid. */
  return (
    <button
      type="button"
      className={`square ${value ? 'filled' : ''}`}
      onClick={onClick}
      aria-label={`Square ${index + 1}, ${value || 'empty'}`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
export default function Board({ squares, onSquareClick }) {
  /** Renders the 3x3 board and delegates square click handling to parent. */
  const renderSquare = (i) => (
    <Square key={i} index={i} value={squares[i]} onClick={() => onSquareClick(i)} />
  );

  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe Board">
      <div className="board-row" role="row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row" role="row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row" role="row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}
