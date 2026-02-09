import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- FIREBASE CONFIGURATION ---
// TODO: User must replace these with their own project keys
const firebaseConfig = {
  apiKey: "AIzaSyAu4iY2hmn45c9Zk0Sfx0Kw4IDzAHnh_0I",
  authDomain: "november24-fc57c.firebaseapp.com",
  databaseURL: "https://november24-fc57c-default-rtdb.firebaseio.com",
  projectId: "november24-fc57c",
  storageBucket: "november24-fc57c.firebasestorage.app",
  messagingSenderId: "917954305225",
  appId: "1:917954305225:web:3769cc28dec82129d68118",
  measurementId: "G-YCDV5QDMCG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const memories = [
  {
    id: "roadtrip",
    title: "यात्रा (Road Trip)",
    date: "Spring 2027",
    desc: "खुला सडक र हाम्रो यात्रा... हरेक मोडमा नयाँ कहानी।",
    img: "assets/Roadtrip.jpeg",
    theme: { accent: "#e74c3c" },
    audio: "assets/Roadtrip.mp3",
    polaroids: [
      {
        img: "assets/Hetauda a.JPG",
        caption: "हावाको स्पर्श",
      },
      {
        img: "assets/Hetauda j.JPG",
        caption: "नयाँ बाटो",
      },
      {
        img: "https://placehold.co/400x400/8a4b4b/fff?text=Us",
        caption: "हामी",
      },
    ],
  },
  {
    id: "dates",
    title: "सुनौला पलहरू (Dates)",
    date: "Every Sunday",
    desc: "तातो कफी र तिम्रा मीठा कुराहरू। समय नै रोकिन्थ्यो।",
    img: "assets/Date.JPG",
    theme: { accent: "#a1887f" },
    audio: "assets/Dates.mp3",
    polaroids: [
      {
        img: "assets/First day.JPG",
        caption: "Cutie",
      },
      {
        img: "assets/First full.JPG",
        caption: "First Selfie",
      },
      {
        img: "assets/Burger house.JPG",
        caption: "Natak",
      },
      {
        img: "assets/Late night movie.JPG",
        caption: "Us",
      },
      {
        img: "assets/Snap.JPG",
        caption: "Hehe",
      },
      {
        img: "assets/Mokshya.JPG",
        caption: "Mokshya",
      },
      {
        img: "assets/Pokhara.JPG",
        caption: "Late night pokhara",
      },
      {
        img: "assets/Snap.JPG",
        caption: "First Selfie",
      },
      {
        img: "assets/Snap.JPG",
        caption: "First Selfie",
      },
      {
        img: "assets/Snap.JPG",
        caption: "First Selfie",
      },
      {
        img: "assets/Snap.JPG",
        caption: "First Selfie",
      },
    ],
  },
  {
    id: "Life Together",
    title: "बितेका दिनहरू (Life Together)",
    date: "July 2026",
    desc: "घामको किरण र तिम्रो साथ। सुनौलो दिनहरू।",
    img: "assets/Life.JPG",
    theme: { accent: "#C1CCB8" },
    audio: "assets/audio_summer.mp3",
    polaroids: [
      {
        img: "assets/Sunrise 2.JPG",
        caption: "रमाइलो",
      },
      {
        img: "assets/Sunrise.JPG",
        caption: "मिठो याद",
      },
      {
        img: "assets/Life.JPG",
        caption: "साँझपख",
      },
    ],
  },
  {
    id: "quiet",
    title: "शान्त पल (Quiet Days)",
    date: "Winter 2026",
    desc: "केही नबोली पनि धेरै कुरा हुने पलहरू।",
    img: "assets/Quiet.JPG",
    theme: { accent: "#90a4ae" },
    audio: "assets/quiet.mp3",
    polaroids: [
      {
        img: "https://placehold.co/400x400/607d8b/fff?text=Book",
        caption: "किताब र तिमी",
      },
      {
        img: "https://placehold.co/400x500/455a64/fff?text=Rain",
        caption: "पानी पर्दा",
      },
    ],
  },
  {
    id: "Food",
    title: "स्वादका सम्झनाहरू (Food)",
    date: "Oct 2026",
    desc: "धूनमा हराएको त्यो साँझ।",
    img: "assets/Food 1.JPG",
    theme: { accent: "#ba68c8" },
    audio: "assets/audio_music.mp3",
    polaroids: [
      {
        img: "https://placehold.co/400x400/9c27b0/fff?text=Guitar",
        caption: "गीत",
      },
      {
        img: "https://placehold.co/400x500/7b1fa2/fff?text=Crowd",
        caption: "रमाइलो भीड",
      },
    ],
  },
];

