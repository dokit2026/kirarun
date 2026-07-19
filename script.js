const id = (name) => document.getElementById(name);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const appState = {
  selectedEmotion: null,
  inputMethod: null,
  diaryText: "",
  selectedQuote: "",
  analysis: null,
  tutorialStep: 0,
  selectedOtherStar: null,
  talkRequests: [],
  matches: [],
  currentChatMatch: null,
  cameraImageUrl: null,
  currentPastMonth: new Date(2026, 6, 1),
  selectedPastDiary: null,

  pastDiaries: [
    {
      id: "past-1",
      date: "2026.7.12",
      time: "20:14",
      createdAt: "2026-07-12T20:14:00",
      emotion: "happy",
      color: "pink",
      quote: "新しいことに挑戦して、少しだけ自信がついた。",
      diaryText:
        "今日は新しいことに挑戦した。最初は不安だったけど、やってみたら意外と楽しくて、少しだけ自信がついた。"
    },
    {
      id: "past-2",
      date: "2026.7.14",
      time: "22:08",
      createdAt: "2026-07-14T22:08:00",
      emotion: "sad",
      color: "blue",
      quote: "うまくいかなかったけど、ちゃんと頑張った日だった。",
      diaryText:
        "今日は思ったよりうまくいかなかった。でも、投げ出さずに最後までやったから、ちゃんと頑張った日だったと思う。"
    },
    {
      id: "past-3",
      date: "2026.7.16",
      time: "19:42",
      createdAt: "2026-07-16T19:42:00",
      emotion: "normal",
      color: "green",
      quote: "普通の日の中にも、少し好きな時間があった。",
      diaryText:
        "今日は特別なことはなかったけど、帰り道に好きな音楽を聴いた時間がよかった。普通の日の中にも、少し好きな時間があった。"
    }
  ]
};

const emotionData = {
  happy: {
    label: "嬉しい",
    color: "pink",
    themeClass: "theme-happy"
  },
  angry: {
    label: "怒ってる",
    color: "red",
    themeClass: "theme-angry"
  },
  sad: {
    label: "悲しい",
    color: "blue",
    themeClass: "theme-sad"
  },
  normal: {
    label: "普通",
    color: "green",
    themeClass: "theme-normal"
  }
};
const otherStars = [
  {
    id: "star-pink-1",
    color: "pink",
    x: 25,
    y: 26,
    size: 52,
    text: "新しいことに挑戦して、少しだけ自信がついた。",
    mutualInterest: true
  },
  {
    id: "star-blue-1",
    color: "blue",
    x: 78,
    y: 24,
    size: 30,
    text: "今日は少し疲れたけど、空を見たら落ち着いた。",
    mutualInterest: false
  },
  {
    id: "star-purple-1",
    color: "purple",
    x: 82,
    y: 50,
    size: 52,
    text: "誰かに話したいことがある夜だった。",
    mutualInterest: true
  },
  {
    id: "star-green-1",
    color: "green",
    x: 20,
    y: 56,
    size: 30,
    text: "普通の日だけど、好きな音楽で少し元気になった。",
    mutualInterest: false
  },
  {
    id: "star-red-1",
    color: "red",
    x: 68,
    y: 54,
    size: 30,
    text: "うまく言えないけど、少しモヤモヤした。",
    mutualInterest: false
  }
];

const tutorialMessages = [
  "あなたの星が空へ飛んだよ",
  "まわりに見えるのは、他の人が飛ばした星だよ",
  "大きい星は、あなたの気持ちに近い星だよ",
  "小さい星は、あなたの気持ちから少し遠い星だよ",
  "お互いに喋ってみたいと思ったら、星座がつながるよ"
];

const feelingWords = [
  "わくわく",
  "ほっとした",
  "もやもや",
  "じんわり",
  "そわそわ",
  "前向き",
  "さみしい",
  "くやしい",
  "やさしい",
  "すっきり"
];

