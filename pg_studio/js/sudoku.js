document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("sudoku-grid");

    // Função para gerar um Sudoku aleatório
    function generateRandomSudoku() {
        const puzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        return puzzle;
    }

    // Função para resolver o Sudoku
    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Função para verificar se um número é válido em uma posição
    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    // Função para exibir o tabuleiro
    function displayPuzzle(puzzle) {
        grid.innerHTML = "";
        for (let row = 0; row < 9; row++) {
            const rowDiv = document.createElement("div");
            rowDiv.className = "row";
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                if ((row + col) % 2 === 0) {
                    cell.className += " lightBackground";
                } else {
                    cell.className += " darkBackground";
                }
                if (puzzle[row][col] !== 0) {
                    cell.textContent = puzzle[row][col];
                    cell.classList.add("fixed");
                } else {
                    cell.contentEditable = true;
                    cell.classList.add("editable");
                }
                rowDiv.appendChild(cell);
            }
            grid.appendChild(rowDiv);
        }
    }

    // Função para resolver o Sudoku (chamada pelo botão)
    window.solveSudoku = function () {
        const puzzle = getCurrentPuzzle();
        if (solveSudoku(puzzle)) {
            displayPuzzle(puzzle);
        } else {
            alert("Não foi possível resolver o Sudoku!");
        }
    };

    // Função para reiniciar o tabuleiro (chamada pelo botão)
    window.resetPuzzle = function () {
        const puzzle = generateRandomSudoku();
        displayPuzzle(puzzle);
    };

    // Função para obter o tabuleiro atual
    function getCurrentPuzzle() {
        const puzzle = [];
        const rows = grid.querySelectorAll(".row");
        rows.forEach((row, rowIndex) => {
            puzzle[rowIndex] = [];
            const cells = row.querySelectorAll(".cell");
            cells.forEach((cell, colIndex) => {
                puzzle[rowIndex][colIndex] = cell.textContent ? parseInt(cell.textContent) : 0;
            });
        });
        return puzzle;
    }

    // Exibir o tabuleiro inicial
    const initialPuzzle = generateRandomSudoku();
    displayPuzzle(initialPuzzle);
});
 // Efeito de carregamento suave
 document.addEventListener("DOMContentLoaded", function() {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "1";
    }, 100);
}); 