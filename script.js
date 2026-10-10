
/* ==========================================
   FOR AIRIS — COMPLETE SCRIPT
   Music + Pages + Surprise + Formspree
   Malaysia Time (MYT / UTC+8)
========================================== */

const FORMSPREE_URL = "https://formspree.io/f/myekjbeg";

const music = document.getElementById("bg-music");
const musicButton = document.getElementById("music-btn");
const musicStatus = document.getElementById("music-status");

let shyAttempts = 0;
let replySubmitted = false;
let replySubmitting = false;

/* ==========================================
   MUSIC
========================================== */

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

/* ==========================================
   PAGE NAVIGATION
========================================== */

function nextPage(pageNumber) {
  document.querySelectorAll(".page").forEach((page) => {
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
      button.classList.remove("wiggle");
    }

    if (hint) {
      hint.textContent = "";
    }
  }
}

/* ==========================================
   MALAYSIA DATE & TIME
========================================== */

function getMalaysiaTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  return formatter.format(now) + " MYT";
}

/* ==========================================
   FORMSPREE DASHBOARD
========================================== */

async function saveAirisAnswer(choice) {
  if (replySubmitted || replySubmitting) return;

  replySubmitting = true;

  const status = document.getElementById("reply-status");

  if (status) {
    status.textContent = "Sending your choice... 🤎";
  }

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        choice: choice,
        malaysia_time: getMalaysiaTime(),
        source: "For Airis Website"
      })
    });

    if (!response.ok) {
      throw new Error("Formspree could not save the reply.");
    }

    replySubmitted = true;

    if (status) {
      status.textContent = "Your choice has been sent. Thank you. 🤎";
    }

    console.log("Airis reply saved successfully!");

  } catch (error) {
    console.error("Formspree error:", error);

    if (status) {
      status.textContent =
        "Your choice couldn't be sent. Please try again if you'd like. 🤎";
    }

  } finally {
    replySubmitting = false;
  }
}

/* ==========================================
   PAGE 4 — ANSWERS
========================================== */

function showAnswer(choice) {
  if (choice === "talk") {
    saveAirisAnswer("YES, I'D LOVE TO!");
    openSurprise();
    return;
  }

  if (choice === "time") {
    saveAirisAnswer("I'M NOT READY YET, BUT THANK YOU");

    const answer = document.getElementById("answer");

    if (answer) {
      answer.textContent =
        "That's okay. Take all the time you need. Thank you for reading my letter. 🤎🌸";
    }
  }
}

/* ==========================================
   SURPRISE POPUP
========================================== */

function openSurprise() {
  const popup = document.getElementById("surprise-popup");

  if (!popup) {
    console.warn("Surprise popup not found in index.html");
    return;
  }

  popup.classList.remove("show");
  popup.hidden = false;

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSurprise();
  }
});

/* ==========================================
   NOT READY BUTTON — CLICK ONLY
========================================== */

function moveShyButton() {
  const button = document.getElementById("shy-btn");
  const hint = document.getElementById("shy-hint");

  if (!button || shyAttempts >= 2) return;

  shyAttempts++;

  const distance = shyAttempts === 1 ? 65 : -65;

  button.style.transform = `translateX(${distance}px)`;

  button.classList.remove("wiggle");

  void button.offsetWidth;

  button.classList.add("wiggle");

  if (hint) {
    hint.textContent =
      shyAttempts === 1
        ? "Hehe, are you sure? 🥺"
        : "Okay okay, I won't tease you anymore. 🤎";
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
    button.classList.remove("wiggle");
  }

  if (hint) {
    hint.textContent = "";
  }

  showAnswer("time");
}

/* ==========================================
   BUTTON SETUP & PRIVACY NOTICE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const page4 = document.getElementById("page4");

  if (!page4) return;

  const buttons = page4.querySelectorAll("button.btn");

  const timeButton = Array.from(buttons).find((button) => {
    const onclick = button.getAttribute("onclick") || "";

    return (
      button.id === "shy-btn" ||
      onclick.includes("time")
    );
  });

  if (timeButton) {
    timeButton.id = "shy-btn";

    timeButton.textContent =
      "I'M NOT READY YET, BUT THANK YOU 🤎";

    timeButton.removeAttribute("onclick");
    timeButton.removeAttribute("onmouseenter");
    timeButton.removeAttribute("ontouchstart");

    let hint = document.getElementById("shy-hint");

    if (!hint) {
      hint = document.createElement("p");
      hint.id = "shy-hint";
      hint.setAttribute("aria-live", "polite");

      timeButton.insertAdjacentElement("afterend", hint);
    }

    timeButton.addEventListener("click", chooseTime);
  }

  let notice = document.getElementById("reply-notice");

  if (!notice) {
    notice = document.createElement("p");
    notice.id = "reply-notice";

    notice.textContent =
      "Your choice will be shared with me. No pressure to answer. 🤎";

    page4.appendChild(notice);
  }

  notice.style.fontSize = "13px";
  notice.style.color = "#795640";
  notice.style.textAlign = "center";
  notice.style.marginTop = "16px";

  let status = document.getElementById("reply-status");

  if (!status) {
    status = document.createElement("p");
    status.id = "reply-status";
    status.setAttribute("aria-live", "polite");
    page4.appendChild(status);
  }

  status.style.fontSize = "13px";
  status.style.color = "#795640";
  status.style.textAlign = "center";
  status.style.marginTop = "8px";
});
