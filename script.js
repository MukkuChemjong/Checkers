document.addEventListener('DOMContentLoaded', function(){
    const checkerBoard = document.getElementById('checkersboard');
    let currentPosition = null;
    let path1 = null; // Global variable to store path 1
    let path2 = null; // Global variable to store path 2

    const board = [];
    for(let i=0;i<8;i++){
        board[i] = [];
        for(let j=0;j<8;j++){
            const isBlack = (i+j) % 2 === 1;
            
            const cell = document.createElement('div');
            cell.className = isBlack ? 'cell-black':'cell-white';
            cell.dataset.row = i;
            cell.dataset.col = j;

            if(isBlack && (i===0 || i===1)){
                const piece = document.createElement('div');
                piece.className = 'piece';
                piece.innerHTML = '&#9899;';

                piece.addEventListener('click', function() {
                    currentPosition = { row: i, col: j };
                    updatePaths(); // Update paths when a piece is clicked
                });

                cell.appendChild(piece);
            }
            checkerBoard.appendChild(cell);

            board[i][j] = cell;
        }
    }

    function updatePaths() {
        // Update path 1 and path 2 based on current position
        const path1Row = currentPosition.row + 1;
        const path1Col = currentPosition.col - 1;
        const path2Row = currentPosition.row + 1;
        const path2Col = currentPosition.col + 1;
        
        path1 = { row: path1Row, col: path1Col };
        path2 = { row: path2Row, col: path2Col };
    }

    checkerBoard.addEventListener('click', function(event) {
        const targetCell = event.target.closest('.cell-black, .cell-white');

        if (targetCell && currentPosition) { // Check if user clicked a piece before clicking a grid

            const clickedRow = parseInt(targetCell.dataset.row);
            const clickedCol = parseInt(targetCell.dataset.col);

            // Check if the clicked cell matches either path 1 or path 2
            if ((clickedRow === path1.row && clickedCol === path1.col) ||
                (clickedRow === path2.row && clickedCol === path2.col)) {
                
                // Move the piece to the clicked cell
                const currentCell = board[currentPosition.row][currentPosition.col];
                const currentPiece = currentCell.querySelector('.piece');
                currentPiece.remove();

                const newPiece = document.createElement('div');
                newPiece.className = 'piece';
                newPiece.innerHTML = '&#9899;';
                targetCell.appendChild(newPiece);

                currentPosition = { row: clickedRow, col: clickedCol };
            }
        }
    });
});
