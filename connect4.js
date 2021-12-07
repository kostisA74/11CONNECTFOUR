/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

var WIDTH = 7;
var HEIGHT = 6;

const restart = document.querySelector('#resetBtn')
let gameStage = "playing" // Toggled between playing and stopped
const gameStatus = document.querySelector('#gameStatus')
var currPlayer = 1; // active player: 1 or 2
let nextPlayer = 2; // to toggle order
var board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

restart.addEventListener('click', restartGame)

function restartGame(){
  currPlayer = 1
  nextPlayer = 2
  gameStatus.innerText = "Player 1"
  gameStage = "playing"
  const pieces = [...document.querySelectorAll('.piece')] // Clears board!
  for (let element of pieces){
    element.remove()
  }
  for (let i = 0; i<WIDTH; i++){
    for (let j = 0; j<HEIGHT; j++){
      board[j][i] = null  //Clears in-memory board
    }
  }
}

function makeBoard(width, height) {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  let rowArray = []
  for (let row = 0; row < height; row++){
    for (let column = 0; column < width; column++){
      rowArray.push(null)
    }
    board.push(rowArray)
    rowArray =[]
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')
  // TODO: add comment for this code
  // This section creates a row of "WIDTH"(number) squares to be used as the top row of the game board
  // So a tr with id "column top" is added to the DOM that consists of tds with ids 0,1,2,...WIDTH respectively
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Adding a number of "HEIGHT" tr s to the DOM
  // and on each tr we append a number of "WIDTH" tds with id celly-x for a td that is the x-th on the y-th row of the table 
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
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
  for (let r = 5; r >= 0; r--)
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
  //if (currPlayer === 1) document.getElementById(`cell${y}-${x}`).style.backgroundColor = 'black'
  //else document.getElementById(`cell${y}-${x}`).style.backgroundColor = 'red'
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
    msg === 'Tie!'? gameStatus.innerText = 'No winner!' : gameStatus.innerText = `Winner: Player ${currPlayer}!`
    alert(msg)},1000)
  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameStage === "playing"){
    // get x from ID of clicked cell
  var x = +evt.target.id;

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
    return endGame(`Player ${currPlayer} won!`);
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
  gameStatus.innerText = `Player ${currPlayer}`
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
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard(WIDTH, HEIGHT);
makeHtmlBoard();
