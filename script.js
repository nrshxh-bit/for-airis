
/* ==========================================
   FOR AIRIS — COMPLETE SCRIPT
   Music + Pages + Surprise + Formspree
   Malaysia Time + Optional Little Note
========================================== */

const FORMSPREE_URL = "https://formspree.io/f/myekjbeg";

const music = document.getElementById("bg-music");
const musicButton = document.getElementById("music-btn");
const musicStatus = document.getElementById("music-status");

let shyAttempts = 0;
let replySubmitted = false;
let replySubmitting = false;
let noteSubmitted = false;
let noteSubmitting = false;

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

    if (hint) hint.textContent = "";
  }
}

/* ==========================================
   MALAYSIA TIME
========================================== */

function getMalaysiaTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(new Date()) + " MYT";
}

/* ==========================================
   FORMSPREE — CHOICE
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
      throw new Error("Could not save choice.");
    }

    replySubmitted = true;

    if (status) {
      status.textContent = "Your choice has been sent. Thank you. 🤎";
    }

  } catch (error) {
    console.error("Formspree choice error:", error);

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

    showLittleNote();
  }
}

/* ==========================================
   SURPRISE POPUP
========================================== */

function openSurprise() {
  const popup = document.getElementById("surprise-popup");

  if (!popup) {
    console.warn("Surprise popup not found.");
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
  if (event.key === "Escape") closeSurprise();
});

/* ==========================================
   NOT READY BUTTON — CLICK ONLY
========================================== */

function moveShyButton() {
  const button = document.getElementById("shy-btn");
  const hint = document.getElementById("shy-hint");

  if (!button || shyAttempts >= 2) return;

  shyAttempts++;

  button.style.transform =
    `translateX(${shyAttempts === 1 ? 65 : -65}px)`;

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

  if (hint) hint.textContent = "";

  showAnswer("time");
}

/* ==========================================
   OPTIONAL LITTLE NOTE
========================================== */

function showLittleNote() {
  const box = document.getElementById("little-note-box");

  if (!box) return;

  box.hidden = false;
}

function hideLittleNote() {
  const box = document.getElementById("little-note-box");

  if (box) box.hidden = true;
}

async function sendLittleNote() {
  if (noteSubmitted || noteSubmitting) return;

  const textarea = document.getElementById("little-note-text");
  const status = document.getElementById("little-note-status");
  const sendButton = document.getElementById("send-little-note");

  if (!textarea) return;

  const comment = textarea.value.trim();

  if (!comment) {
    if (status) {
      status.textContent =
        "It's okay to leave this empty. You don't have to write anything. 🤎";
    }
    return;
  }

  noteSubmitting = true;

  if (sendButton) sendButton.disabled = true;

  if (status) status.textContent = "Sending your little note... 💌";

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        choice: "I'M NOT READY YET, BUT THANK YOU",
        comment: comment,
        malaysia_time: getMalaysiaTime(),
        source: "For Airis Website — Little Note"
      })
    });

    if (!response.ok) {
      throw new Error("Could not send note.");
    }

    noteSubmitted = true;
    textarea.disabled = true;

    if (status) {
      status.textContent =
        "Your little note has been sent. Thank you for sharing. 🤎🌸";
    }

  } catch (error) {
    console.error("Formspree note error:", error);

    if (status) {
      status.textContent =
        "Your note couldn't be sent. You can try again if you'd like. 🤎";
    }

    if (sendButton) sendButton.disabled = false;

  } finally {
    noteSubmitting = false;
  }
}

/* ==========================================
   SETUP PAGE 4
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

  /* Privacy notice */

  let notice = document.getElementById("reply-notice");

  if (!notice) {
    notice = document.createElement("p");
    notice.id = "reply-notice";

    notice.textContent =
      "Your choice will be shared with me. No pressure to answer. 🤎";

    page4.appendChild(notice);
  }

  notice.style.cssText = `
    font-size: 13px;
    color: #795640;
    text-align: center;
    margin-top: 16px;
  `;

  let status = document.getElementById("reply-status");

  if (!status) {
    status = document.createElement("p");
    status.id = "reply-status";
    status.setAttribute("aria-live", "polite");
    page4.appendChild(status);
  }

  status.style.cssText = `
    font-size: 13px;
    color: #795640;
    text-align: center;
    margin-top: 8px;
  `;

  /* Create the little note box */

  const noteBox = document.createElement("div");
  noteBox.id = "little-note-box";
  noteBox.hidden = true;

  noteBox.innerHTML = `
    <div class="little-note-inner">
      <div class="little-note-flower">🌸 🤎 🌸</div>

      <h3>That's okay, take your time.</h3>

      <p>
        You don't have to explain anything.
        But if there's something you'd like me to know,
        you can leave a little note here.
      </p>

      <textarea
        id="little-note-text"
        maxlength="2000"
        placeholder="Write anything you feel... 💌"
        aria-label="Your optional little note"
      ></textarea>

      <button
        id="send-little-note"
        type="button"
        class="little-note-send"
      >
        Send my little note 🤎
      </button>

      <button
        id="close-little-note"
        type="button"
        class="little-note-close"
      >
        Maybe another time 🌷
      </button>

      <p class="little-note-privacy">
        Writing is optional. Your message will only be
        shared with me if you choose to send it.
      </p>

      <p id="little-note-status" aria-live="polite"></p>
    </div>
  `;

  const answer = document.getElementById("answer");

  if (answer) {
    answer.insertAdjacentElement("afterend", noteBox);
  } else {
    page4.appendChild(noteBox);
  }

  document
    .getElementById("send-little-note")
    .addEventListener("click", sendLittleNote);

  document
    .getElementById("close-little-note")
    .addEventListener("click", hideLittleNote);
});