class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.currentSrc = "";
    this.isPlaying = false;
    this.fadeInterval = null;
    this.volume = 0.02;
    this.audio.volume = 0;

    this.playBtn = document.getElementById("playBtn");
    this.volSlider = document.getElementById("volumeSlider");

    this.setupControls();
  }

  setupControls() {
    this.playBtn.addEventListener("click", () => {
      if (this.isPlaying) this.pause();
      else this.resume();
    });
    this.volSlider.addEventListener("input", (e) => {
      this.volume = e.target.value;
      if (this.isPlaying) this.audio.volume = this.volume;
    });
  }

  play(src, trackName) {
    if (src === this.currentSrc) return;

    const fadeOutInterval = setInterval(() => {
      if (this.audio.volume > 0.05) {
        this.audio.volume -= 0.1;
      } else {
        clearInterval(fadeOutInterval);
        this.audio.pause();

        this.audio.src = src;
        this.currentSrc = src;
        this.audio.volume = 0;

        if (this.isPlaying) {
          this.audio.play().catch((e) => console.log("Autoplay blocked"));
          this.fadeIn();
        }
      }
    }, 30);
  }

  resume() {
    this.isPlaying = true;
    this.playBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
            </svg>
        `;
    this.audio.play();
    this.fadeIn();
  }

  pause() {
    this.isPlaying = false;
    this.playBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>
            </svg>
        `;
    this.audio.pause();
  }

  fadeIn() {
    const fadeIn = setInterval(() => {
      if (this.audio.volume < this.volume - 0.05) {
        this.audio.volume += 0.05;
      } else {
        this.audio.volume = this.volume;
        clearInterval(fadeIn);
      }
    }, 50);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const audioMgr = new AudioManager();
  const filmTrack = document.getElementById("filmTrack");
  const stageBg = document.getElementById("stageBg");
  const stageContent = document.getElementById("stageContent");
  const rightPanel = document.getElementById("rightPanel");
  const fullscreenOverlay = document.getElementById("fullscreenOverlay");
  const polaroidGrid = document.getElementById("polaroidGrid");

  let activeMemoryId = memories[0].id;
  let isFullscreen = false;

  document.addEventListener(
    "click",
    () => {
      if (
        audioMgr.audio.context &&
        audioMgr.audio.context.state === "suspended"
      ) {
        audioMgr.audio.context.resume();
      }

      if (!audioMgr.isPlaying) {
        audioMgr.isPlaying = true;
        audioMgr.playBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                </svg>
            `;
        audioMgr.audio.play().catch((e) => console.log("Autoplay blocked"));
        audioMgr.fadeIn();
      }
    },
    { once: true },
  );

  memories.forEach((mem, index) => {
    const item = document.createElement("div");
    item.className = "film-item";
    if (index === 0) item.classList.add("active");
    item.dataset.id = mem.id;
    item.innerHTML = `
            <div class="film-frame"><img src="${mem.img}" alt="Thumb"></div>
            <div class="film-meta">
                <span class="playing-dot"></span>
                <span>${mem.id}</span>
            </div>
        `;

    item.addEventListener("mouseenter", () => {
      if (!isFullscreen && window.innerWidth > 430) {
        previewMemory(mem, false);
      }
    });

    // Desktop: click film item to open fullscreen
    if (window.innerWidth > 430) {
      item.addEventListener("click", () => {
        activeMemoryId = mem.id;
        document
          .querySelectorAll(".film-item")
          .forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        previewMemory(mem, true);
        openFullscreen(mem);
      });
    }

    filmTrack.appendChild(item);
  });

  // Enable fullscreen on mobile by tapping the stage content
  if (window.innerWidth <= 430) {
    stageContent.addEventListener("click", () => {
      const activeMem = memories.find((m) => m.id === activeMemoryId);
      if (activeMem) {
        openFullscreen(activeMem);
      }
    });
  }

  previewMemory(memories[0], true);

  function previewMemory(mem, isLock) {
    stageContent.querySelector(".stage-title").textContent = mem.title;
    stageContent.querySelector(".stage-desc").textContent = mem.desc;
    stageContent.querySelector(".stage-meta").textContent = mem.date;

    document.documentElement.style.setProperty(
      "--theme-accent",
      mem.theme.accent,
    );

    audioMgr.play(mem.audio, mem.title);

    const oldImgs = stageBg.querySelectorAll("img");
    oldImgs.forEach((img) => img.remove());

    const newImg = document.createElement("img");
    newImg.src = mem.img;
    newImg.onload = () => {
      stageBg.appendChild(newImg);
      setTimeout(() => newImg.classList.add("active"), 50);
    };

    stageContent.classList.remove("animate-in");
    setTimeout(() => stageContent.classList.add("animate-in"), 50);
  }

  function openFullscreen(mem) {
    isFullscreen = true;
    fullscreenOverlay.classList.add("active");

    fullscreenOverlay.querySelector(".fs-title").textContent = mem.title;
    fullscreenOverlay.querySelector(".fs-desc").textContent = mem.desc;

    polaroidGrid.innerHTML = "";

    // Slight delay to ensure dimensions are available
    setTimeout(() => {
      const containerWidth = polaroidGrid.clientWidth || window.innerWidth;
      const containerHeight = polaroidGrid.clientHeight || window.innerHeight;

      // GLOBAL Z-INDEX for this session
      let globalZIndex = 1000;

      // Helper to update grid height based on content
      const updateGridHeight = () => {
        let maxBottom = 0;
        const cards = polaroidGrid.querySelectorAll(".fs-polaroid");
        cards.forEach((card) => {
          const top = parseFloat(card.style.top || 0);
          const height = card.offsetHeight || 300; // Fallback
          if (top + height > maxBottom) {
            maxBottom = top + height;
          }
        });
        // Add some padding at the bottom.
        // We do NOT force it to containerHeight here, because CSS min-height handles the visual fill.
        // If we force it to window.innerHeight, it + padding causes scroll.
        polaroidGrid.style.height = `${maxBottom + 100}px`;
      };

      // 1. RENDER IMMEDIATELY (Optimistic)
      // This ensures the user sees photos even if Firebase isn't connected yet.
      const savedLayout =
        JSON.parse(localStorage.getItem(`layout_${mem.id}`)) || {};

      mem.polaroids.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "fs-polaroid";
        polaroidGrid.appendChild(card); // Add to DOM immediately

        let posX, posY, rotation;

        // Initialize with clamp to "rescue" lost photos
        if (savedLayout[i]) {
          posX = savedLayout[i].x;
          posY = savedLayout[i].y;
          // CLAMP: Ensure it's within generic bounds (0 to max width)
          // We use a safe estimate since containerWidth might vary
          posX = Math.max(0, Math.min(posX, containerWidth - 150));
          posY = Math.max(0, posY);

          rotation = savedLayout[i].rot;
          card.style.animation = "none";
          card.style.opacity = "1";
        } else {
          rotation = Math.random() * 20 - 10;
          // SPREAD VERTICALLY: Stagger them down the page
          const cols = window.innerWidth > 800 ? 3 : 2;
          const colWidth = containerWidth / cols;
          const colIndex = i % cols;
          const rowIndex = Math.floor(i / cols);

          // Add some randomness to the grid positions
          posX = colIndex * colWidth + Math.random() * (colWidth - 200);
          posY = rowIndex * 250 + Math.random() * 100;

          // Ensure positive coordinates
          posX = Math.max(20, posX);
          posY = Math.max(20, posY);

          card.style.animationDelay = `${i * 0.1}s`;
        }

        card.style.left = `${posX}px`;
        card.style.top = `${posY}px`;
        card.style.setProperty("--rotation", `${rotation}deg`);

        card.innerHTML = `
             <div class="pin" style="display:none;"></div>
             <img src="${p.img}" alt="Mem" draggable="false">
             <p class="fs-caption">${p.caption}</p>
          `;

        setupDragEvents(card, i);
      });

      // Update height after initial placement
      setTimeout(updateGridHeight, 100);

      // 2. CONNECT FIREBASE (Sync)
      // This will override positions when the server responds
      const memoryRef = ref(db, `layouts/${mem.id}`);

      onValue(
        memoryRef,
        (snapshot) => {
          const remoteLayout = snapshot.val();
          if (!remoteLayout) return; // If DB is empty, keep local/random positions

          const currentWidth = polaroidGrid.clientWidth || window.innerWidth;

          mem.polaroids.forEach((p, i) => {
            const card = polaroidGrid.children[i];
            if (!card) return;

            if (remoteLayout[i]) {
              // Only update if not currently being dragged by THIS user
              if (!card.classList.contains("dragging")) {
                let rX = remoteLayout[i].x;
                let rY = remoteLayout[i].y;

                // Safety Clamp for remote data too
                rX = Math.max(0, Math.min(rX, currentWidth - 50));
                rY = Math.max(0, rY);

                card.style.left = `${rX}px`;
                card.style.top = `${rY}px`;
                card.style.setProperty(
                  "--rotation",
                  `${remoteLayout[i].rot}deg`,
                );
              }
            }
          });
          // Update height after sync
          setTimeout(updateGridHeight, 100);
        },
        (error) => {
          console.error("Firebase Read Error:", error);
        },
      );

      // Drag Event Helper
      function setupDragEvents(card, index) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
          // Prevent drag if clicking on text or inputs if any (optional safety)
          if (e.target.tagName === "INPUT") return;

          isDragging = true;
          card.classList.add("dragging");
          card.style.transition = "none";

          globalZIndex++;
          card.style.zIndex = globalZIndex;

          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;

          startX = clientX;
          startY = clientY;

          initialLeft = card.offsetLeft;
          initialTop = card.offsetTop;

          e.preventDefault();
        };

        const doDrag = (e) => {
          if (!isDragging) return;

          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;

          const dx = clientX - startX;
          const dy = clientY - startY;

          let newLeft = initialLeft + dx;
          let newTop = initialTop + dy;

          // BOUNDARY CHECKS
          const containerW = polaroidGrid.clientWidth;
          const cardW = card.offsetWidth;

          // Prevent going off left or right edge
          if (newLeft < 0) newLeft = 0;
          if (newLeft > containerW - cardW) newLeft = containerW - cardW;

          // Prevent going above top edge
          if (newTop < 0) newTop = 0;

          card.style.left = `${newLeft}px`;
          card.style.top = `${newTop}px`;
        };

        const stopDrag = () => {
          if (!isDragging) return;
          isDragging = false;
          card.classList.remove("dragging");
          card.style.transition = "box-shadow 0.3s ease, transform 0.3s ease";

          // Expand grid if moved to bottom
          updateGridHeight();

          // 3. SAVE TO BOTH (Local + Cloud)
          // Save locally for instant load next time
          const currentLayout =
            JSON.parse(localStorage.getItem(`layout_${mem.id}`)) || {};
          currentLayout[index] = {
            x: parseFloat(card.style.left),
            y: parseFloat(card.style.top),
            rot: parseFloat(card.style.getPropertyValue("--rotation")),
          };
          localStorage.setItem(
            `layout_${mem.id}`,
            JSON.stringify(currentLayout),
          );

          // Save to Cloud
          set(
            ref(db, `layouts/${mem.id}/${index}`),
            currentLayout[index],
          ).catch((e) => console.error("Firebase Write Error:", e));
        };

        card.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);

        card.addEventListener("touchstart", startDrag, { passive: false });
        document.addEventListener("touchmove", doDrag, { passive: false });
        document.addEventListener("touchend", stopDrag);
      }
    }, 100);
  }

  document.getElementById("closeFsBtn").addEventListener("click", () => {
    isFullscreen = false;
    fullscreenOverlay.classList.remove("active");
  });

  // Mobile Swipe Navigation
  if (window.innerWidth <= 430) {
    let currentIndex = 0;
    const mobileNav = document.getElementById("mobileNav");
    const progressDots = document.getElementById("progressDots");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Create progress dots
    memories.forEach((mem, index) => {
      const dot = document.createElement("div");
      dot.className = "progress-dot";
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = index;
        navigateToMemory(index);
      });
      progressDots.appendChild(dot);
    });

    // Swipe on entire body (not just rightPanel)
    const hammer = new Hammer(document.body);

    hammer.on("swipeleft", () => {
      if (currentIndex < memories.length - 1) {
        currentIndex++;
        navigateToMemory(currentIndex);
      }
    });

    hammer.on("swiperight", () => {
      if (currentIndex > 0) {
        currentIndex--;
        navigateToMemory(currentIndex);
      }
    });

    // Arrow button clicks
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        navigateToMemory(currentIndex);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < memories.length - 1) {
        currentIndex++;
        navigateToMemory(currentIndex);
      }
    });

    function navigateToMemory(index) {
      const mem = memories[index];

      // Update film strip active state
      document.querySelectorAll(".film-item").forEach((item, i) => {
        if (i === index) {
          item.classList.add("active");
          item.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        } else {
          item.classList.remove("active");
        }
      });

      // Update progress dots
      document.querySelectorAll(".progress-dot").forEach((dot, i) => {
        if (i === index) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });

      // Update arrow button states
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === memories.length - 1;

      // Update content
      previewMemory(mem, true);
      activeMemoryId = mem.id;

      // Auto-play audio on mobile
      if (!audioMgr.isPlaying) {
        audioMgr.resume();
      }
    }

    // Make carousel items clickable on mobile
    document.querySelectorAll(".film-item").forEach((item, index) => {
      item.addEventListener("click", () => {
        currentIndex = index;
        navigateToMemory(index);
      });
    });

    // Initialize button states
    prevBtn.disabled = true;
    nextBtn.disabled = memories.length <= 1;
  }
});
