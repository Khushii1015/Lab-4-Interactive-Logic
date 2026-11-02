const form = document.getElementById("checkin-form");
const nameInput = document.getElementById("name");
const sleepInput = document.getElementById("sleep");
const moodInput = document.getElementById("mood");
const greeting = document.getElementById("greeting");
const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const historyText = document.getElementById("history");
const resetBtn = document.getElementById("reset-btn");

const modes = {
  rest: {
    title: "Rest Mode",
    text: "your battery is low today. Do one small task, then take a real break."
  },
  light: {
    title: "Light Study Mode",
    text: "keep it easy today. Review your notes or tidy up your assignments."
  },
  focus: {
    title: "Focus Mode",
    text: "this is a good day for a solid study block. Start with your hardest task."
  },
  power: {
    title: "Power Mode",
    text: "you're fully charged. Take on a big assignment and get ahead."
  }
};

let userName = localStorage.getItem("userName") || "";
let visits = Number(localStorage.getItem("visits")) || 0;
let lastMode = localStorage.getItem("lastMode");

function showGreeting() { // Changes the greeting based on how many times the user has checked in
  if (visits === 0) {
    greeting.textContent = "Welcome! Answer three quick questions to get your plan for today.";
  } else if (visits < 3) {
    greeting.textContent = "Welcome back, " + userName + "!";
  } else {
    greeting.textContent = "Good to see you again, " + userName + ". That's " + visits + " check-ins so far.";
  }
}

function getMode(sleep, mood) { // Decides which mode fits the user's sleep and mood
  if (sleep < 5 || mood === "tired") {
    return "rest";
  } else if (sleep >= 8 && mood === "great") {
    return "power";
  } else if (sleep >= 7 || mood === "great") {
    return "focus";
  } else {
    return "light";
  }
}

function getHistoryMessage(mode) { // Compares today's mode with the last one to describe the change
  if (lastMode === null) {
    return "This is your first check-in.";
  } else if (lastMode === mode) {
    return "Same mode as last time. You're staying consistent.";
  } else if (lastMode === "rest") {
    return "Nice bounce back from your last Rest Mode.";
  } else {
    return "Last time you were in " + modes[lastMode].title + ".";
  }
}

function showResult(mode) { // Shows the chosen mode's message and changes the page colour
  document.body.className = mode;
  resultTitle.textContent = modes[mode].title;
  resultText.textContent = userName + ", " + modes[mode].text;
  historyText.textContent = getHistoryMessage(mode);
  result.hidden = false;
}

function checkIn(event) { // Reads the answers, picks a mode and saves the user's progress
  event.preventDefault();

  userName = nameInput.value.trim();
  const mode = getMode(Number(sleepInput.value), moodInput.value);

  visits = visits + 1;
  showResult(mode);
  lastMode = mode;

  localStorage.setItem("userName", userName);
  localStorage.setItem("visits", visits);
  localStorage.setItem("lastMode", lastMode);

  showGreeting();
}

function resetData() { // Clears everything saved so the page starts fresh
  localStorage.removeItem("userName");
  localStorage.removeItem("visits");
  localStorage.removeItem("lastMode");

  userName = "";
  visits = 0;
  lastMode = null;

  form.reset();
  result.hidden = true;
  document.body.className = "";
  showGreeting();
}

form.addEventListener("submit", checkIn);
resetBtn.addEventListener("click", resetData);

nameInput.value = userName;
showGreeting();