document.addEventListener("DOMContentLoaded", () => {
  setupIntroScreen();
  setupEmotionScreen();
  setupInputMethodScreen();
  setupDiaryInputScreen();
  setupCameraScreen();
  setupQuoteScreen();
  setupAnalysisScreen();
  setupTutorialScreen();
  setupHomeScreen();
  setupConnectionScreen();
  setupChatScreen();
  setupPastDiaryScreen();
  setupBackButtons();

  renderPastCalendar();
});
function showScreen(screenId) {
  qsa(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const nextScreen = id(screenId);

  if (nextScreen) {
    nextScreen.classList.add("active");
  }

  if (screenId === "skyHomeScreen") {
    renderHomeStars();
  }

  if (screenId === "connectionScreen") {
    renderMatchList();
  }

  if (screenId === "pastDiaryScreen") {
    renderPastCalendar();
  }
}

function setupBackButtons() {
  qsa("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.next;

      if (next) {
        showScreen(next);
      }
    });
  });
}

function setupIntroScreen() {
  const introTapBtn = id("introTapBtn");
  const introScreen = id("introScreen");

  function goNext(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    showScreen("emotionScreen");
  }

  if (introTapBtn) {
    introTapBtn.addEventListener("click", goNext);
    introTapBtn.addEventListener("touchend", goNext);
  }

  if (introScreen) {
    introScreen.addEventListener("click", goNext);
    introScreen.addEventListener("touchend", goNext);
  }
}

function setupEmotionScreen() {
  const cards = qsa(".emotion-card");
  const nextBtn = id("emotionNextBtn");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      selectEmotion(card);
    });

    card.addEventListener("touchend", (event) => {
      event.preventDefault();
      selectEmotion(card);
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (appState.selectedEmotion) {
        showScreen("inputMethodScreen");
      }
    });
  }
}
function selectEmotion(card) {
  const emotion = card.dataset.emotion;

  appState.selectedEmotion = emotion;
  applyTheme(emotion);

  qsa(".emotion-card").forEach((item) => {
    item.classList.remove("selected");
  });

  card.classList.add("selected");

  const nextBtn = id("emotionNextBtn");

  if (nextBtn) {
    nextBtn.disabled = false;
  }

  setTimeout(() => {
    showScreen("inputMethodScreen");
  }, 250);
}

function applyTheme(emotion) {
  document.body.classList.remove(
    "theme-happy",
    "theme-angry",
    "theme-sad",
    "theme-normal"
  );

  const data = emotionData[emotion];

  if (data) {
    document.body.classList.add(data.themeClass);
  }
}

function setupInputMethodScreen() {
  const methodCards = qsa(".method-card");
  const nextBtn = id("methodNextBtn");

  methodCards.forEach((card) => {
    card.addEventListener("click", () => {
      appState.inputMethod = card.dataset.method;

      methodCards.forEach((item) => {
        item.classList.remove("selected");
      });

      card.classList.add("selected");

      if (nextBtn) {
        nextBtn.disabled = false;
      }
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!appState.inputMethod) return;

      if (appState.inputMethod === "text") {
        showScreen("diaryInputScreen");
      }

      if (appState.inputMethod === "camera") {
        showScreen("cameraScreen");
      }
    });
  }
}

function setupDiaryInputScreen() {
  const diaryText = id("diaryText");
  const nextBtn = id("diaryNextBtn");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const text = diaryText ? diaryText.value.trim() : "";

      if (!text) {
        alert("日記を入力してね");
        return;
      }

      appState.diaryText = text;
      prepareSelectableText(text);
      showScreen("quoteSelectScreen");
    });
  }
}
function setupCameraScreen() {
  const cameraInput = id("cameraInput");
  const openCameraBtn = id("openCameraBtn");
  const cameraPreview = id("cameraPreview");
  const retakePhotoBtn = id("retakePhotoBtn");
  const photoOkBtn = id("photoOkBtn");
  const ocrText = id("ocrText");

  if (openCameraBtn && cameraInput) {
    openCameraBtn.addEventListener("click", () => {
      cameraInput.click();
    });
  }

  if (cameraInput) {
    cameraInput.addEventListener("change", () => {
      const file = cameraInput.files && cameraInput.files[0];

      if (!file) return;

      if (appState.cameraImageUrl) {
        URL.revokeObjectURL(appState.cameraImageUrl);
      }

      appState.cameraImageUrl = URL.createObjectURL(file);

      if (cameraPreview) {
        cameraPreview.src = appState.cameraImageUrl;
        cameraPreview.classList.remove("hidden");
      }
    });
  }

  if (retakePhotoBtn && cameraInput) {
    retakePhotoBtn.addEventListener("click", () => {
      cameraInput.value = "";

      if (cameraPreview) {
        cameraPreview.src = "";
        cameraPreview.classList.add("hidden");
      }
    });
  }

  if (photoOkBtn) {
    photoOkBtn.addEventListener("click", () => {
      if (ocrText) {
        ocrText.value =
          "今日は少し特別な日だった。小さなことだけど、自分の中ではちゃんと残しておきたい気持ちがあった。";
      }

      showScreen("ocrEditScreen");
    });
  }

  const ocrNextBtn = id("ocrNextBtn");

  if (ocrNextBtn) {
    ocrNextBtn.addEventListener("click", () => {
      const text = ocrText ? ocrText.value.trim() : "";

      if (!text) {
        alert("文章を入力してね");
        return;
      }

      appState.diaryText = text;
      prepareSelectableText(text);
      showScreen("quoteSelectScreen");
    });
  }
}
function setupQuoteScreen() {
  const nextBtn = id("quoteNextBtn");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!appState.selectedQuote) {
        alert("公開する一文を選んでね");
        return;
      }

      createAnalysis();
      renderAnalysis();
      showScreen("analysisScreen");
    });
  }
}

