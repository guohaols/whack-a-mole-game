const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score span');
let lastHole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min) * 3;
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(200, 1000);
  const hole = randomHole(holes);
  const mole = hole.querySelector('.mole');
  mole.classList.add('up');
  setTimeout(() => {
    mole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  setTimeout(() => timeUp = true, 30000); // 30秒游戏时间
}

// 确保音效在用户交互后可用
let soundsEnabled = false;
document.addEventListener('click', () => {
  if (!soundsEnabled) {
    soundsEnabled = true;
    const hitSound = document.getElementById('hitSound');
    const missSound = document.getElementById('missSound');
    
    if (hitSound) {
      hitSound.play().then(() => {
        hitSound.pause();
        hitSound.currentTime = 0;
      }).catch(error => {
        console.error('Error enabling hit sound:', error);
      });
    }
    
    if (missSound) {
      missSound.play().then(() => {
        missSound.pause();
        missSound.currentTime = 0;
      }).catch(error => {
        console.error('Error enabling miss sound:', error);
      });
    }
  }
});

function playSound(id) {
  if (!soundsEnabled) return;
  
  const sound = document.getElementById(id);
  if (sound) {
    try {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  } else {
    console.error('Sound element not found:', id);
  }
}

// 预加载音效
window.addEventListener('load', () => {
  const hitSound = document.getElementById('hitSound');
  const missSound = document.getElementById('missSound');
  
  if (hitSound) {
    hitSound.load();
    hitSound.preload = 'auto';
  }
  if (missSound) {
    missSound.load();
    missSound.preload = 'auto';
  }
});

function bonk(e) {
  if(!e.isTrusted) return; // 防止作弊
  
  if(e.target.classList.contains('mole') && e.target.classList.contains('up')) {
    score++;
    e.target.classList.remove('up');
    scoreBoard.textContent = score;
    playSound('hitSound');
  } else {
    playSound('missSound');
  }
}

const moles = document.querySelectorAll('.mole');
moles.forEach(mole => mole.addEventListener('click', bonk));

const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', startGame);
