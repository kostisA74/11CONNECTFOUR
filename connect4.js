/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
let curWIDTH = 6;
let curHEIGHT = 6;
let WIDTH = 6;
let HEIGHT = 6;

const dimensions = document.querySelector('#dimensions')
const restart = document.querySelector('#resetBtn')
const restartHover = document.querySelector('#resetHover')
const switchBtn = document.querySelector('#switchBtn')
const switchHover = document.querySelector('#switchHover')
const gameStatus = document.querySelector('#gameStatus')
const columnsSlider = document.querySelector('#columnsSlider')
const rowsSlider = document.querySelector('#rowsSlider')
// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
const htmlBoard = document.querySelector('#board')

let gamestarted = false
let gameStage = "playing" // Toggled between playing and stopped
let currPlayer = 1; // active player: 1 or 2
let nextPlayer = 2; // to toggle order
let player1Name = "Player1"
let player2Name = "Player2"
let nameMap = new Map()
let board = []; // array of rows, each row is array of cells  (board[y][x])

nameMap.set(1, player1Name)
nameMap.set(2, player2Name)
columnsSlider.min = 6
columnsSlider.max = 20
columnsSlider.value = 6
rowsSlider.min = 6
rowsSlider.max = 20
rowsSlider.value = 6
dimensions.innerText = `${HEIGHT}x${WIDTH}`

restart.addEventListener('click', restartGame)
restart.addEventListener('mouseover', showTip )
restart.addEventListener('mouseout', hideTip)
switchBtn.addEventListener('click', switchOrder)
switchBtn.addEventListener('mouseover', showTip)
switchBtn.addEventListener('mouseout', hideTip)
columnsSlider.addEventListener('change', getWidth)
rowsSlider.addEventListener('change', getHeight)

function showTip(event) {
  const btn = event.target.id
  btn === 'resetBtn' ? restartHover.style.visibility = 'visible' : switchHover.style.visibility = 'visible'
}
function hideTip(event) {
  const btn = event.target.id
  btn === 'resetBtn' ? restartHover.style.visibility = 'hidden' : switchHover.style.visibility = 'hidden'
}

function switchOrder() {
  [currPlayer, nextPlayer] = [nextPlayer, currPlayer]
  gameStatus.innerText = `${nameMap.get(currPlayer)} playing...`
}

function getWidth() {
  WIDTH = parseInt(columnsSlider.value)
  addColumnsMemBoard()
  addColumnsHtmlBoard()
  curWIDTH = WIDTH
  dimensions.innerText = `${HEIGHT}x${WIDTH}`
}

function getHeight() {
  HEIGHT = parseInt(rowsSlider.value)
  addRowsMemBoard()
  addRowsHtmlBoard()
  curHEIGHT = HEIGHT
  dimensions.innerText = `${HEIGHT}x${WIDTH}`
}

function restartGame(){
  currPlayer = 1
  nextPlayer = 2
  gamestarted = false
  gameStatus.innerText = `${nameMap.get(currPlayer)} playing...`
  gameStage = "playing"
  const pieces = [...document.querySelectorAll('.piece')] // Clears board!
  for (let element of pieces){
    element.remove()
  }
  clearBoard()
  toggleBtnDisabled()
}
function addColumnsMemBoard(){
  if (curWIDTH < WIDTH) {
    for (let row = 0; row < HEIGHT; row++){
      for (let column = curWIDTH; column < WIDTH; column++){
        board[row][column] = null
      }
    }
  }else if (curWIDTH > WIDTH) {
    for (let row = 0; row < HEIGHT; row++){
      board[row].splice(WIDTH, curWIDTH-WIDTH)
    }
  }
}

function addRowsMemBoard(){
  if (curHEIGHT < HEIGHT) {
    //for (let column = 0; column < WIDTH; column++){
      for (let row = curHEIGHT; row < HEIGHT; row++){
        const newRow = []
        for (let i=0; i<WIDTH; i++){
          newRow.push(null)
        }
        board.push(newRow)
      }
    //}
  }else if (curHEIGHT > HEIGHT) {
      board.splice(HEIGHT, curHEIGHT-HEIGHT)
  }
}

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
      let rowArray = []
    for (let row = 0; row < HEIGHT; row++){
      for (let column = 0; column < WIDTH; column++){
        rowArray.push(null)
      }
      board.push(rowArray)
      rowArray =[]
    }
}

function clearBoard(){
  for (let i = 0; i<WIDTH; i++){
    for (let j = 0; j<HEIGHT; j++){
      board[j][i] = null  //Clears in-memory board
    }
  }
}

function addColumnsHtmlBoard(){
  if (curWIDTH < WIDTH) {
    for (let y = 0; y < HEIGHT; y++  ){
      const row = document.querySelector(`#row${y}`)
      for (let x = curWIDTH; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.id = `cell${y}-${x}`
        row.append(cell);
      }
    }
    for (let x = curWIDTH; x< WIDTH; x++){
      const headCell = document.createElement("td");
      const top = document.querySelector('#column-top')
      headCell.setAttribute("id", `${x}`);
      top.append(headCell);
    }
  }else if (curWIDTH > WIDTH) {
    for (let y = 0; y < HEIGHT; y++  ){
      for (let x = WIDTH; x < curWIDTH; x++) {
        const cell = document.querySelector(`#cell${y}-${x}`);
        cell.remove()
      }
    }
    for (let x = WIDTH; x < curWIDTH; x++){
      const headCell = document.getElementById(`${x}`)
      headCell.remove()
    }
  }
}