function prepareSelectableText(text) {
  const box = id("selectableText");
  const selectedQuote = id("selectedQuote");
  const quoteCount = id("quoteCount");
  const quoteNextBtn = id("quoteNextBtn");

  if (!box) return;

  appState.selectedQuote = "";

  box.innerHTML = "";

  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.dataset.index = String(index);
    box.appendChild(span);
  });

  if (selectedQuote) {
    selectedQuote.textContent = "まだ選ばれていません";
  }

  if (quoteCount) {
    quoteCount.textContent = "0 / 140字";
  }

  if (quoteNextBtn) {
    quoteNextBtn.disabled = true;
  }

  setupTextMarker(box);
}

function setupTextMarker(box) {
  let isDragging = false;
  let startIndex = null;

  function clearMarked() {
    box.querySelectorAll("span").forEach((span) => {
      span.classList.remove("marked");
    });
  }

  function getSpanFromPoint(event) {
    const point = event.touches ? event.touches[0] : event;
    const element = document.elementFromPoint(point.clientX, point.clientY);

    if (!element) return null;

    if (element.matches("#selectableText span")) {
      return element;
    }

    return null;
  }

  function start(event) {
    const span = getSpanFromPoint(event);
    if (!span) return;

    event.preventDefault();

    isDragging = true;
    startIndex = Number(span.dataset.index);

    clearMarked();
    span.classList.add("marked");
    updateSelectedQuote(box);
  }

  function move(event) {
    if (!isDragging || startIndex === null) return;

    const span = getSpanFromPoint(event);
    if (!span) return;

    event.preventDefault();

    const endIndex = Number(span.dataset.index);
    markRange(box, startIndex, endIndex);
  }

  function end() {
    isDragging = false;
    startIndex = null;
    updateSelectedQuote(box);
  }

  box.onmousedown = start;
  box.onmousemove = move;
  document.addEventListener("mouseup", end);

  box.ontouchstart = start;
  box.ontouchmove = move;
  document.addEventListener("touchend", end);
}
function markRange(box, start, end) {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  let count = 0;

  box.querySelectorAll("span").forEach((span) => {
    const index = Number(span.dataset.index);

    if (index >= min && index <= max && count < 140) {
      span.classList.add("marked");
      count++;
    } else {
      span.classList.remove("marked");
    }
  });

  updateSelectedQuote(box);
}

function updateSelectedQuote(box) {
  const selected = [...box.querySelectorAll("span.marked")]
    .map((span) => span.textContent)
    .join("")
    .slice(0, 140);

  appState.selectedQuote = selected;

  const selectedQuote = id("selectedQuote");
  const quoteCount = id("quoteCount");
  const quoteNextBtn = id("quoteNextBtn");

  if (selectedQuote) {
    selectedQuote.textContent = selected || "まだ選ばれていません";
  }

  if (quoteCount) {
    quoteCount.textContent = `${selected.length} / 140字`;
  }

  if (quoteNextBtn) {
    quoteNextBtn.disabled = selected.length === 0;
  }
}

function setupAnalysisScreen() {
  const flyStarBtn = id("flyStarBtn");

  if (flyStarBtn) {
    flyStarBtn.addEventListener("click", () => {
      saveCurrentDiary();
      appState.tutorialStep = 0;
      renderTutorial();
      showScreen("tutorialScreen");
    });
  }
}

