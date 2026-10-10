
/* =====================================
   BACKGROUND MUSIC
===================================== */

const music = document.getElementById("bg-music");
const musicButton = document.getElementById("music-btn");
const musicStatus = document.getElementById("music-status");

if (music) {
  music.volume = 0.45;

  window.addEventListener("load", () => {
    music.play().catch(() => {
      if (musicStatus) {
        musicStatus.textContent = "Tap Play to listen";
      }
    });
  });

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);
}

function updateMusicButton() {
  if (!music || !musicButton || !musicStatus) return;

  if (music.paused) {
    musicButton.textContent = "▶ Play";
    musicStatus.textContent = "Tap Play to listen";
  } else {
    musicButton.textContent = "Ⅱ Pause";
    musicStatus.textContent = "Now playing ♫";
  }
}

function toggleMusic() {
  if (!music) return;

  if (music.paused) {
    music.play().catch(() => {
      if (musicStatus) {
        musicStatus.textContent = "Unable to play audio";
      }
    });
  } else {
    music.pause();
  }
}

/* =====================================
   PAGE NAVIGATION
===================================== */

function nextPage(pageNumber) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const next = document.getElementById("page" + pageNumber);

  if (next) {
    next.classList.add("active");
    window.scrollTo(0, 0);
  }

  closeSurprise();

  if (pageNumber === 2 && music && music.paused) {
    music.play().catch(() => {
      if (musicStatus) {
        musicStatus.textContent = "Tap Play to listen";
      }
    });
  }

  if (pageNumber === 4) {
    shyAttempts = 0;

    const button = document.getElementById("shy-btn");
    const hint = document.getElementById("shy-hint");

    if (button) {
      button.style.transform = "translateX(0)";
    }

    if (hint) {
      hint.textContent = "";
    }
  }
}

/* =====================================
   FINAL PAGE ANSWERS
===================================== */

function showAnswer(choice) {
  if (choice === "talk") {
    openSurprise();
    return;
  }

  const answer = document.getElementById("answer");

  if (answer) {
    answer.textContent =
      "That's okay. Take all the time you need. Thank you for reading my letter. 🤎🌸";
  }
}

/* =====================================
   SURPRISE POPUP
===================================== */

function openSurprise() {
  const popup = document.getElementById("surprise-popup");

  if (!popup) {
    console.warn("Surprise popup not found in index.html");
    return;
  }

  popup.classList.remove("show");
  popup.hidden = false;

  // Restart animation
  void popup.offsetWidth;

  popup.classList.add("show");
  document.body.classList.add("popup-open");
}

function closeSurprise() {
  const popup = document.getElementById("surprise-popup");

  if (popup) {
    popup.classList.remove("show");
    popup.hidden = true;
  }

  document.body.classList.remove("popup-open");
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeSurprise();
  }
});

/* =====================================
   SHY BUTTON ANIMATION
===================================== */

let shyAttempts = 0;

function moveShyButton() {
  const button = document.getElementById("shy-btn");
  const hint = document.getElementById("shy-hint");

  if (!button || shyAttempts >= 2) return;

  shyAttempts++;

  // First time moves right, second time moves left
  const distance = shyAttempts === 1 ? 65 : -65;

  button.style.transform = `translateX(${distance}px)`;

  button.classList.remove("wiggle");
  void button.offsetWidth;
  button.classList.add("wiggle");

  if (hint) {
    if (shyAttempts === 1) {
      hint.textContent = "Hehe, are you sure? 🥺";
    } else {
      hint.textContent =
        "Okay okay, I won't tease you anymore. 🤎";
    }
  }
}

function chooseTime() {
  if (shyAttempts < 2) {
    moveShyButton();
    return;
  }

  const button = document.getElementById("shy-btn");
  const hint = document.getElementById("shy-hint");

  if (button) {
    button.style.transform = "translateX(0)";
  }

  if (hint) {
    hint.textContent = "";
  }

  showAnswer("time");
}

/* =====================================
   CONNECT SHY BUTTON AUTOMATICALLY
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page4 = document.getElementById("page4");

  if (!page4) return;

  // Find the second answer button
  const buttons = page4.querySelectorAll("button.btn");

  const timeButton = Array.from(buttons).find(button =>
    button.getAttribute("onclick")?.includes("time") ||
    button.id === "shy-btn"
  );

  if (!timeButton) return;

  // Set up shy button even if HTML is still the old version
  timeButton.id = "shy-btn";
  timeButton.textContent =
    "I'M NOT READY YET, BUT THANK YOU 🤎";

  timeButton.removeAttribute("onclick");
 timeButton.addEventListener("click", chooseTime);
  timeButton.removeAttribute("ontouchstart");

  let hint = document.getElementById("shy-hint");

  if (!hint) {
    hint = document.createElement("p");
    hint.id = "shy-hint";
    hint.setAttribute("aria-live", "polite");
    timeButton.insertAdjacentElement("afterend", hint);
  }

// Move on first two clicks, then allow choice
timeButton.addEventListener("click", chooseTime);

  // Move on touch for phones
  timeButton.addEventListener("touchstart", event => {
    if (shyAttempts < 2) {
      event.preventDefault();
      moveShyButton();
    }
  }, { passive: false });

  // Move on first two clicks, then allow choice
  timeButton.addEventListener("click", chooseTime);
});
