const wordLists = {
    easy: ["CAT", "DOG", "FISH", "BIRD", "COW"],
    medium: ["JAVASCRIPT", "HTML", "CSS", "NODE", "REACT"],
    hard: ["ANGULAR", "PYTHON", "JAVA", "RUBY", "SWIFT"]
};

let words = [];
let gridSize = 10;
let grid = [];
let foundWords = [];
let score = 0;
let timer;
let timeLeft = 60; // 60 seconds timer

document.getElementById('difficultySelect').addEventListener('change', (event) => {
    const difficulty = event.target.value;
    setDifficulty(difficulty);
});

function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            gridSize = 5;
            words = wordLists.easy;
            break;
        case 'medium':
            gridSize = 10;
            words = wordLists.medium;
            break;
        case 'hard':
            gridSize = 15;
            words = wordLists.hard;
            break;
    }
    resetGame();
}

function resetGame() {
    foundWords = [];
    score = 0;
    timeLeft = 60; // Reset timer
    document.getElementById('scoreValue').innerText = score;
    document.getElementById('result').innerText = '';
    document.getElementById('remainingWords').innerText = '';
    generateGrid();
}

function generateGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

    // Place words in the grid
    words.forEach(word => {
        placeWord(word);
    });

    // Fill empty spaces with random letters
    fillEmptySpaces();
    renderGrid();
    renderWordList();
    startTimer();
}

function placeWord(word) {
    const direction = Math.floor(Math.random() * 3); // 0 for horizontal, 1 for vertical, 2 for diagonal
    let placed = false;

    while (!placed) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (direction === 0) { // Horizontal
            if (col + word.length <= gridSize && canPlaceWord(row, col, word, direction)) {
                for (let i = 0; i < word.length; i++) {
                    grid[row][col + i] = word[i];
                }
                placed = true;
            }
        } else if (direction === 1) { // Vertical
            if (row + word.length <= gridSize && canPlaceWord(row, col, word, direction)) {
                for (let i = 0; i < word.length; i++) {
                    grid[row + i][col] = word[i];
                }
                placed = true;
            }
        } else { // Diagonal
            if (row + word.length <= gridSize && col + word.length <= gridSize && canPlaceWord(row, col, word, direction)) {
                for (let i = 0; i < word.length; i++) {
                    grid[row + i][col + i] = word[i];
                }
                placed = true;
            }
        }
    }
}

function canPlaceWord(row, col, word, direction) {
    for (let i = 0; i < word.length; i++) {
        const r = direction === 0 ? row : direction === 1 ? row + i : row + i;
        const c = direction === 0 ? col + i : direction === 1 ? col : col + i;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            return false;
        }
    }
    return true;
}

function fillEmptySpaces() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter A-Z
            }
        }
    }
}

function renderGrid() {
    const gridElement = document.getElementById('wordSearchGrid');
    gridElement.innerHTML = ''; // Clear the grid
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`; // Set grid columns based on size
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.innerText = cell;
            cellElement.addEventListener('click', () => selectCell(rowIndex, colIndex));
            gridElement.appendChild(cellElement);
        });
    });
}

function renderWordList() {
    const wordListElement = document.getElementById('wordList');
    wordListElement.innerHTML = '<h2>Words to Find:</h2>' + words.map(word => `<div>${word}</div>`).join('');
    updateRemainingWords();
}

function updateRemainingWords() {
    const remainingWordsElement = document.getElementById('remainingWords');
    const remainingWords = words.filter(word => !foundWords.includes(word));
    remainingWordsElement.innerHTML = '<h2>Remaining Words:</h2>' + remainingWords.map(word => `<div>${word}</div>`).join('');
}

function selectCell(row, col) {
    const cell = document.querySelectorAll('.cell')[row * gridSize + col];
    cell.classList.toggle('selected');
    checkForWord();
}

function checkForWord() {
    const selectedCells = document.querySelectorAll('.cell.selected');
    const selectedWord = Array.from(selectedCells).map(cell => cell.innerText).join('');

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        foundWords.push(selectedWord);
        score += 10; // Increment score for each found word
        document.getElementById('scoreValue').innerText = score;
        selectedCells.forEach(cell => {
            cell.classList.remove('selected');
            cell.classList.add('found'); // Highlight found word
        });
        document.getElementById('result').innerText = `You found: ${selectedWord}`;
        updateRemainingWords();
        if (foundWords.length === words.length) {
            document.getElementById('result').innerText = "Congratulations! You've found all the words!";
            clearInterval(timer); // Stop the timer
        }
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('result').innerText = "Time's up! Game over!";
            document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', selectCell)); // Disable cell clicks
        }
    }, 1000);
}

document.getElementById('resetButton').addEventListener('click', resetGame);

// Start the game with default difficulty
setDifficulty('easy');