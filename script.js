document.addEventListener('DOMContentLoaded', function(){
    const checkerBoard = document.getElementById('checkersboard');
    let currentPosition = null;
    let path1 = null;
    let path2 = null;
    let capturePath1 = null;
    let capturePath2 = null;
    let turn = 'white';

    const board = [];
    for(let i=0; i<8; i++){
        board[i] = [];
        for(let j=0; j<8; j++){
            const isBlack = (i+j) % 2 === 1;

            const cell = document.createElement('div');
            cell.className = isBlack ? 'cell-black' : 'cell-white';
            cell.dataset.row = i;
            cell.dataset.col = j;

            if(isBlack && (i === 0 || i === 1)){
                const piece = document.createElement('div');
                piece.className = 'piece piece-black';
                piece.innerHTML = '&#9899;';

                attachAddEventListener(piece,'black');
                cell.appendChild(piece);
            } else if(isBlack && (i === 6 || i === 7)) {
                const piece = document.createElement('div');
                piece.className = 'piece piece-white';
                piece.innerHTML = '&#9898;';

                attachAddEventListener(piece,'white');
                cell.appendChild(piece);
            }
            checkerBoard.appendChild(cell);
            board[i][j] = cell;
        }
    }

    function attachAddEventListener(piece, color){
        piece.addEventListener('click', function(){
            if(color === turn){
                currentPosition = {
                    row: parseInt(piece.parentElement.dataset.row),
                    col: parseInt(piece.parentElement.dataset.col),
                    color: color
                }
                updatePaths();
            }
        })
    }

    function updatePaths() {
        const direction = currentPosition.color === 'black' ? 1 : -1;
        const path1Row = currentPosition.row + direction;
        const path1Col = currentPosition.col - 1;
        const path2Row = currentPosition.row + direction;
        const path2Col = currentPosition.col + 1;

        path1 = { row: path1Row, col: path1Col };
        path2 = { row: path2Row, col: path2Col };

        const capturePath1Row = currentPosition.row + 2 * direction;
        const capturePath1Col = currentPosition.col - 2;
        const capturePath2Row = currentPosition.row + 2 * direction;
        const capturePath2Col = currentPosition.col + 2;

        capturePath1 = { row: capturePath1Row, col: capturePath1Col };
        capturePath2 = { row: capturePath2Row, col: capturePath2Col };
    }

    function isValidMove(targetRow, targetCol) {
        // Check if the target cell is within the bounds of the board
        if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) {
            return false;
        }

        // Check if the target cell matches the simple move paths (one step diagonally)
        const isPath1 = targetRow === path1.row && targetCol === path1.col;
        const isPath2 = targetRow === path2.row && targetCol === path2.col;

        // Check if the target cell matches the capture move paths (two steps diagonally)
        const isCapturePath1 = targetRow === capturePath1.row && targetCol === capturePath1.col;
        const isCapturePath2 = targetRow === capturePath2.row && targetCol === capturePath2.col;

        // If the target cell matches a simple move path, the move is valid
        if (isPath1 || isPath2) {
            return true;
        } else if (isCapturePath1 || isCapturePath2) {
            // Calculate the intermediate cell coordinates
            const capturePath = isCapturePath1 ? capturePath1 : capturePath2;
            const intermediateRow = (currentPosition.row + capturePath.row) / 2;
            const intermediateCol = (currentPosition.col + capturePath.col) / 2;
            const captureCell = board[intermediateRow][intermediateCol];
            const capturePiece = captureCell.querySelector('.piece');

            // Check if the piece in the intermediate cell is of the opposite color
            if (capturePiece && capturePiece.classList.contains(`piece-${currentPosition.color === 'black' ? 'white' : 'black'}`)) {
                // If there's an opponent piece to capture, remove it and return true
                capturePiece.remove();
                return true;
            }
        }

        // If none of the conditions are met, the move is invalid
        return false;
    }

    checkerBoard.addEventListener('click', function(event){
        const targetCell = event.target.closest('.cell-black, .cell-white');

        if(currentPosition && targetCell){
            const clickedRow = parseInt(targetCell.dataset.row);
            const clickedCol = parseInt(targetCell.dataset.col);

            if(isValidMove(clickedRow, clickedCol) && currentPosition.querySelector('.piece') === null){
                const currentCell = board[currentPosition.row][currentPosition.col];
                const currentPiece = currentCell.querySelector('.piece');
                currentPiece.remove();

                const newPiece = document.createElement('div');
                newPiece.className = `piece piece-${currentPosition.color}`;
                newPiece.innerHTML = currentPosition.color === 'black' ? '&#9899;' : '&#9898;';
                targetCell.appendChild(newPiece);

                currentPosition = { row: clickedRow, col: clickedCol, color: currentPosition.color };

                turn = (turn === 'white')?'black':'white';
                updatePaths();
            }
        }
    });
});
