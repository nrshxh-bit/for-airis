
const music = document.getElementById("bg-music");
const musicButton = document.getElementById("music-btn");
const musicStatus = document.getElementById("music-status");

music.volume = 0.45;

// Cuba autoplay bila website dibuka
window.addEventListener("load", () => {
  music.play().catch(() => {
    musicStatus.textContent = "Tap Play to listen";
  });
});

// Update music player
function updateMusicButton() {
  if (music.paused) {
    musicButton.textContent = "▶ Play";
    musicStatus.textContent = "Tap Play to listen";
  } else {
    musicButton.textContent = "Ⅱ Pause";
    musicStatus.textContent = "Now playing ♫";
  }
}

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);

// Play / Pause
function toggleMusic() {
  if (music.paused) {
    music.play().catch(() => {
      musicStatus.textContent = "Unable to play audio";
    });
  } else {
    music.pause();
  }
}

// Tukar page
function nextPage(pageNumber) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById("page" + pageNumber)
    .classList.add("active");

  // Bila tekan envelope, cuba mainkan lagu
  if (pageNumber === 2 && music.paused) {
    music.play().catch(() => {
      musicStatus.textContent = "Tap Play to listen";
    });
  }
}

// Jawapan dekat page terakhir
function showAnswer(choice) {
  const answer = document.getElementById("answer");

  if (choice === "talk") {
    answer.textContent =
      "Thank you for being willing to talk. 🤎";
  } else {
    answer.textContent =
      "That's okay. Take all the time you need. 🌼";
  }
}