function createAnalysis() {
  const emotion = appState.selectedEmotion || "happy";

  let happy = 25;
  let angry = 10;
  let sad = 15;

  if (emotion === "happy") {
    happy = 72;
    angry = 8;
    sad = 12;
  }

  if (emotion === "angry") {
    happy = 12;
    angry = 70;
    sad = 18;
  }

  if (emotion === "sad") {
    happy = 10;
    angry = 12;
    sad = 76;
  }

  if (emotion === "normal") {
    happy = 38;
    angry = 12;
    sad = 22;
  }

  const original = Math.max(100 - happy - angry - sad, 8);
  const randomWord =
    feelingWords[Math.floor(Math.random() * feelingWords.length)];

  appState.analysis = {
    happy,
    angry,
    sad,
    original,
    originalLabel: randomWord
  };
}
function renderAnalysis() {
  const analysis = appState.analysis;
  if (!analysis) return;

  const analysisQuote = id("analysisQuote");
  const mainStar = id("analysisMainStar");

  if (analysisQuote) {
    analysisQuote.textContent = appState.selectedQuote || "選んだ言葉";
  }

  if (mainStar) {
    mainStar.className = "analysis-main-star";
    mainStar.classList.add(appState.selectedEmotion || "happy");
  }

  setBar("happy", analysis.happy);
  setBar("angry", analysis.angry);
  setBar("sad", analysis.sad);
  setBar("original", analysis.original);

  const originalEmotionLabel = id("originalEmotionLabel");

  if (originalEmotionLabel) {
    originalEmotionLabel.textContent = analysis.originalLabel;
  }
}

function setBar(name, value) {
  const bar = id(`${name}Bar`);
  const score = id(`${name}Score`);

  if (bar) {
    bar.style.width = `${value}%`;
  }

  if (score) {
    score.textContent = `${value}%`;
  }
}

function saveCurrentDiary() {
  const now = new Date();
  const emotion = appState.selectedEmotion || "happy";
  const data = emotionData[emotion];

  const diary = {
    id: `past-${Date.now()}`,
    date: `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`,
    time: `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`,
    createdAt: now.toISOString(),
    emotion,
    color: data.color,
    quote: appState.selectedQuote,
    diaryText: appState.diaryText
  };

  appState.pastDiaries.push(diary);
}

function setupTutorialScreen() {
  const nextBtn = id("tutorialNextBtn");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      appState.tutorialStep++;

      if (appState.tutorialStep >= tutorialMessages.length) {
        showScreen("skyHomeScreen");
        return;
      }

      renderTutorial();
    });
  }
}

function renderTutorial() {
  const text = id("tutorialText");
  const overlay = id("tutorialOverlay");

  if (text) {
    text.textContent =
      tutorialMessages[appState.tutorialStep] || tutorialMessages[0];
  }

  qsa(".tutorial-other-star, .tutorial-my-star").forEach((star) => {
    star.classList.remove("tutorial-highlight");
  });

  if (overlay) {
    if (appState.tutorialStep === 0) {
      overlay.classList.add("hidden");
    } else {
      overlay.classList.remove("hidden");
    }
  }

  if (appState.tutorialStep === 2) {
    qsa(".tutorial-other-large").forEach((star) => {
      star.classList.add("tutorial-highlight");
    });
  }

  if (appState.tutorialStep === 3) {
    qsa(".tutorial-other-small").forEach((star) => {
      star.classList.add("tutorial-highlight");
    });
  }

  if (appState.tutorialStep === 4) {
    qsa(".tutorial-other-large").forEach((star) => {
      star.classList.add("tutorial-highlight");
    });
  }
}
function setupHomeScreen() {
  const homeToggleBtn = id("homeToggleBtn");
  const homeBar = id("homeBar");
  const connectionBtn = id("connectionBtn");
  const pastDiaryBtn = id("pastDiaryBtn");
  const talkRequestBtn = id("talkRequestBtn");
  const myStar = id("myStar");

  if (homeToggleBtn && homeBar) {
    homeToggleBtn.addEventListener("click", () => {
      homeBar.classList.toggle("open");
    });
  }

  if (connectionBtn) {
    connectionBtn.addEventListener("click", () => {
      showScreen("connectionScreen");
    });
  }

  if (pastDiaryBtn) {
    pastDiaryBtn.addEventListener("click", () => {
      showScreen("pastDiaryScreen");
    });
  }

  if (talkRequestBtn) {
    talkRequestBtn.addEventListener("click", () => {
      sendTalkRequest();
    });
  }

  if (myStar) {
    myStar.addEventListener("click", () => {
      selectMyStar();
    });
  }
}

