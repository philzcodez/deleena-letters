const scrollHint = document.getElementById("scrollHint");
const wrapper = document.getElementById("wrapper");

const flipBtn = document.getElementById("flip");
const openBtn = document.getElementById("open");
const seal = document.getElementById("seal");

const letter = document.getElementById("letter");
const text = document.getElementById("text");
const dateLabel = document.getElementById("letterDate");
const prevBtn = document.getElementById("prevDay");
const nextBtn = document.getElementById("nextDay");

flipBtn.addEventListener("click", () => {
  wrapper.classList.add("flip");
});

// --- letters comes from letters.js, loaded before this file ---

const sortedLetters = [...letters].sort((a, b) => a.date.localeCompare(b.date));

function todayKey() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function getDefaultIndex() {
  const today = todayKey();

  const exact = sortedLetters.findIndex((l) => l.date === today);
  if (exact !== -1) return exact;

  // No letter for today yet — fall back to the most recent past one.
  for (let i = sortedLetters.length - 1; i >= 0; i--) {
    if (sortedLetters[i].date < today) return i;
  }

  // Everything is in the future — just start at the earliest.
  return 0;
}

function formatPretty(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

let currentIndex = getDefaultIndex();
let typeToken = 0;

function typeMessage(message) {
  const token = ++typeToken;
  text.textContent = "";
  let i = 0;

  function step() {
    if (token !== typeToken) return; // a newer letter started, stop this one
    if (i < message.length) {
      text.textContent += message[i];
      i++;
      setTimeout(step, 30);
    }
  }

  step();
}

function renderCurrentLetter() {
  const entry = sortedLetters[currentIndex];
  dateLabel.textContent = formatPretty(entry.date);
  typeMessage(entry.message.trim());

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === sortedLetters.length - 1;
}

function openLetter() {

  if (letter.classList.contains("showLetter")) return;


  letter.classList.add("showLetter");


  renderCurrentLetter();



  if(window.innerWidth <= 600){

      setTimeout(()=>{

          scrollHint.classList.add("showHint");

      },1200);

  }

}

openBtn.addEventListener("click", openLetter);
seal.addEventListener("click", openLetter);

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrentLetter();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < sortedLetters.length - 1) {
    currentIndex++;
    renderCurrentLetter();
  }
});

// window.addEventListener("scroll", ()=>{


//     scrollHint.classList.remove("showHint");


// });
