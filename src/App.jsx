import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./App.css";

const INITIAL_LENGTH = 4;
const CELL_SIZE = 16;
const CELLS = 40;
const BOARD_SIZE = CELLS * CELL_SIZE;
const initialSnake = Array.from({ length: INITIAL_LENGTH }, (_, i) => [
  0,
  CELL_SIZE * i,
]);
const overlap = (coords, [x2, y2]) =>
  coords?.some(([x1, y1]) => x1 === x2 && y1 === y2);
const randomCoord = () => Math.floor(Math.random() * CELLS) * CELL_SIZE;

export default function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [dirLen, setDirLen] = useState([1, CELL_SIZE]);
  const [apple, setApple] = useState([randomCoord(), randomCoord()]);
  const [score, setScore] = useState(0);
  const [bump, setBump] = useState(-1);

  function handleKeydown(e) {
    if (e.key === "ArrowRight" && dirLen[0] === 0) {
      setDirLen([1, CELL_SIZE]);
    } else if (e.key === "ArrowDown" && dirLen[0] === 1) {
      setDirLen([0, CELL_SIZE]);
    } else if (e.key === "ArrowLeft" && dirLen[0] === 0) {
      setDirLen([1, -CELL_SIZE]);
    } else if (e.key === "ArrowUp" && dirLen[0] === 1) {
      setDirLen([0, -CELL_SIZE]);
    }
  }

  const snakeStyles = (top, left, i) => {
    return {
      top: top + Math.random() * 2 + (i === bump - 1 ? -2 : 0),
      left: left + Math.random() * 2 + (i === bump - 1 ? -2 : 0),
      width: CELL_SIZE + (i === bump - 1 ? 0 : -4),
      height: CELL_SIZE + (i === bump - 1 ? 0 : -4),
    };
  };

  const appleStyles = {
    top: apple[0],
    left: apple[1],
    width: CELL_SIZE - 4,
    height: CELL_SIZE - 4,
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [dirLen]);

  //Handle movement
  useEffect(() => {
    const timerId = setTimeout(() => {
      const head = [...snake.at(-1)];
      const [dir, len] = dirLen;
      head[dir] = (head[dir] + len + BOARD_SIZE) % BOARD_SIZE;
      setSnake([...snake.slice(1), head]);
      setBump(bump - 1);
    }, 100 / (1 + score / 5));
    return () => clearTimeout(timerId);
  }, [snake, bump]);

  //Handle eating
  useEffect(() => {
    const head = snake.at(-1);
    if (overlap([head], apple)) {
      setScore(score + 1);
      setApple([randomCoord(), randomCoord()]);
      setBump(snake.length);
    }
  }, [snake]);
  // setIsGameOver(overlap(snake.slice(0, -1), head));

  //Handle growing
  useEffect(() => {
    if (!bump) {
      const [[x1, y1], [x2, y2]] = snake;
      setSnake([
        [
          (2 * x1 - x2 + BOARD_SIZE) % BOARD_SIZE,
          (2 * y1 - y2 + BOARD_SIZE) % BOARD_SIZE,
        ],
        ...snake,
      ]);
    }
  }, [bump]);

  return (
    <>
      <h1 className={`instructions${false ? "" : " hidden"}`}>
        Use the arrow keys to start the game and move the snake
      </h1>
      <h3 className="score">score {score}</h3>
      <main className="playground">
        {snake.map(([top, left], i) => (
          <div key={uuidv4()} className="snake" style={snakeStyles(top, left, i)} />
        ))}
        <div className="apple" style={appleStyles} />
      </main>
    </>
  );
}