function renderHomeStars() {
  const layer = id("otherStarsLayer");
  const lines = id("homeConstellationLines");

  if (!layer) return;

  layer.innerHTML = "";

  otherStars.forEach((star) => {
    const button = document.createElement("button");
    button.className = `home-other-star ${star.color}`;
    button.type = "button";
    button.textContent = "★";
    button.style.left = `${star.x}%`;
    button.style.top = `${star.y}%`;
    button.style.fontSize = `${star.size}px`;

    button.addEventListener("click", () => {
      selectOtherStar(star);
    });

    layer.appendChild(button);
  });

  renderHomeLines(lines);
}

function renderHomeLines(svg) {
  if (!svg) return;

  svg.innerHTML = "";

  appState.matches.forEach((match) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", "50%");
    line.setAttribute("y1", "38%");
    line.setAttribute("x2", `${match.x}%`);
    line.setAttribute("y2", `${match.y}%`);
    line.classList.add("constellation-line");

    svg.appendChild(line);
  });
}

function selectMyStar() {
  const card = id("starInfoCard");
  const text = id("otherStarText");
  const talkBtn = id("talkRequestBtn");

  appState.selectedOtherStar = null;

  if (!card || !text) return;

  card.classList.remove(
    "hidden",
    "info-pink",
    "info-red",
    "info-blue",
    "info-green",
    "info-purple"
  );

  const emotion = appState.selectedEmotion || "happy";
  const color = emotionData[emotion].color;

  card.classList.add(`info-${color}`);

  const label = card.querySelector(".selected-label");

  if (label) {
    label.textContent = "あなたが選んだ言葉";
  }

  text.textContent = appState.selectedQuote || "まだ星にした言葉はありません";

  if (talkBtn) {
    talkBtn.classList.add("hidden");
  }
}

function selectOtherStar(star) {
  const card = id("starInfoCard");
  const text = id("otherStarText");
  const talkBtn = id("talkRequestBtn");

  appState.selectedOtherStar = star;

  if (!card || !text) return;

  card.classList.remove(
    "hidden",
    "info-pink",
    "info-red",
    "info-blue",
    "info-green",
    "info-purple"
  );

  card.classList.add(`info-${star.color}`);

  const label = card.querySelector(".selected-label");

  if (label) {
    label.textContent = "この星が選んだ言葉";
  }

  text.textContent = star.text;

  if (talkBtn) {
    talkBtn.classList.remove("hidden");
    talkBtn.textContent = appState.talkRequests.includes(star.id)
      ? "送信済み"
      : "喋ってみたい";
  }
}
function sendTalkRequest() {
  const star = appState.selectedOtherStar;

  if (!star) return;

  if (!appState.talkRequests.includes(star.id)) {
    appState.talkRequests.push(star.id);
  }

  const talkBtn = id("talkRequestBtn");

  if (talkBtn) {
    talkBtn.textContent = "送信済み";
  }

  if (star.mutualInterest) {
    const alreadyMatched = appState.matches.some((match) => {
      return match.id === star.id;
    });

    if (!alreadyMatched) {
      appState.matches.push(star);
      renderHomeLines(id("homeConstellationLines"));

      setTimeout(() => {
        alert("相手も話してみたいと思っています。星座がつながりました！");
      }, 200);
    }
  } else {
    setTimeout(() => {
      alert("喋ってみたい気持ちを送りました");
    }, 200);
  }
}

function setupConnectionScreen() {
  const matchList = id("matchList");

  if (!matchList) return;

  matchList.addEventListener("click", (event) => {
    const card = event.target.closest(".match-card");
    if (!card) return;

    const matchId = card.dataset.matchId;
    const match = appState.matches.find((item) => item.id === matchId);

    if (match) {
      openChat(match);
    }
  });
}

function renderMatchList() {
  const matchList = id("matchList");

  if (!matchList) return;

  matchList.innerHTML = "";

  if (appState.matches.length === 0) {
    const empty = document.createElement("p");
    empty.className = "lead-text";
    empty.textContent = "まだつながった星はありません";
    matchList.appendChild(empty);
    return;
  }

  appState.matches.forEach((match) => {
    const card = document.createElement("button");
    card.className = "match-card";
    card.type = "button";
    card.dataset.matchId = match.id;

    card.innerHTML = `
      <span class="match-star ${match.color}">★</span>
      <p class="match-text">${escapeHtml(match.text)}</p>
    `;

    matchList.appendChild(card);
  });
}

