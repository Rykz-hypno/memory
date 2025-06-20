/////////////////////////////
// ljud
/////////////////////////////

const cardFlip1 = [
  'sound/cardFlip1.mp3',
];
const cardFlip2 = [
  'sound/cardFlip2.mp3'
];

const correct= [
  'sound/correct.mp3',
];

/////////////////////////////
// väsen
/////////////////////////////

const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart');
const symbols = [
    "img/troll.png",
    "img/vänervätte.png",
    "img/snigel.png",
    "img/skräckugglan.png",
    "img/pacman.png",
    "img/kopparälvan.png",
    "img/hamnrå.png",
    "img/grotta.png"
];
let cards = [];
let flipped = [];
let lock = false;
let timerInterval = null;
let timerStart = null;
let timerRunning = false;
let matchedCount = 0;
let timerDisplay = document.getElementById('timer');

/////////////////////////////
// shuffle och kort
/////////////////////////////

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    board.innerHTML = '';
    flipped = [];
    lock = false;
    matchedCount = 0;
    resetTimer();
    cards = shuffle([...symbols, ...symbols]).map((symbol, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.dataset.index = idx;
        card.textContent = '';
        card.addEventListener('click', flipCard);
        board.appendChild(card);
        return card;
    });
}

/////////////////////////////
// flip
/////////////////////////////

function flipCard(e) {
    if (lock) return;
    const card = e.currentTarget;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    // Starta timer vid första klicket
    if (!timerRunning) startTimer();

    card.classList.add('flipped');

    const flipSound = new Audio(cardFlip1);
    flipSound.volume = 0.2;
    flipSound.play();

    const background = document.createElement('background');
    const img = document.createElement('img');
    img.src = card.dataset.symbol;
    img.alt = 'Symbol';
    card.innerHTML = ''; 
    card.appendChild(background);
    card.appendChild(img);

    flipped.push(card);

    if (flipped.length === 2) {
        lock = true;
        setTimeout(checkMatch, 500);
    }
}

/////////////////////////////
// match
/////////////////////////////

function checkMatch() {
    const [card1, card2] = flipped;

    if (card1.dataset.symbol === card2.dataset.symbol) {

        const correctSound = new Audio(correct);
        correctSound.volume = 0.07;
        correctSound.play();

        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount += 2;
        // Stoppa timer när alla kort är matchade
        if (matchedCount === symbols.length * 2) {
            stopTimer();
        }
    } else {
        [card1, card2].forEach(card => {

            const flipBackSound = new Audio(cardFlip2);
            flipBackSound.volume = 0.1;
            flipBackSound.play();

            card.classList.remove('flipped');
            card.innerHTML = ''; 
        });
    }

    flipped = [];
    lock = false;
}

restartBtn.addEventListener('click', createBoard);
createBoard();

/////////////////////////////
// timer
/////////////////////////////

function startTimer() {
    if (timerRunning) return;
    timerStart = Date.now();
    timerRunning = true;
    timerDisplay.textContent = 'Tid: 0.0 s';
    timerInterval = setInterval(() => {
        const elapsed = ((Date.now() - timerStart) / 1000).toFixed(1);
        timerDisplay.textContent = `Tid: ${elapsed} s`;
    }, 100);
}

function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timerDisplay.textContent = 'Tid: 0.0 s';
}