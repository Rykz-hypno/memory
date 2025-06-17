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

function flipCard(e) {
    if (lock) return;
    const card = e.currentTarget;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');

    const img = document.createElement('img');
    img.src = card.dataset.symbol;
    img.alt = 'Symbol';
    card.innerHTML = ''; 
    card.appendChild(img);

    flipped.push(card);

    if (flipped.length === 2) {
        lock = true;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flipped;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
    } else {
        [card1, card2].forEach(card => {
            card.classList.remove('flipped');
            card.innerHTML = ''; 
        });
    }

    flipped = [];
    lock = false;
}

restartBtn.addEventListener('click', createBoard);
createBoard();