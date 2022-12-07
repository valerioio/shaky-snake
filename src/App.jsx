import { useEffect, useState } from "react";
import "./App.css";

const INITIAL_LENGTH = 4;
const CELL_SIZE = 16;
const CELLS = 40;
const BOARD_SIZE = CELLS * CELL_SIZE;
const initialSnake = Array.from({ length: INITIAL_LENGTH }, () => [0, 0]);
const randomCell = () => Math.floor(Math.random() * CELLS) * CELL_SIZE;

export default function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [dirLen, setDirLen] = useState([1, CELL_SIZE]);
  const [apple, setApple] = useState([randomCell(), randomCell()]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      setDirLen([1, CELL_SIZE]);
      if (e.key === "ArrowRight") {
        setDirLen([1, CELL_SIZE]);
      } else if (e.key === "ArrowDown") {
        setDirLen([0, CELL_SIZE]);
      } else if (e.key === "ArrowLeft") {
        setDirLen([1, -CELL_SIZE]);
      } else if (e.key === "ArrowUp") {
        setDirLen([0, -CELL_SIZE]);
      }
    });
  }, []);

  //Move the snake
  useEffect(() => {
    const timerId = setTimeout(() => {
      const head = [...snake.at(-1)];
      const [dir, len] = dirLen;
      head[dir] = (head[dir] + len + BOARD_SIZE) % BOARD_SIZE;
      setSnake([...snake.slice(1), head]);
    }, 100 / (1 + score / 5));
    return () => clearTimeout(timerId);
  }, [snake, dirLen, score]);

  //Handle eating
  useEffect(() => {
    const head = snake.at(-1);
    if (head[0] === apple[0] && head[1] === apple[1]) {
      setScore(score + 1);
      setApple([randomCell(), randomCell()]);

      const tail = [...snake[0]];
      const [dir, len] = dirLen;
      tail[dir] -= len;
      setSnake([tail, ...snake]);
    }
  }, [snake, apple, score, dirLen]);

  return (
      <main className="playground">
      <h1>
        Use the arrow keys to start the game and move the snake
      </h1>
      <h3>score {score}</h3>
        {snake.map(([top, left], i) => (
          <div key={i} className="circle snake" style={{ top, left }} />
        ))}
        <div
          className="circle apple"
          style={{ top: apple[0], left: apple[1] }}
        />
      </main>
  );
}
