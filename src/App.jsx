import "./App.css";
import { useState, useEffect } from "react";
import ScoreBoard from "./components/ScoreBoard";
import blue from "./imgs/blue-squirtle.png";
import green from "./imgs/green-bulbasaur.png";
import orange from "./imgs/orange-charmander.png";
import purple from "./imgs/purple-haunter.png";
import red from "./imgs/red-magikarp.png";
import yellow from "./imgs/yellow-pikachu.png";
import blank from "./imgs/blank-pokeball.png";

const width = 8;
const candyColors = [blue, green, orange, purple, red, yellow];

const App = () => {
  const [currentColors, setCurrentColors] = useState([]);
  const [draggedSquare, setDraggedSquare] = useState(null);
  const [replacedSquare, setReplacedSquare] = useState(null);
  const [score, setScore] = useState(0);

  const checkColumsOf4 = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOf4 = [i, i + width, i + width * 2, i + width * 3];
      const color = currentColors[i];
      const isBlank = currentColors[i] === blank;
      if (
        columnOf4.every((square) => currentColors[square] === color && !isBlank)
      ) {
        setScore((score) => score + 4);
        columnOf4.forEach((square) => (currentColors[square] = blank));
        return true;
      }
    }
  };
  const checkRowsOf4 = () => {
    for (let i = 0; i < 64; i++) {
      const rowOf4 = [i, i + 1, i + 2, i + 3];
      const color = currentColors[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentColors[i] === blank;
      if (notValid.includes(i)) continue;
      if (
        rowOf4.every((square) => currentColors[square] === color && !isBlank)
      ) {
        setScore((score) => score + 4);
        rowOf4.forEach((square) => (currentColors[square] = blank));
        return true;
      }
    }
  };
  const checkColumsOf3 = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOf3 = [i, i + width, i + width * 2];
      const color = currentColors[i];
      const isBlank = currentColors[i] === blank;
      if (
        columnOf3.every((square) => currentColors[square] === color && !isBlank)
      ) {
        setScore((score) => score + 3);
        columnOf3.forEach((square) => (currentColors[square] = blank));
        return true;
      }
    }
  };
  const checkRowsOf3 = () => {
    for (let i = 0; i < 64; i++) {
      const rowOf3 = [i, i + 1, i + 2];
      const color = currentColors[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColors[i] === blank;
      if (notValid.includes(i)) continue;
      if (
        rowOf3.every((square) => currentColors[square] === color && !isBlank)
      ) {
        setScore((score) => score + 3);
        rowOf3.forEach((square) => (currentColors[square] = blank));
        return true;
      }
    }
  };

  const moveBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColors[i] === blank) {
        let randomNum = Math.floor(Math.random() * candyColors.length);
        currentColors[i] = candyColors[randomNum];
      }
      if (currentColors[i + width] === blank) {
        currentColors[i + width] = currentColors[i];
        currentColors[i] = blank;
      }
    }
  };

  console.log(score);

  const dragStart = (e) => {
    setDraggedSquare(e.target);
  };

  const dragDrop = (e) => {
    setReplacedSquare(e.target);
  };

  const dragEnd = () => {
    const draggedId = Number(draggedSquare.getAttribute("data-id"));
    const replacedId = Number(replacedSquare.getAttribute("data-id"));

    currentColors[replacedId] = draggedSquare.getAttribute("src");
    currentColors[draggedId] = replacedSquare.getAttribute("src");

    const validMoves = [
      draggedId - 1,
      draggedId - width,
      draggedId + 1,
      draggedId + width,
    ];
    const isValidMove = validMoves.includes(replacedId);

    const isColOf4 = checkColumsOf4() || false;
    const isColOf3 = checkColumsOf3() || false;
    const isRowOf4 = checkRowsOf4() || false;
    const isRowOf3 = checkRowsOf3() || false;

    if (
      replacedId &&
      isValidMove &&
      (isRowOf3 || isRowOf4 || isColOf4 || isColOf3)
    ) {
      setDraggedSquare(null);
      setReplacedSquare(null);
    } else {
      currentColors[replacedId] = replacedSquare.getAttribute("src");
      currentColors[draggedId] = draggedSquare.getAttribute("src");
      setCurrentColors([...currentColors]);
    }
  };

  const createBoard = () => {
    const randomizedColors = [];
    for (let i = 0; i < width * width; i++) {
      randomizedColors.push(
        candyColors[Math.floor(Math.random() * candyColors.length)]
      );
    }
    setCurrentColors(randomizedColors);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkColumsOf4();
      checkColumsOf3();
      checkRowsOf4();
      checkRowsOf3();
      moveBelow();
      setCurrentColors([...currentColors]);
    }, 200);
    return () => clearInterval(timer);
  }, [
    checkColumsOf4,
    checkColumsOf3,
    checkRowsOf4,
    checkRowsOf3,
    moveBelow,
    currentColors,
  ]);

  // console.log(currentColors);
  return (
    <div className="app">
      <div className="game">
        {currentColors.map((candy, index) => (
          <img
            key={index}
            style={{ backgroundColor: candy }}
            src={candy}
            alt={candy}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={score} />
    </div>
  );
};

export default App;
// https://www.youtube.com/watch?v=PBrEq9Wd6_U
