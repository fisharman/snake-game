import React, { useState, useEffect, useReducer, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Grid from './component/Grid';

let move = [0, 1];
const gridRow = 30;
const gridCol = 30;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function initGrid() {
  const grid = [];
  for (let row = 0; row < gridRow; row++) {
    const cols = [];
    for (let col = 0; col < gridCol; col ++) {
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
      head: [[15,15]],
      tail: [[15,14], [15, 13]]
    },
    food: // need to make sure it's not part of snake
    [generateFood()],
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
      move = [1, 0];
      break;
    case "ArrowUp":
      // Do something for "up arrow" key press.
      move = [-1, 0];
      break;
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      move = [0, -1];
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      move = [0, 1];
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
}

const generateFood = () => {
  return [
    Math.floor(Math.random() * 5), // row
    Math.floor(Math.random() * 5), // col
  ];
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'game_over':
      alert('You Lost')
      break;
    case 'update':
      return {
        ...state,
        ...action.payload
      }
    default: {
     return state;
  }
}
};

const checkWallBoundry = (i, j) => {
  if (i < 0 || i >= gridRow || j < 0 || j >= gridCol) {
    return true;
  }
  return false;
} 

const checkTail = (tailArray, i, j) => {
  return tailArray.some(([tailI, tailJ]) => {
    if (i === tailI && j === tailJ) {
      return true;
    }
    return false;
  });
}

function App() {
  const [state, dispatch] = useReducer(reducer, initState());

  useInterval(() => {
    const newState = {};
    // calculate new head position
    const headI = state.snake.head[0][0];
    const headJ = state.snake.head[0][1];

    const newHeadI = headI + move[0];
    const newHeadJ = headJ + move[1];

    if (checkWallBoundry(newHeadI, newHeadJ)) {
      dispatch('game_over');
      return;
    }

    if (checkTail(state.snake.tail, newHeadI, newHeadJ)) {
      dispatch('game_over');
      return;
    }

    const tail = state.snake.tail;
    tail.unshift(state.snake.head[0]);

    if (headI === state.food[0][0] && headJ === state.food[0][1]) {
      newState['food'] = [generateFood()];
    } else {
      tail.pop();
    }

    const newSnake = {
      tail,
      head: [[newHeadI, newHeadJ]],
    }
    
    dispatch({type: 'update', payload: {...newState, snake: newSnake}});
  }, 500);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    }
  },[]);
  
  const { message } = state

  return (
    <div className="App">
      <div className="message">{message}</div>
      <div className="grid-container">
        <div className="grid">
          <Grid
            grid={state.grid}
            snake={state.snake}
            food={state.food}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
