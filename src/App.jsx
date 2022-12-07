import { useEffect, useState } from "react";
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

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
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

  //Handle eating and game over
  useEffect(() => {
    const head = snake.at(-1);
    if (overlap([head], apple)) {
      setScore(score + 1);
      setApple([randomCoord(), randomCoord()]);
      const tail = [...snake[0]];
      const [dir, len] = dirLen;
      tail[dir] -= len;
      setSnake([tail, ...snake]);
    }

    // setIsGameOver(overlap(snake.slice(0, -1), head));
  }, [snake, apple, score, dirLen]);

  return (
    <>
      <h1 className={`instructions${false ? "" : " hidden"}`}>
        Use the arrow keys to start the game and move the snake
      </h1>
      <h3 className="score">score {score}</h3>
      <main className="playground">
        {snake.map(([top, left], i) => (
          <div
            key={i}
            className="circle snake"
            style={{
              top: top + Math.random() * 2,
              left: left + Math.random() * 2,
            }}
          />
        ))}
        <div
          className="circle apple"
          style={{ top: apple[0], left: apple[1] }}
        />
      </main>
    </>
  );
}
