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
  'sound/correct.wav',
];

/////////////////////////////
// symboler
/////////////////////////////

const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart');
const symbols = [
    "img/troll.png",
    "img/snigel.png",
    "img/grotta.png",
    "img/kyrka.png",
    "img/frida.png",
    "img/monster.png",
    "img/tornet.png",
    "img/pacman.png",
    "img/vattentorn.png",
    "img/berg.png",
    "img/vänervätte.png",
    "img/bojort.png",
];

const text = [
    'Trollis',
    'Snigel',
    'Kalkgrotta',
    'Vänersborgs kyrka',
    'Frida statyn',
    'Vänernodjuret',
    'Tornet',
    'Pacman',
    'Vattentornet',
    'Halle- och Hunneberg',
    'Vänervätte',
    'Bojort',
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
    // Skapa en array med både symbol och text
    const symbolTextPairs = symbols.map((symbol, i) => ({ symbol, text: text[i] }));
    // Dubbel uppsättning för memory
    const allPairs = shuffle([...symbolTextPairs, ...symbolTextPairs]);
    cards = allPairs.map((pair, idx) => {
        const card = document.createElement('div');
        const cardcontainer = document.createElement('div');
        cardcontainer.className = 'cardcontainer';
        card.className = 'card';
        card.dataset.symbol = pair.symbol;
        card.dataset.text = pair.text;
        card.dataset.index = idx;
        card.textContent = '';
        card.addEventListener('click', flipCard);
        cardcontainer.appendChild(card);
        board.appendChild(cardcontainer);
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
    flipSound.volume = 0.5;
    flipSound.play();

    card.innerHTML = '';
    const img = document.createElement('img');
    img.src = card.dataset.symbol;
    img.alt = 'Symbol';
    card.appendChild(img);
    // Lägg till text under bilden
    const textElem = document.createElement('div');
    textElem.className = 'card-text';
    textElem.textContent = card.dataset.text;
    card.appendChild(textElem);

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
        correctSound.volume = 0.1;
        correctSound.play();

        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount += 2;

        if (matchedCount === symbols.length * 2) {
            stopTimer();
            showWinningScreen();
        }
    } else {
        [card1, card2].forEach(card => {

            const flipBackSound = new Audio(cardFlip2);
            flipBackSound.volume = 0.3;
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

/////////////////////////////
//  Winning Screen
/////////////////////////////

function showWinningScreen() {

  const messageBox = document.getElementById('message');
  if (messageBox) messageBox.style.display = "none";

  const overlay = document.createElement('div');
  overlay.classList.add('winning-overlay');

  const timeText = timerDisplay ? timerDisplay.textContent : '';
  overlay.innerHTML = `
    <div class="winning-screen winning-background">
      <div class="winning-content">
        <h1>Du hittade alla kort, bra jobbat!</h1>
        ${timeText ? `Du klarade spelet på ${timeText.replace('Tid: ', '')}` : ''}
        <div class="winning-buttons">
          <button id="restartBtn">Spela igen</button>
          <button id="menuBtn">Återgå till meny</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('restartBtn').addEventListener('click', () => {
    replay = true;
    overlay.remove();
    createBoard();
    resetTimer();
  });

  document.getElementById('menuBtn').addEventListener('click', () => {
    window.location.href = "gamemeny.html";
  });
  }

