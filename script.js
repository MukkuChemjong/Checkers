document.addEventListener('DOMContentLoaded', function(){
    const checkerBoard = document.getElementById('checkersboard');
    let currentPosition = null;
    let paths = [];
    let capturePaths = [];
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
        paths = [];
        capturePaths = [];
        const direction = currentPosition.color === 'black' ? 1 : -1;
        const isQueen = board[currentPosition.row][currentPosition.col].querySelector('.queen') !== null;

        if(isQueen){
            addQueenPaths();
        } else {
            addPaths(currentPosition.row + direction, currentPosition.col - 1);
            addPaths(currentPosition.row + direction, currentPosition.col + 1);

            addCapturePaths(currentPosition.row + 2 * direction, currentPosition.col - 2);
            addCapturePaths(currentPosition.row + 2 * direction, currentPosition.col + 2);
        };
    }

    function addQueenPaths(){
        const directions = [
            {row: 1, col: 1},
            {row: 1, col: -1},
            {row: -1, col: 1},
            {row: - 1, col: - 1}
        ]

        directions.forEach(direction =>{
            for(let i=1;i<8;i++){
                const newRow = currentPosition.row + direction.row * i;
                const newCol = currentPosition.col + direction.col * i;
                if(newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8){
                    const cell = board[newRow][newCol];
                    if(cell.querySelector('.piece') === null){
                        paths.push({newRow,newCol});
                    } else {
                        addCapturePaths(newRow + direction.row, newCol + direction.col);
                        break;
                    }
                } else {
                    break;
                }
            }
        })
    }

    function addCapturePaths(row, col){
        if(row >= 0 && row < 8 && col >= 0 && col < 8){
            const rowDiff = Math.abs(currentPosition.row - row);
            const colDiff = Math.abs(currentPosition.col - col);
            if(rowDiff === 2 && colDiff === 2){
                capturePaths.push({row, col});
            }
        }
    }

    function addPaths(row, col){
        if(row >= 0 && row < 8 && col >= 0 && col < 8){
            paths.push({row,col});
        }
    }

    function isValidMove(targetRow, targetCol) {
        if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) {
            return false;
        }

        const isPath = paths.some(path => path.row === targetRow && path.col === targetCol);
        const isCapturePath = capturePaths.some(path => path.row === targetRow && path.col === targetCol);

        if (isPath) {
            return true;
        } else if (isCapturePath) {
            const capturePath = capturePaths.find(path => path.row === targetRow && path.col === targetCol);
            const intermediateRow = (currentPosition.row + capturePath.row) / 2;
            const intermediateCol = (currentPosition.col + capturePath.col) / 2;
            const captureCell = board[intermediateRow][intermediateCol];
            const capturePiece = captureCell.querySelector('.piece');

            if (capturePiece && capturePiece.classList.contains(`piece-${currentPosition.color === 'black' ? 'white' : 'black'}`)) {
                capturePiece.remove();
                return true;
            }
        }
        return false;
    }

    function promoteToQueen(piece){
        piece.classList.add('queen');

        piece.innerHTML = piece.classList.contains('piece-black') ? '&#9813;' : '&#9812;'
    }

    checkerBoard.addEventListener('click', function(event){
        const targetCell = event.target.closest('.cell-black, .cell-white');

        if(currentPosition && targetCell){
            const clickedRow = parseInt(targetCell.dataset.row);
            const clickedCol = parseInt(targetCell.dataset.col);

            if(isValidMove(clickedRow, clickedCol) && targetCell.querySelector('.piece') === null){
                const currentCell = board[currentPosition.row][currentPosition.col];
                const currentPiece = currentCell.querySelector('.piece');
                const isQueen = currentPiece.classList.contains('queen');
                currentPiece.remove();

                const newPiece = document.createElement('div');
                newPiece.className = `piece piece-${currentPosition.color}`;
                newPiece.innerHTML = currentPosition.color === 'black' ? '&#9899;' : '&#9898;';
                if(isQueen){
                    promoteToQueen(newPiece);
                }
                attachAddEventListener(newPiece, currentPosition.color);
                targetCell.appendChild(newPiece);

                currentPosition = { row: clickedRow, col: clickedCol, color: currentPosition.color };

                if(!isQueen && ((currentPosition.color === 'black' && clickedRow === 7) || (currentPosition.color === 'white' && clickedRow === 0))){
                    promoteToQueen(newPiece);
                }

                turn = (turn === 'white')?'black':'white';
                currentPosition = null;
                paths = [];
                capturePaths = [];  
            }
        }
    });

    document.querySelectorAll('.piece').forEach(piece =>{
        const color = piece.classList.contains('piece-black') ? 'black':'white';

        attachAddEventListener(piece, color);
    })
});