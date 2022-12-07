import { useEffect, useState } from "react";
import "./App.css";

const INITIAL_LENGTH = 4;
const CELL_SIZE = 10;
const CELLS = 50;
const BOARD_SIZE = CELLS * CELL_SIZE;

export default function App() {
  const [snake, setSnake] = useState(
    Array.from({ length: INITIAL_LENGTH }, () => [0, 0])
  );
  const [dirLen, setDirLen] = useState([]);

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

  useEffect(() => {
    const timerId = setTimeout(() => {
      const head = [...snake.at(-1)];
      const [dir, len] = dirLen;
      head[dir] = (head[dir] + len + BOARD_SIZE) % BOARD_SIZE;
      setSnake([...snake.slice(1), head]);
    }, 100);
    return () => clearTimeout(timerId);
  }, [snake, dirLen]);

  return (
    <>
      {snake.map(([top, left], i) => (
        <div key={i} className="snake" style={{ top, left }} />
      ))}
    </>
  );
}
