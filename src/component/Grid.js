import React from 'react'

const coordMatch = (coordArray, i, j) => {
    return coordArray.find(([tailI, tailJ]) => {
        if (i === tailI && j === tailJ) {
            return true;
        }
        return false; 
    });
}

const Grid = (props) => {
    return (
        props.grid.map((row, i) => {
            return row.map((cell, j) => {
                // isTail
                if(coordMatch(props.snake.tail, i, j)){
                    return <div key={cell.row+cell.col} className="cell cell-border cell-snake" />
                }
                // isFood
                if(coordMatch(props.food, i, j)) {
                    return <div key={cell.row+cell.col} className="cell cell-border cell-food" style={{ left: cell.row * 40, top: cell.col * 40 }}>🐀</div>
                }
                // isHead
                if (coordMatch(props.snake.head, i, j)){ 
                    return <div key={cell.row+cell.col} className="cell cell-border cell-head" />
                }
                return <div key={cell.row+cell.col} className="cell cell-border" />
            })
        })
    )
}

export default Grid;