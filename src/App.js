import React, {useState, useEffect, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';

let move;

function initGrid() {
  const grid = [];
  for (let row = 0; row < 30; row++) {
    const cols = [];
    for (let col = 0; col < 30; col ++) {
      cols.push({
        row,
        col
      });
    }
    grid.push(cols);
  }
  return grid;
}

function initState() {
  const grid = initGrid();
  return {
    grid,
    snake: {
      head: {
        row: 15,
        col: 15
      },
      tail: []
    },
    food: {
      row: Math.floor(Math.random() * 5),
      col: Math.floor(Math.random() * 5),
    },
    score: 0,
    showGrid: true,
    lost: false,
    message: 'Press <space> to start. Good luck!',
    inProgress: false
  };
}

const handleKey = (e) => {
  switch (e.key) {
    case "ArrowDown":
      console.log("ArrowDown")
      break;
    case "ArrowUp":
      // Do something for "up arrow" key press.
      console.log("ArrowUp")
      break;
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      console.log("ArrowLeft")
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      console.log("ArrowRight")
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'game_lost':
      return {
        ...state,
        showGrid: state.showGrid,
        lost: true,
        message: 'Press <space> or touch/click to start a new game',
        inprogress: false,
      }
    case 'update':
      return {
        ...state,
        ...action.newstate
      }
    case 'toggle_grid':
      return {
        ...state,
        showGrid: !state.showGrid
      };

    case 'restart':
      let newState = {
        ...state,
        message: 'Game in progress',
        inprogress: true,
        lost: false,
        snake: {
          ...state.snake,
          head: {
            row: Math.floor(random() * 5),
            col: Math.floor(random() * 5),
          },
          tail: [],
        }
      }
      return newState;
    default: {
     return state;
  }
}
};


function random() {
  return Math.random();
}

function App() {
  const [state, dispatch] = useReducer(null, initState());
  console.log('state: ', state)

  const drawGrid = () => {
    const { grid } = state

    return (
      grid.map((row, i) => {
        return row.map(cell => {
          return <div key={cell.row+cell.col} className="cell cell-border" />
        })
      })
    )
  }

  
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    }
  },[]);
  
  const { message } = state

  return (
    <div className="App">
      <div class="message">{message}</div>
      <div className="grid-container">
        <div className="grid">
          { drawGrid() }
        </div>
      </div>
    </div>
  );
}

export default App;