function addRowsHtmlBoard(){
  if (curHEIGHT < HEIGHT) {
    for (let x = curHEIGHT; x < HEIGHT; x++  ){
      const newRow = document.createElement('tr')
      newRow.id = `row${x}`
      for (let y = 0; y < WIDTH; y++){
        const newCell = document.createElement('td')
        newCell.id = `cell${x}-${y}`
        newRow.appendChild(newCell)
      }
      htmlBoard.append(newRow)
    }
  }else if (curHEIGHT > HEIGHT) {
      for (let x = HEIGHT; x < curHEIGHT; x++) {
        const row = document.querySelector(`#row${x}`);
        row.remove()
      }
  }
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  // TODO: add comment for this code
  // This section creates a row of "WIDTH"(number) squares to be used as the top row of the game board
  // So a tr with id "column top" is added to the DOM that consists of tds with ids 0,1,2,...WIDTH respectively

    let top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    for (var x = 0; x < WIDTH; x++) {
      var headCell = document.createElement("td");
      headCell.setAttribute("id", `${x}`);
      top.append(headCell);
    }
    htmlBoard.append(top);

  // TODO: add comment for this code
  // Adding a number of "HEIGHT" tr s to the DOM
  // and on each tr we append a number of "WIDTH" tds with id celly-x for a td that is the x-th on the y-th row of the table 
  
    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement("tr");
      row.setAttribute("id", `row${y}`);
      row.id = `row${y}`
      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        cell.id = `cell${y}-${x}`
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  
  for (let r = HEIGHT-1; r >= 0; r--)
  {
    if (board[r][x] === null) return r
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const gamePiece = document.createElement('div')
  gamePiece.id = `piece${y}-${x}`
  gamePiece.classList.add('piece')
  gamePiece.classList.add(`player${currPlayer}`)
  animateDrop(y,x,gamePiece)
}

function animateDrop(y,x,piece ){
  if (y === 0){
    document.querySelector(`#cell${0}-${x}`).appendChild(piece)  
  }
  else {
    document.querySelector(`#cell${0}-${x}`).appendChild(piece)
    for (let row = 0; row < y; row++){
      setTimeout(()=>{ 
      transit(row, piece)
      },(row+1)*50)
    }
  }
  
  function transit(y, piece){
      piece.remove()
      document.querySelector(`#cell${y+1}-${x}`).appendChild(piece)
  }
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(()=> {
    msg === 'Tie!'? gameStatus.innerText = 'No winner!' : gameStatus.innerText = `Winner: ${nameMap.get(currPlayer)}!`
    alert(msg)},1000)
  // TODO: pop up alert message
}

function toggleBtnDisabled () {
  !switchBtn.disabled? switchBtn.disabled =  true : switchBtn.disabled = false
  !rowsSlider.disabled? rowsSlider.disabled = true : rowsSlider.disabled = false
  !columnsSlider.disabled? columnsSlider.disabled = true : columnsSlider.disabled = false
}
/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (!gamestarted) {
    gamestarted = true
    toggleBtnDisabled()
  }
  if (gameStage === "playing"){
    // get x from ID of clicked cell
  var x = +evt.target.id.toString();
  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  //board[y][x] = currPlayer; //Mark current spot with player's id
  
  board[y][x] = currPlayer
  
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    gameStage = "stopped"
    return endGame(`${nameMap.get(currPlayer)} won!`);
  }
  
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie()){
    gameStage = "stopped"
    return endGame("Tie!")
  }
  
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  [currPlayer , nextPlayer] = [nextPlayer, currPlayer]
  gameStatus.innerText = `${nameMap.get(currPlayer)} playing...`
  }
}

function checkForTie(){
  for (let row = 0; row < HEIGHT; row++){
    for (let column = 0; column < WIDTH; column++){
      if (board[row][column] === null){
        return false
      }
    }
  }
  return true
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //a table containing all horizontal 'fours'
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //a table containing all vertical 'fours'
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //a table containing all diagonal 'fours' top-left to botom-right
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //a table containing all diagonal 'fours' top-right to botom-left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // if there's a 'four' of the current player returns true, ie currPlayer wins!
        return true; 
      }
    }
  }
}

gameStatus.innerText = `${nameMap.get(currPlayer)} playing...`

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
makeBoard();
makeHtmlBoard();
setTimeout(()=>{
  player1Name = prompt("Who is player1?", "Please enter a nickname");
  player2Name = prompt("Who is player2?", "Please enter a nickname");
  if (player1Name && player1Name !== "Please enter a nickname") nameMap.set(1, player1Name)
  if (player2Name && player2Name !== "Please enter a nickname") nameMap.set(2, player2Name)
  gameStatus.innerText = `${nameMap.get(currPlayer)} playing...`
},200)

  
