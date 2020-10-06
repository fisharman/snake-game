import React, { useState, useEffect, useReducer, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Grid from './component/Grid';

/**
 * TODO: count score (BONUS: save high scores in localStorage)
 * TODO: game over message not showing
 * TODO: restart after death (without browser refresh)
 * TODO: food disappear earlier
 * TODO: make head of snake easier to see
 */

const direction = {
  UP: [-1, 0],
  DOWN: [1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1]
}

let move = [0, 1];
const gridRow = 15;
const gridCol = 15;

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
      head: [[7,8]],
      tail: [[7,7], [7, 6]]
    },
    food: // need to make sure it's not part of snake
    [generateFood({
      head: [[7,8]],
      tail: [[7,7], [7, 6]]
    })],
    score: 0,
    showGrid: true,
    lost: false,
    message: 'Press <space> to start. Good luck!',
    inProgress: false,
    time: null,
    gameInProgress: false
  };
}

const handleKey = (e, state, dispatch) => {
  const newState = {};
  switch (e.code) {
    case "ArrowDown":
      if (move !== direction.UP) {
        move = direction.DOWN;
      }
      break;
    case "ArrowUp":
      // Do something for "up arrow" key press.
      if (move !== direction.DOWN) {
        move = direction.UP;
      }
      break;
    case "ArrowLeft":
      // Do something for "left arrow" key press.
      if (move !== direction.RIGHT) {
        move = direction.LEFT;
      }
      break;
    case "ArrowRight":
      // Do something for "right arrow" key press.
      if (move !== direction.LEFT) {
        move = direction.RIGHT;
      }
      break;
    case "Space":
      console.log('space pressed')
      if (!state.gameInProgress) {
        // start game some how
        dispatch({type: 'update', payload: {...newState, time: 200, gameInProgress: true }});
      }
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
}

const generateFood = (snake) => { 
    
  const checkI = (array, i) => {
    return array.some(([x, y]) => {
      return x === i;
    });
  }

  const checkJ = (array, j) => {
    return array.some(([x, y]) => {
      return y === j;
    });
  }

  let newI = Math.floor(Math.random() * gridRow);
  while (checkI(snake.head, newI) && checkI(snake.tail, newI)) {
    newI = Math.floor(Math.random() * gridRow);
  }
  
  let newJ = Math.floor(Math.random() * gridCol);
  while (checkJ(snake.head, newJ) && checkJ(snake.tail, newJ)) {
    newJ = Math.floor(Math.random() * gridRow);
  }
  
  return [newI, newJ];
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'game_over':
      return {
        ...state,
        message: "you lost"
      }
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
      newState['food'] = [generateFood(state.snake)];
    } else {
      tail.pop();
    }

    const newSnake = {
      tail,
      head: [[newHeadI, newHeadJ]],
    }
    
    dispatch({type: 'update', payload: {...newState, snake: newSnake}});
  }, state.time);

  useEffect(() => {
    document.addEventListener('keydown', e => handleKey(e, state, dispatch));
    return () => {
      document.removeEventListener('keydown', e => handleKey(e, state, dispatch));
    }
  },[]);

  return (
    <div className="App">
      <div className="message">{state.message}</div>
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
