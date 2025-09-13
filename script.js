const questions = [
  { q: "Do you like Dawn or Dusk?", options: ["Dawn", "Dusk"], scores: [{Gry:1,Rav:1}, {Huf:1,Sly:1}] },
  { q: "When I'm dead, I want people to remember me as...", options: ["The Good", "The Great", "The Wise", "The Bold"], scores: [{Huf:2}, {Sly:2}, {Rav:2}, {Gry:2}] },
  { q: "Which kind of instrument most pleases your ear?", options: ["Violin", "Trumpet", "Piano", "Drum"], scores: [{Sly:4}, {Huf:4}, {Rav:4}, {Gry:4}] },
  { q: "Which path do you intend to follow after leaving Hogwarts?", options: ["Join the Ministry", "Travel the world", "Start a business", "Help others"], scores: [{Rav:2}, {Gry:2}, {Sly:2}, {Huf:2}] },
  { q: "Which pet would you choose?", options: ["Owl", "Cat", "Toad", "Phoenix"], scores: [{Rav:1}, {Sly:1}, {Huf:1}, {Gry:1}] },
  { q: "What would you most like to be known as?", options: ["The Wise", "The Bold", "The Good", "The Powerful"], scores: [{Rav:2}, {Gry:2}, {Huf:2}, {Sly:2}] },
  { q: "Which of the following do you fear the most?", options: ["Heights", "Loneliness", "Ignorance", "Weakness"], scores: [{Gry:1}, {Huf:1}, {Rav:1}, {Sly:1}] },
  { q: "What's your ideal Hogwarts meal?", options: ["Cozy hearty dish", "Rare delicacy", "Traditional roast", "Clever fusion"], scores: [{Huf:1}, {Sly:1}, {Gry:1}, {Rav:1}] },
  { q: "What subject would you most look forward to?", options: ["Defense Against the Dark Arts", "Charms", "Potions", "Herbology"], scores: [{Gry:2}, {Rav:2}, {Sly:2}, {Huf:2}] },
  { q: "What do you see in the Mirror of Erised?", options: ["Fame & success", "Knowledge & discovery", "Love & unity", "Heroism & glory"], scores: [{Sly:2}, {Rav:2}, {Huf:2}, {Gry:2}] }
];

let Gry=0, Rav=0, Huf=0, Sly=0;
let currentQuestionIndex = 0;

const quizDiv = document.getElementById("quiz");
const resultDiv = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const sortingHat = document.getElementById("sortingHat");
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
const volumeDownBtn = document.getElementById("volumeDown");
const volumeUpBtn = document.getElementById("volumeUp");

// Music controls
let isMuted = false;
bgMusic.volume = 0.3; // Set initial volume

muteBtn.addEventListener("click", () => {
  if (isMuted) {
    bgMusic.muted = false;
    muteBtn.textContent = "🔊";
    isMuted = false;
  } else {
    bgMusic.muted = true;
    muteBtn.textContent = "🔇";
    isMuted = true;
  }
});

volumeDownBtn.addEventListener("click", () => {
  if (bgMusic.volume > 0.1) {
    bgMusic.volume -= 0.1;
  }
});

volumeUpBtn.addEventListener("click", () => {
  if (bgMusic.volume < 0.9) {
    bgMusic.volume += 0.1;
  }
});

startBtn.addEventListener("click", async () => {
  startBtn.classList.add('loading');
  startBtn.textContent = "Loading...";
  
  // Start background music
  try {
    await bgMusic.play();
  } catch (error) {
    console.log("Auto-play prevented. Music will start on user interaction.");
  }

  // Animate the hat
  sortingHat.classList.add('talking');
  
  setTimeout(() => {
    startBtn.style.display = "none";
    sortingHat.classList.remove('talking');
    showQuestion(0);
  }, 1500);
});

function showQuestion(i) {
  if (i >= questions.length) { 
    showResult(); 
    return; 
  }

  currentQuestionIndex = i;
  let q = questions[i];
  
  // Make hat talk during questions
  sortingHat.classList.add('talking');
  
  quizDiv.innerHTML = `
    <div class="question-number">Question ${i + 1} of ${questions.length}</div>
    <h2>${q.q}</h2>
  `;
  
  q.options.forEach((opt, idx) => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      // Visual feedback
      btn.style.background = "lightgreen";
      btn.style.transform = "scale(0.95)";
      
      setTimeout(() => {
        let scores = q.scores[idx];
        Gry += scores.Gry || 0;
        Rav += scores.Rav || 0;
        Huf += scores.Huf || 0;
        Sly += scores.Sly || 0;
        
        sortingHat.classList.remove('talking');
        showQuestion(i+1);
      }, 300);
    };
    quizDiv.appendChild(btn);
  });
}

function showResult() {
  quizDiv.innerHTML = "";
  
  // Make hat very active during sorting
  sortingHat.classList.add('talking');
  
  let maxScore = Math.max(Gry, Rav, Huf, Sly);
  let house = "";
  if (Gry === maxScore) house = "gryffindor";
  else if (Rav === maxScore) house = "ravenclaw";
  else if (Huf === maxScore) house = "hufflepuff";
  else if (Sly === maxScore) house = "slytherin";

  // Dramatic pause before revealing
  setTimeout(() => {
    sortingHat.classList.remove('talking');
    
    resultDiv.innerHTML = `
      <h2>The Sorting Hat has chosen... ${house.charAt(0).toUpperCase() + house.slice(1)}!</h2>
      <img src="assets/${house}.png" alt="${house} crest">
      <br>
      <button onclick="restartQuiz()">Take Quiz Again</button>
    `;

    // Play house-specific sound
    let audio = new Audio(`assets/${house}.mp3`);
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    // Stop hat talking after result
    setTimeout(() => {
      sortingHat.classList.remove('talking');
    }, 3000);
    
  }, 2000); // 2 second dramatic pause
}

function restartQuiz() {
  // Reset scores
  Gry = Rav = Huf = Sly = 0;
  currentQuestionIndex = 0;
  
  // Reset UI
  resultDiv.innerHTML = "";
  quizDiv.innerHTML = "";
  startBtn.style.display = "inline-block";
  startBtn.textContent = "Start Quiz";
  startBtn.classList.remove('loading');
  
  // Reset hat animation
  sortingHat.classList.remove('talking');
}

// Handle audio context for better browser compatibility
document.addEventListener('click', () => {
  if (bgMusic.paused && startBtn.style.display === "none") {
    bgMusic.play().catch(e => console.log("Background music failed to start"));
  }
}, { once: true });