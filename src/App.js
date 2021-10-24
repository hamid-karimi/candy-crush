import { useEffect, useState } from "react"
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy
]

const App = () => {

  const [currenctColorArrangement, setCurrenctColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++){
      const columnOfFour = [i, i + width, i + width * 2 + i + width * 3]
      const decidedColor = currenctColorArrangement[i]

      if(columnOfFour.every(square => currenctColorArrangement[square] === decidedColor)){
        columnOfFour.forEach(square => currenctColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++){
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currenctColorArrangement[i]
      
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29,30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      if(notValid.includes(i)) continue
      if(rowOfFour.every(square => currenctColorArrangement[square] === decidedColor)){
        rowOfFour.forEach(square => currenctColorArrangement[square] = blank)
        return true
      }
    }
  }
  
  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++){
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currenctColorArrangement[i]

      if(columnOfThree.every(square => currenctColorArrangement[square] === decidedColor)){
        columnOfThree.forEach(square => currenctColorArrangement[square] = blank)
        return true
      }
    }
  }
  
  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++){
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currenctColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if(notValid.includes(i)) continue
      if(rowOfThree.every(square => currenctColorArrangement[square] === decidedColor)){
        rowOfThree.forEach(square => currenctColorArrangement[square] = blank)
        return true
      }
    }
  }


  const moveIntoSquareBelow = () =>{
    for (let i = 0; i <= 55; i++){

      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && currenctColorArrangement[i] === blank){
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currenctColorArrangement[i] = candyColors[randomNumber]
      }
      if((currenctColorArrangement[i + width]) === blank){
        currenctColorArrangement[i + width] = currenctColorArrangement[i]
        currenctColorArrangement[i] = blank
      }
    }
  } 
  
  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = (e) => {
    
     
    const squareBeignReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    const squareBeignDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))

    currenctColorArrangement[squareBeignReplacedId] = squareBeingDragged.getAttribute('src')
    currenctColorArrangement[squareBeignDraggedId] = squareBeingReplaced.getAttribute('src')
    
    const validMoves = [
      squareBeignDraggedId - 1,
      squareBeignDraggedId - width,
      squareBeignDraggedId + 1,
      squareBeignDraggedId + width,
    ]
    
    const validMove = validMoves.includes(squareBeignReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    console.log(squareBeignReplacedId+'--'+validMove+'--'+isAColumnOfFour+'--'+isARowOfFour+'--'+isAColumnOfThree+'--'+isARowOfThree)


    if (validMove && (isAColumnOfFour || isARowOfFour || isAColumnOfThree|| isARowOfThree )){
  
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)

    }else{
      currenctColorArrangement[squareBeignReplacedId] = squareBeingReplaced.getAttribute('src')
      currenctColorArrangement[squareBeignDraggedId] = squareBeingDragged.getAttribute('src')
      setCurrenctColorArrangement([...currenctColorArrangement])
    }
  }

  const createBoard = () => {
    const randomColorArrangement = []
    for(let i = 0; i < width * width; i++){
      
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorArrangement.push(randomColor)
    }
    setCurrenctColorArrangement(randomColorArrangement)
  }

  useEffect (() => {
    createBoard()
  }, []) 

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()

      checkForColumnOfThree()
      checkForRowOfThree()

      moveIntoSquareBelow()

      setCurrenctColorArrangement([...currenctColorArrangement])
    }, 100)
    
    return () => clearInterval(timer)
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currenctColorArrangement])
  
  return (
    <div className="app">
      <div className="game">
        {currenctColorArrangement.map((candyColor, index) => (
          <img
            key ={index}
            src={candyColor}
            alt={candyColor}
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
    </div>
  );
}

export default App;