function openChat(match) {
  appState.currentChatMatch = match;

  const partnerText = id("chatPartnerText");
  const topicSuggestion = id("topicSuggestion");
  const partnerBubble = document.querySelector(".partner-first-bubble");
  const messageList = id("messageList");

  if (partnerText) {
    partnerText.textContent = `「${match.text}」`;
  }

  if (topicSuggestion) {
    topicSuggestion.textContent = createTopicSuggestion(match);
  }

  if (partnerBubble) {
    partnerBubble.classList.remove(
      "bubble-pink",
      "bubble-red",
      "bubble-blue",
      "bubble-green",
      "bubble-purple"
    );

    partnerBubble.classList.add(`bubble-${match.color}`);
  }

  if (messageList) {
    messageList.innerHTML = "";

    const first = document.createElement("div");
    first.className = "message other";
    first.textContent = "はじめまして。言葉が少し似ていて気になりました。";
    messageList.appendChild(first);
  }

  showScreen("chatScreen");
}

function createTopicSuggestion(match) {
  if (match.color === "pink") {
    return "最近、挑戦してよかったことは？";
  }

  if (match.color === "blue") {
    return "落ち着ける時間ってどんな時？";
  }

  if (match.color === "red") {
    return "モヤモヤした時どうしてる？";
  }

  if (match.color === "green") {
    return "普通の日の小さな楽しみは？";
  }

  return "今日いちばん心に残ったことは？";
}

function setupChatScreen() {
  const form = id("messageForm");
  const input = id("messageInput");
  const list = id("messageList");

  if (!form || !input || !list) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    const message = document.createElement("div");
    message.className = "message me";
    message.textContent = text;

    list.appendChild(message);
    input.value = "";
    list.scrollTop = list.scrollHeight;
  });
}

function setupPastDiaryScreen() {
  const prevMonthBtn = id("prevMonthBtn");
  const nextMonthBtn = id("nextMonthBtn");
  const readDiaryBtn = id("readDiaryBtn");

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      appState.currentPastMonth.setMonth(
        appState.currentPastMonth.getMonth() - 1
      );
      renderPastCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      appState.currentPastMonth.setMonth(
        appState.currentPastMonth.getMonth() + 1
      );
      renderPastCalendar();
    });
  }

  if (readDiaryBtn) {
    readDiaryBtn.addEventListener("click", () => {
      if (appState.selectedPastDiary) {
        openDiaryDetail(appState.selectedPastDiary);
      }
    });
  }
}

function renderPastCalendar() {
  const title = id("pastMonthTitle");
  const grid = id("pastCalendarGrid");
  const countText = id("pastMonthEntryCount");
  const lines = id("pastConstellationLines");
  const card = id("pastDiaryCard");

  if (!grid) return;

  const year = appState.currentPastMonth.getFullYear();
  const month = appState.currentPastMonth.getMonth();

  if (title) {
    title.textContent = `${year}年${month + 1}月`;
  }

  grid.innerHTML = "";

  if (lines) {
    lines.innerHTML = "";
  }

  if (card) {
    card.classList.add("hidden");
  }

  appState.selectedPastDiary = null;

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startDay);

  const monthDiaries = appState.pastDiaries.filter((diary) => {
    const date = new Date(diary.createdAt);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  if (countText) {
    countText.textContent = monthDiaries.length;
  }

  const starPositions = [];

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const cell = document.createElement("div");
    cell.className = "past-day-cell";

    if (cellDate.getMonth() !== month) {
      cell.classList.add("is-other-month");
    }

    const number = document.createElement("div");
    number.className = "past-day-number";
    number.textContent = cellDate.getDate();

    cell.appendChild(number);

    const diary = monthDiaries.find((item) => {
      const d = new Date(item.createdAt);

      return (
        d.getFullYear() === cellDate.getFullYear() &&
        d.getMonth() === cellDate.getMonth() &&
        d.getDate() === cellDate.getDate()
      );
    });

    if (diary) {
      const content = document.createElement("div");
      content.className = "past-day-content";

      const star = document.createElement("button");
      star.className = `past-calendar-star ${diary.color}`;
      star.type = "button";
      star.textContent = "★";

      star.addEventListener("click", () => {
        selectPastDiary(diary);
      });

      const time = document.createElement("div");
      time.className = "past-day-time";
      time.textContent = diary.time;

      const emotion = document.createElement("div");
      emotion.className = "past-day-emotion";
      emotion.textContent = emotionData[diary.emotion].label;

      content.appendChild(star);
      content.appendChild(time);
      content.appendChild(emotion);
      cell.appendChild(content);

      starPositions.push({
        index: i,
        color: diary.color
      });
    }

    grid.appendChild(cell);
  }

  setTimeout(() => {
    drawPastLines(starPositions);
  }, 0);
}

