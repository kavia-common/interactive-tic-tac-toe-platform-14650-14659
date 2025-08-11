import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Board from './components/Board';

/**
 * Utility functions for Tic Tac Toe logic
 */

// Check for a winner on the board
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diags
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getAvailableMoves(squares) {
  const moves = [];
  for (let i = 0; i < squares.length; i += 1) {
    if (!squares[i]) moves.push(i);
  }
  return moves;
}

/**
 * Minimax AI for unbeatable Tic Tac Toe (with depth preference)
 * aiPlayer: 'O', humanPlayer: 'X' by design
 */
function minimax(squares, currentPlayer, aiPlayer, humanPlayer, depth = 0) {
  const winner = calculateWinner(squares);
  if (winner === aiPlayer) return { score: 10 - depth };
  if (winner === humanPlayer) return { score: depth - 10 };

  const avail = getAvailableMoves(squares);
  if (avail.length === 0) return { score: 0 }; // draw

  // Explore moves
  const moves = [];
  for (const idx of avail) {
    const newBoard = squares.slice();
    newBoard[idx] = currentPlayer;

    const result = minimax(
      newBoard,
      currentPlayer === aiPlayer ? humanPlayer : aiPlayer,
      aiPlayer,
      humanPlayer,
      depth + 1
    );
    moves.push({ index: idx, score: result.score });
  }

  // Choose best move for current player
  if (currentPlayer === aiPlayer) {
    // maximize
    let bestScore = -Infinity;
    let bestMove = moves[0];
    for (const m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
    return bestMove;
  } else {
    // minimize
    let bestScore = Infinity;
    let bestMove = moves[0];
    for (const m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
    return bestMove;
  }
}

// PUBLIC_INTERFACE
export default function App() {
  /** This component renders the complete Tic Tac Toe UI and manages game state, modes, scores, and AI. */

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState('AI'); // 'AI' or 'HUMAN'
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [statusBanner, setStatusBanner] = useState('');

  const currentPlayer = xIsNext ? 'X' : 'O';
  const aiPlayer = 'O';
  const humanPlayer = 'X';

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && getAvailableMoves(squares).length === 0,
    [squares, winner]
  );

  // Update game over and status text
  useEffect(() => {
    if (winner) {
      setGameOver(true);
      setStatusBanner(`${winner} wins!`);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (isDraw) {
      setGameOver(true);
      setStatusBanner("It's a draw!");
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setGameOver(false);
      setStatusBanner(`${currentPlayer}'s turn`);
    }
  }, [winner, isDraw, currentPlayer]);

  // AI move effect
  useEffect(() => {
    if (mode === 'AI' && !gameOver && !xIsNext) {
      const timer = setTimeout(() => {
        const best = minimax(squares, aiPlayer, aiPlayer, humanPlayer);
        const aiIndex = best?.index;
        if (aiIndex !== undefined && squares[aiIndex] == null) {
          const next = squares.slice();
          next[aiIndex] = aiPlayer;
          setSquares(next);
          setXIsNext(true);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [mode, gameOver, xIsNext, squares]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /** Handles player clicking on a board square in either mode. */
    if (gameOver || squares[index] || (mode === 'AI' && !xIsNext)) return;

    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const startNewRound = () => {
    /** Starts a new round, keeping the current score tally intact. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatusBanner("X's turn");
    setGameOver(false);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Resets the board and scoreboard back to initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setMode('AI');
    setScores({ X: 0, O: 0, draws: 0 });
    setStatusBanner("X's turn");
    setGameOver(false);
  };

  // PUBLIC_INTERFACE
  const changeMode = (newMode) => {
    /** Switches between 2-Player and AI mode. Starts a new round on change. */
    setMode(newMode);
    startNewRound();
  };

  return (
    <div className="app-root">
      <div className="container">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">{statusBanner}</p>
        </header>

        <section className="game-area" aria-label="Tic Tac Toe board and scoreboard">
          <div className="board-wrapper">
            <Board squares={squares} onSquareClick={handleSquareClick} />
          </div>

          <div className="scoreboard" aria-label="Scoreboard">
            <div className="score-card">
              <span className="score-label">X Wins</span>
              <span className="score-value">{scores.X}</span>
            </div>
            <div className="score-card">
              <span className="score-label">O Wins</span>
              <span className="score-value">{scores.O}</span>
            </div>
            <div className="score-card">
              <span className="score-label">Draws</span>
              <span className="score-value">{scores.draws}</span>
            </div>
          </div>
        </section>

        <section className="controls" aria-label="Game controls">
          <div className="mode-toggle" role="tablist" aria-label="Game mode">
            <button
              role="tab"
              aria-selected={mode === 'HUMAN'}
              className={`toggle-btn ${mode === 'HUMAN' ? 'active' : ''}`}
              onClick={() => changeMode('HUMAN')}
            >
              2-Player
            </button>
            <button
              role="tab"
              aria-selected={mode === 'AI'}
              className={`toggle-btn ${mode === 'AI' ? 'active' : ''}`}
              onClick={() => changeMode('AI')}
            >
              Play vs AI
            </button>
          </div>

          <div className="actions">
            <button className="btn primary" onClick={startNewRound} aria-label="Start new round">
              New Round
            </button>
            <button className="btn accent" onClick={resetGame} aria-label="Reset game and scores">
              Reset Game
            </button>
          </div>
        </section>

        <footer className="footer">
          <small className="hint">
            Mode: {mode === 'AI' ? 'Play vs AI (X starts, O is AI)' : '2-Player (X vs O)'}
          </small>
        </footer>
      </div>
    </div>
  );
}
