document.addEventListener('DOMContentLoaded', function(){
    const checkerboard = document.getElementById('checkersboard');
    let currentPosition = null;
    let path1 = null;
    let path2 = null;

    const board = [];
    for(let i=0;i<8;i++){
        board[i] = [];
        for(let j=0;j<8;j++){
            const isBlack = (i+j)%2 === 1;

            const cell = document.createElement('div');
            cell.className = isBlack ? 'cell-black':'cell-white';
            cell.dataset.row = i;
            cell.dataset.col = j;

            if(isBlack && (i === 0 || i === 1)){
                const piece = document.createElement('div');
                piece.className = 'piece-black';
                piece.innerHTML = '&#9898;';

                piece.addEventListener('click', function(){
                    currentPosition = {row: i, col: j, color: 'black'};

                    updatePaths();
                })

                cell.appendChild(piece);
            } else if(!isBlack && (i === 6 || i === 7)) {
                const piece = document.createElement('div');
                piece.className = 'piece-white';
                piece.innerHTML = '&#9899;';

                piece.addEventListener('click', function(){
                    currentPosition = {row: i, col: j, color: 'white'};

                    updatePaths();
                })

                cell.appendChild(piece);
            }
            checkerboard.appendChild(cell);

            board[i][j] = cell;
        }
    }

    function updatePaths(){
        if(currentPosition.color === 'black'){
            const path1Row = currentPosition.row + 1;
            const path1Col = currentPosition.col - 1;
            const path2Row = currentPosition.row + 1;
            const path2Col = currentPosition.col + 1;
    
            path1 = {row: path1Row, col: path1Col};
            path2 = {row: path2Row, col: path2Col};
        } else if(currentPosition.color === 'white'){
            const path1Row = currentPosition.row - 1;
            const path1Col = currentPosition.col - 1;
            const path2Row = currentPosition.row - 1;
            const path2Col = currentPosition.col + 1;

            path1 = {row: path1Row, col: path1Col};
            path2 = {row: path2Row, col: path2Col};
        }
    }

    checkerboard.addEventListener('click', function(event){
        const targetCell = event.target.closest('.cell-black, .cell-white');

        if(currentPosition && targetCell){
            const clickedRow = parseInt(targetCell.dataset.row);
            const clickedCol = parseInt(targetCell.dataset.col);

            if((clickedRow === path1.row && clickedCol === path1.col) || 
            (clickedRow === path2.row && clickedCol === path2.col)){
                
                const currentCell = board[currentPosition.row][currentPosition.col];
                const currentPiece = currentCell.querySelector(`.piece-${currentPosition.color}`);
                currentPiece.remove();

                const newPiece = document.createElement('div');
                newPiece.className = `piece-${currentPosition.color}`;
                newPiece.innerHTML = '&#9899;';
                targetCell.appendChild(newPiece);

                currentPosition = {row: clickedRow, col: clickedCol, color: currentPosition.color};
                updatePaths();
            }
        }
    })
})