function drawPastLines(starPositions) {
  const svg = id("pastConstellationLines");
  const grid = id("pastCalendarGrid");

  if (!svg || !grid) return;

  svg.innerHTML = "";

  const cells = [...grid.children];

  for (let i = 0; i < starPositions.length - 1; i++) {
    const currentCell = cells[starPositions[i].index];
    const nextCell = cells[starPositions[i + 1].index];

    if (!currentCell || !nextCell) continue;

    const currentRect = currentCell.getBoundingClientRect();
    const nextRect = nextCell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();

    const x1 = currentRect.left + currentRect.width / 2 - gridRect.left;
    const y1 = currentRect.top + currentRect.height / 2 - gridRect.top + 8;
    const x2 = nextRect.left + nextRect.width / 2 - gridRect.left;
    const y2 = nextRect.top + nextRect.height / 2 - gridRect.top + 8;

    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.classList.add("constellation-line");

    svg.appendChild(line);
  }
}

function selectPastDiary(diary) {
  appState.selectedPastDiary = diary;

  const card = id("pastDiaryCard");
  const date = id("pastDiaryDate");
  const meta = id("pastDiaryMeta");
  const quote = id("pastDiaryQuote");
  const readBtn = id("readDiaryBtn");

  if (!card) return;

  card.classList.remove("hidden");

  if (date) {
    date.textContent = diary.date;
  }

  if (meta) {
    meta.textContent = `${diary.time} / ${emotionData[diary.emotion].label}`;
  }

  if (quote) {
    quote.textContent = `「${diary.quote}」`;
  }

  if (readBtn) {
    const colorSet = getDiaryColorSet(diary.color);
    readBtn.style.background = colorSet.main;
  }
}

function openDiaryDetail(diary) {
  const detailDate = id("detailDate");
  const detailQuote = id("detailQuote");
  const detailDiaryText = id("detailDiaryText");
  const detailKirarunComment = id("detailKirarunComment");

  const colorSet = getDiaryColorSet(diary.color);

  document.documentElement.style.setProperty("--detail-color", colorSet.main);
  document.documentElement.style.setProperty("--detail-bg", colorSet.bg);

  if (detailDate) {
    detailDate.textContent = diary.date;
  }

  if (detailQuote) {
    detailQuote.textContent = `「${diary.quote}」`;
  }

  if (detailDiaryText) {
    detailDiaryText.textContent = diary.diaryText;
  }

  if (detailKirarunComment) {
    detailKirarunComment.textContent = createKirarunComment(diary);
  }

  showScreen("diaryDetailScreen");
}

function createKirarunComment(diary) {
  if (diary.emotion === "happy") {
    return "この日のあなたは、少し前に進めたことを大切に感じていたみたい。";
  }

  if (diary.emotion === "angry") {
    return "この日は、言葉にしにくいモヤモヤがあった日かもしれないね。";
  }

  if (diary.emotion === "sad") {
    return "この日は少ししんどかったけど、ちゃんと気持ちを残せていてえらいよ。";
  }

  return "何気ない一日にも、ちゃんとあなたらしい気持ちが残っているね。";
}

function getDiaryColorSet(color) {
  const sets = {
    pink: {
      main: "#ff6fa8",
      bg: "#f8d6e5"
    },
    red: {
      main: "#ff6b76",
      bg: "#f8dadd"
    },
    blue: {
      main: "#55b9ef",
      bg: "#dff2fb"
    },
    green: {
      main: "#65cc5f",
      bg: "#e4f3df"
    },
    purple: {
      main: "#9c7ae8",
      bg: "#eadfff"
    }
  };

  return sets[color] || sets.pink;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}