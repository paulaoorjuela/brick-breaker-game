let board
let boardWidth = 500
let boardHeight = 500

window.onload = () =>{
    board = document.getElementById('board')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d')

}