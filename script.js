document.addEventListener('DOMContentLoaded', function(){
    const gameboard = document.getElementById('checkersboard');
    const blackCounter = document.getElementById('black-counter').querySelector('span');
    const whiteCounter = document.getElementById('white-counter').querySelector('span');
    let currentPosition = null;
    
})
document.addEventListener('DOMContentLoaded', function() {
    const gameboard = document.getElementById('checkersboard');
    const blackCounter = document.getElementById('black-counter').querySelector('span');
    const whiteCounter = document.getElementById('white-counter').querySelector('span');
    let currentPosition = null;
    let paths = [];
    let capturePaths = [];
    let turn = 'white'; // 'white' is human player, 'black' is computer player
    let blackCaptures = 0;
    let whiteCaptures = 0;
    let mandatoryCapture = false;

    const board = [];
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            const isBlack = (i + j) % 2 === 1;

            const cell = document.createElement('div');
            cell.className = isBlack ? 'cell cell-black' : 'cell cell-white';
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (isBlack && (i === 0 || i === 1 || i === 2)) {
                const piece = document.createElement('div');
                piece.className = 'piece piece-black';
                piece.innerHTML = '&#9899;';
                attachAddEventListener(piece, 'black');
                cell.appendChild(piece);
            } else if (isBlack && (i === 5 || i === 6 || i === 7)) {
                const piece = document.createElement('div');
                piece.className = 'piece piece-white';
                piece.innerHTML = '&#9898;';
                attachAddEventListener(piece, 'white');
                cell.appendChild(piece);
            }
            gameboard.appendChild(cell);
            board[i][j] = cell;
        }
    }

    function attachAddEventListener(piece, color) {
        piece.addEventListener('click', function () {
            if (turn === color) {
                clearHighlights();
                currentPosition = {
                    row: parseInt(piece.parentElement.dataset.row),
                    col: parseInt(piece.parentElement.dataset.col),
                    color: color
                };
                updatePaths();
                highlightPaths();
            }
        });
    }

    function clearHighlights() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('cell-highlight');
        });
        document.querySelectorAll('.piece').forEach(piece => {
            piece.classList.remove('piece-clickable');
        });
    }

    function updatePaths() {
        paths = [];
        capturePaths = [];
        const direction = currentPosition.color === 'black' ? 1 : -1;
        const isQueen = board[currentPosition.row][currentPosition.col].querySelector('.queen') !== null;

        if (isQueen) {
            addQueenPaths();
        } else {
            addPaths(currentPosition.row + direction, currentPosition.col - 1);
            addPaths(currentPosition.row + direction, currentPosition.col + 1);

            addCapturePaths(currentPosition.row + 2 * direction, currentPosition.col - 2);
            addCapturePaths(currentPosition.row + 2 * direction, currentPosition.col + 2);
        }
    }

    function addQueenPaths() {
        const directions = [
            { row: 1, col: 1 },
            { row: 1, col: -1 },
            { row: -1, col: 1 },
            { row: -1, col: -1 }
        ];

        directions.forEach(direction => {
            let newRow = currentPosition.row + direction.row;
            let newCol = currentPosition.col + direction.col;
            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (board[newRow][newCol].querySelector('.piece')) break;
                addPaths(newRow, newCol);
                addCapturePaths(newRow + direction.row, newCol + direction.col);
                newRow += direction.row;
                newCol += direction.col;
            }
        });
    }

    function addCapturePaths(row, col) {
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            const middleRow = (currentPosition.row + row) / 2;
            const middleCol = (currentPosition.col + col) / 2;
            if (middleRow >= 0 && middleRow < 8 && middleCol >= 0 && middleCol < 8) {
                const middlePiece = board[middleRow][middleCol].querySelector('.piece');
                if (middlePiece && middlePiece.classList.contains(currentPosition.color === 'black' ? 'piece-white' : 'piece-black') && !board[row][col].querySelector('.piece')) {
                    capturePaths.push({ row, col });
                }
            }
        }
    }

    function addPaths(row, col) {
        if (row >= 0 && row < 8 && col >= 0 && col < 8 && !board[row][col].querySelector('.piece')) {
            paths.push({ row, col });
        }
    }

    function isValid(clickedRow, clickedCol) {
        if (clickedRow < 0 || clickedRow >= 8 || clickedCol < 0 || clickedCol >= 8) {
            return false;
        }

        const isPath = paths.some(path => clickedRow === path.row && clickedCol === path.col);
        const isCapturePath = capturePaths.some(path => clickedRow === path.row && clickedCol === path.col);

        if (isPath) {
            return !mandatoryCapture;
        } else if (isCapturePath) {
            return true;
        }
        return false;
    }

    function handleCapture(clickedRow, clickedCol) {
        const intermediateRow = (currentPosition.row + clickedRow) / 2;
        const intermediateCol = (currentPosition.col + clickedCol) / 2;
        const captureCell = board[intermediateRow][intermediateCol];
        const capturePiece = captureCell.querySelector('.piece');

        if (capturePiece && capturePiece.classList.contains(currentPosition.color === 'black' ? 'piece-white' : 'piece-black')) {
            capturePiece.remove();
            updateCounter(currentPosition.color === 'black' ? 'white' : 'black', 1);
        }
    }

    function promoteToQueen(piece) {
        piece.classList.add('queen');
        piece.innerHTML = piece.classList.contains('piece-black') ? '&#9813;' : '&#9812;';
    }

    function checkMandatoryCapture() {
        mandatoryCapture = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = board[i][j];
                const piece = cell.querySelector('.piece');
                if (piece && piece.classList.contains(turn === 'black' ? 'piece-black' : 'piece-white')) {
                    currentPosition = { row: i, col: j, color: turn };
                    updatePaths();
                    if (capturePaths.length > 0) {
                        mandatoryCapture = true;
                        return;
                    }
                }
            }
        }
        currentPosition = null;
    }

    function highlightPaths() {
        paths.concat(capturePaths).forEach(path => {
            board[path.row][path.col].classList.add('cell-highlight');
            const piece = board[path.row][path.col].querySelector('.piece');
            if (piece) {
                piece.classList.add('piece-clickable');
            }
        });
    }

    function updateCounter(color, delta) {
        if (color === 'black') {
            blackCaptures += delta;
            blackCounter.textContent = blackCaptures;
        } else {
            whiteCaptures += delta;
            whiteCounter.textContent = whiteCaptures;
        }
        checkWinCondition();
    }

    function checkWinCondition() {
        const whitePiecesLeft = document.querySelectorAll('.piece-white').length;
        const blackPiecesLeft = document.querySelectorAll('.piece-black').length;
        if (whitePiecesLeft === 0) {
            alert('Black wins!');
        } else if (blackPiecesLeft === 0) {
            alert('White wins!');
        }
    }

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const clickedRow = parseInt(cell.dataset.row);
            const clickedCol = parseInt(cell.dataset.col);

            if (currentPosition && isValid(clickedRow, clickedCol)) {
                movePiece(clickedRow, clickedCol);
                if (turn === 'white') {
                    turn = 'black';
                    setTimeout(computerMove, 1000); // Delay for computer move
                }
            }
        });
    });

    function movePiece(clickedRow, clickedCol) {
        const piece = board[currentPosition.row][currentPosition.col].querySelector('.piece');
        board[currentPosition.row][currentPosition.col].innerHTML = '';
        board[clickedRow][clickedCol].appendChild(piece);

        if (capturePaths.some(path => clickedRow === path.row && clickedCol === path.col)) {
            handleCapture(clickedRow, clickedCol);
        }

        if ((clickedRow === 0 && piece.classList.contains('piece-white')) || (clickedRow === 7 && piece.classList.contains('piece-black'))) {
            promoteToQueen(piece);
        }

        clearHighlights();
        currentPosition = null;

        checkMandatoryCapture();
    }

    function computerMove() {
        let moveMade = false;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = board[i][j];
                const piece = cell.querySelector('.piece');
                if (piece && piece.classList.contains('piece-black')) {
                    currentPosition = { row: i, col: j, color: 'black' };
                    updatePaths();
                    if (capturePaths.length > 0) {
                        const randomCapturePath = capturePaths[Math.floor(Math.random() * capturePaths.length)];
                        movePiece(randomCapturePath.row, randomCapturePath.col);
                        moveMade = true;
                        break;
                    }
                }
            }
            if (moveMade) break;
        }

        if (!moveMade) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const cell = board[i][j];
                    const piece = cell.querySelector('.piece');
                    if (piece && piece.classList.contains('piece-black')) {
                        currentPosition = { row: i, col: j, color: 'black' };
                        updatePaths();
                        if (paths.length > 0) {
                            const randomPath = paths[Math.floor(Math.random() * paths.length)];
                            movePiece(randomPath.row, randomPath.col);
                            moveMade = true;
                            break;
                        }
                    }
                }
                if (moveMade) break;
            }
        }

        if (!moveMade) {
            alert('Black cannot move, White wins!');
        }

        turn = 'white';
        checkMandatoryCapture();
    }

    checkMandatoryCapture();
});
   
