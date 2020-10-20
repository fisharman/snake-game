import React, { useEffect, useReducer, useRef } from 'react';
import './App.css';
import Grid from './component/Grid';

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
  const initialSnake = {
    head: [[7,8]],
    tail: [[7,7], [7, 6]]
  }
  const grid = initGrid();
  return {
    grid,
    snake: initialSnake,
    food: [[]],
    score: 0,
    highScore: localStorage.getItem('highScore') || 0,
    showGrid: true,
    lost: false,
    message: 'Press <space> to start. Good luck!',
    inProgress: false,
    time: null,
    gameInProgress: false
  };
}

const handleKey = (e, state, dispatch) => {
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
      console.log(state.highScore)
      if (!state.gameInProgress) {
        // start game some how
        const { snake } = initState()
        dispatch({type: 'update', payload: {
          ...initState(),
          time: 200,
          gameInProgress: true,
          highScore: localStorage.getItem('highScore') || 0,
          food: [generateFood(snake)]
        }
        });
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
        message: "you lost, press <space> to start a new game",
        time: null,
        gameInProgress: false,
        score: 0
      }
    case 'update':
      return {
        ...state,
        ...action.payload
      }
    case 'update_score':
      const localStorageHighScore = localStorage.getItem('highScore') || 0
      let highScore = localStorageHighScore
      if (state.score + 1 > localStorageHighScore) {
        localStorage.setItem('highScore', state.score +1);
        highScore = state.score + 1
      }
      return {
        ...state,
        score: state.score+1,
        highScore 
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
      console.log('checkWallBoundry')
      dispatch({type: 'game_over'});
      return;
    }

    if (checkTail(state.snake.tail, newHeadI, newHeadJ)) {
      dispatch({type: 'game_over'});
      return;
    }

    const tail = state.snake.tail;
    tail.unshift(state.snake.head[0]);

    if (headI === state.food[0][0] && headJ === state.food[0][1]) {
      console.log('new food generated')
      newState['food'] = [generateFood(state.snake)];
      dispatch({type: 'update_score'});
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
      <div className="message">
        Current Score: {state.score}<br />
        High Score: {state.highScore}
      </div>
    </div>
  );
}

export default App;
