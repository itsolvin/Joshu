import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
    audio: "assets/Trip.mp3",
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
    audio: "assets/datess.mp3",
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
    audio: "assets/Lifetogether.mp3",
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
    audio: "assets/Quite.mp3",
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
    audio: "assets/Food.mp3",
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

    // Clear any pending fades
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    this.fadeInterval = setInterval(() => {
      // Safe fade out
      if (this.audio.volume > 0.05) {
        this.audio.volume = Math.max(0, this.audio.volume - 0.1);
      } else {
        clearInterval(this.fadeInterval);
        this.audio.pause();

        this.audio.src = src;
        this.currentSrc = src;
        this.audio.volume = 0;

        if (this.isPlaying) {
          this.audio.play().catch((e) => console.log("Autoplay blocked"));
          this.fadeIn();
        }
      }
    }, 50);
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
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    this.fadeInterval = setInterval(() => {
      // Targeted volume is `this.volume` (master volume)
      if (this.audio.volume < this.volume - 0.05) {
        this.audio.volume = Math.min(this.volume, this.audio.volume + 0.05);
      } else {
        this.audio.volume = this.volume;
        clearInterval(this.fadeInterval);
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

  // --- DATA LOADING & RENDERING ---
  const INITIAL_MEMORIES = [...memories]; // Keep a copy of static data
  let allMemories = [...INITIAL_MEMORIES];

  // Function to render the Film Strip
  function renderFilmStrip() {
    filmTrack.innerHTML = ""; // Clear existing

    allMemories.forEach((mem, index) => {
      const item = document.createElement("div");
      item.className = "film-item";
      // Ensure the correct item is marked active based on current selection
      if (mem.id === activeMemoryId) item.classList.add("active");

      item.dataset.id = mem.id;
      item.innerHTML = `
            <div class="film-frame"><img src="${mem.img}" alt="Thumb"></div>
            <div class="film-meta">
                <span class="playing-dot" style="background: ${mem.theme.accent}; box-shadow: 0 0 5px ${mem.theme.accent};"></span>
                <span>${mem.title}</span>
            </div>
            ${isAdmin ? `<button class="delete-mem-btn-strip" data-id="${mem.id}" title="Delete Memory">×</button>` : ""}
        `;

      // Handle Delete Click (must be attached before the item click to prevent bubbling issues if handled poorly)
      // But since we use innerHTML, we need to find the button after.
      if (isAdmin) {
        setTimeout(() => {
          const delBtn = item.querySelector(".delete-mem-btn-strip");
          if (delBtn) {
            delBtn.addEventListener("click", async (e) => {
              e.stopPropagation(); // Prevent opening the memory
              const isConfirmed = await showConfirm(
                "Delete Memory?",
                `Delete "${mem.title}"? This cannot be undone.`,
              );
              if (isConfirmed) {
                deleteMemory(mem.id);
              }
            });
          }
        }, 0);
      }

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

      // Mobile click handled structurally below, but good to ensure consistent ID data
      filmTrack.appendChild(item);
    });

    // Re-bind mobile click if needed, or just rely on the global delegate/setup
    // For simplicity, we'll re-run the mobile setup if on mobile, or just let the global index logic work?
    // The mobile logic below uses `document.querySelectorAll(".film-item")` which needs to be re-run or use event delegation.
    // For now, let's keep it simple.
  }

  // Load from Firebase
  const memoriesRef = ref(db, "memories");
  onValue(memoriesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convert object to array
      const dynamicMemories = Object.values(data);
      // Merge: Static + Dynamic (avoid duplicates if we decide to save static to DB later)
      // For now, simple concatenation.
      allMemories = [...INITIAL_MEMORIES, ...dynamicMemories];
    } else {
      allMemories = [...INITIAL_MEMORIES];
    }

    // Update global memories reference if used elsewhere?
    // The rest of the code uses `memories` variable. We should update the `memories` array content or usage.
    // Javascript const arrays are mutable content-wise, but we can't reassign `memories`.
    // Better strategy: Change `const memories` at top to `let memories`?
    // Or just use `memories.length = 0; memories.push(...)`
    memories.length = 0;
    memories.push(...allMemories);

    renderFilmStrip();

    // Refresh preview if the active memory is still valid, else reset
    const currentMem =
      memories.find((m) => m.id === activeMemoryId) || memories[0];
    activeMemoryId = currentMem.id;
    previewMemory(currentMem, false); // Update UI
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

    // VISUAL UPDATE: Exclusive Playing Dot
    // We compare strictly by ID to ensure only ONE item has the dot
    document.querySelectorAll(".film-item").forEach((item) => {
      // Use String() to ensure safe comparison regardless of type
      if (String(item.dataset.id) === String(mem.id)) {
        item.classList.add("playing");
      } else {
        item.classList.remove("playing");
      }
    });

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

    // Show/Hide Add Polaroid Button based on Admin Status
    const polaroidBtn = document.getElementById("addPolaroidBtn");

    if (isAdmin) {
      polaroidBtn.style.display = "block";
      // Hide the main Add Button while in fullscreen to avoid clutter
      addPhotoBtn.style.display = "none";
    } else {
      polaroidBtn.style.display = "none";
    }

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

        const imgSrc = p.img || p.src || "";

        card.innerHTML = `
             <div class="pin" style="display:none;"></div>
             <img src="${imgSrc}" alt="Mem" draggable="false">
             <p class="fs-caption">${p.caption}</p>
          `;

        setupDragEvents(card, i);

        // Add Delete Button if Admin (Fix for initial load visibility)
        if (isAdmin) {
          const delBtn = document.createElement("div");
          delBtn.className = "delete-photo-btn";
          delBtn.innerHTML = "×";
          delBtn.title = "Delete Photo";
          delBtn.onclick = async (e) => {
            e.stopPropagation(); // Avoid triggering card click
            const isConfirmed = await showConfirm(
              "Delete Photo?",
              "Are you sure you want to delete this photo forever?",
            );
            if (isConfirmed) {
              deletePolaroid(mem.id, i);
            }
          };
          card.appendChild(delBtn);
        }
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

          // SYNC TO LOCALSTORAGE so subsequent renders (like adding photo) don't reset positions
          localStorage.setItem(
            `layout_${mem.id}`,
            JSON.stringify(remoteLayout),
          );

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
    // Bring back the main Add Button if we are admin
    if (isAdmin) {
      addPhotoBtn.style.display = "flex";
    }
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

  // --- ADMIN & UPLOAD LOGIC ---

  // 1. Cloudinary Upload
  async function uploadToCloudinary(file, resourceType = "image") {
    const CLOUD_NAME = "dvrfewksi";
    const UPLOAD_PRESET = "Joshuu"; // Ensure this is "Unsigned" in Cloudinary settings

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary Error Details:", errorData);
        throw new Error(errorData.error.message || "Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      showToast("Failed to upload media. Please try again.", "error"); // Use toast
      return null;
    }
  }

  // 2. Save Memory to Firebase
  // 2. Save Memory to Firebase
  async function saveMemoryToDB(memory, shouldReload = true) {
    try {
      await set(ref(db, "memories/" + memory.id), memory);
      console.log("Memory saved to DB!");
      if (shouldReload) {
        alert("Memory Uploaded Successfully! Page will reload.");
        location.reload();
      }
    } catch (error) {
      console.error("Error saving memory:", error);
      alert("Failed to save memory to database.");
    }
  }

  // --- ADMIN & UPLOAD LOGIC ---
  const authBtn = document.getElementById("authBtn");
  const addPhotoBtn = document.getElementById("addPhotoBtn");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.querySelector(".close-modal");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const adminEmail = document.getElementById("adminEmail");
  const adminPass = document.getElementById("adminPass");
  const photoUpload = document.getElementById("photoUpload");
  const addPolaroidBtn = document.getElementById("addPolaroidBtn");

  let isAdmin = false;
  let isAddingPolaroid = false;

  // --- AUTHENTICATION LOGIC ---
  const auth = getAuth(app);

  // 1. Auth State Listener (Manages UI automatically)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      isAdmin = true;
      authBtn.style.display = "none";
      addPhotoBtn.style.display = "flex";
      logoutBtn.style.display = "flex";

      // If currently in fullscreen, show the polaroid button AND RE-RENDER
      if (isFullscreen) {
        addPolaroidBtn.style.display = "block";
        const currentMem = memories.find((m) => m.id === activeMemoryId);
        if (currentMem) {
          openFullscreen(currentMem); // Re-render to show delete buttons
        }
      }
      renderFilmStrip(); // Re-render to show delete buttons on strip
    } else {
      // User is signed out
      isAdmin = false;
      authBtn.style.display = "flex";
      addPhotoBtn.style.display = "none";
      logoutBtn.style.display = "none";
      addPolaroidBtn.style.display = "none";

      // Re-render to hide delete buttons
      if (isFullscreen) {
        const currentMem = memories.find((m) => m.id === activeMemoryId);
        if (currentMem) openFullscreen(currentMem);
      }
      renderFilmStrip();
    }
  });

  // Show Modal
  authBtn.addEventListener("click", () => {
    loginModal.classList.add("active");
  });

  // Close Modal
  closeModal.addEventListener("click", () => {
    loginModal.classList.remove("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove("active");
    }
  });

  // 2. Login Action
  loginSubmitBtn.addEventListener("click", async () => {
    const email = adminEmail.value;
    const pass = adminPass.value;

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      loginModal.classList.remove("active");
      showToast("Welcome back! 💖", "success");
    } catch (error) {
      console.error("Login Failed:", error.code, error.message);
      showToast("Login failed. Check email/password.", "error");
    }
  });

  // 3. Logout Action
  const logoutBtn = document.getElementById("logoutBtn"); // Ensure this is selected if not already
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      showToast("Logged out successfully.", "success");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  });

  // --- TOAST NOTIFICATION SYSTEM ---
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // Icon based on type
    const icon = type === "success" ? "✨" : "⚠️";

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("hide");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, 3000);
  }

  // --- CREATE MEMORY MODAL LOGIC ---
  const createMemoryModal = document.getElementById("createMemoryModal");
  const closeCreateModal = document.getElementById("closeCreateModal");
  const createMemBtn = document.getElementById("createMemBtn");

  const newMemTitleInput = document.getElementById("newMemTitle");
  const newMemDateInput = document.getElementById("newMemDate");
  const newMemDescInput = document.getElementById("newMemDesc");
  const newMemAudioInput = document.getElementById("newMemAudio");
  const newMemColorInput = document.getElementById("newMemColor");
  const newMemAudioFileInput = document.getElementById("newMemAudioFile");

  // Temporary storage for new memory details
  let tempMemoryDetails = {};

  // Close Create Modal
  closeCreateModal.addEventListener("click", () => {
    createMemoryModal.classList.remove("active");
  });

  // Close on outside click
  window.addEventListener("click", (e) => {
    if (e.target === createMemoryModal) {
      createMemoryModal.classList.remove("active");
    }
  });

  // 4. Handle Add Photo Click (Main) -> Open Create Modal
  addPhotoBtn.addEventListener("click", () => {
    console.log("Add Memory Button Clicked!");
    isAddingPolaroid = false;

    // Clear inputs
    newMemTitleInput.value = "";
    newMemDateInput.value = "";
    newMemDescInput.value = "";
    newMemAudioInput.selectedIndex = 0;
    newMemColorInput.value = "#d13030"; // Reset color
    newMemAudioFileInput.value = ""; // Reset file

    // Reset UI Elements
    document
      .querySelectorAll(".color-option")
      .forEach((o) => o.classList.remove("selected"));
    document
      .querySelector('.color-option[data-value="#d13030"]')
      .classList.add("selected");
    document.getElementById("audioFileName").textContent = "No file chosen";

    // Show Modal
    createMemoryModal.classList.add("active");
    console.log("Modal active class added");
  });

  // --- NEW UI LISTENERS ---
  const colorOptions = document.querySelectorAll(".color-option");

  colorOptions.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      // If clicking the Custom Input (which matches .color-option), don't force select yet
      // let the input change handle it.
      if (opt.classList.contains("custom-trigger")) return;

      // Remove selected from all
      colorOptions.forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");

      const val = opt.getAttribute("data-value");
      if (val) {
        newMemColorInput.value = val;
      }
    });
  });

  // Handle Custom Color Input Change
  newMemColorInput.addEventListener("input", (e) => {
    const customTrigger = document.querySelector(
      ".color-option.custom-trigger",
    );
    customTrigger.style.background = e.target.value;

    // Select it
    colorOptions.forEach((o) => o.classList.remove("selected"));
    customTrigger.classList.add("selected");
  });

  // Handle File Input Change
  newMemAudioFileInput.addEventListener("change", (e) => {
    const fileName = e.target.files[0]
      ? "🎵 " + e.target.files[0].name
      : "No file chosen";
    document.getElementById("audioFileName").textContent = fileName;
  });

  // Handle "Select Photo & Create" Click inside Modal
  createMemBtn.addEventListener("click", () => {
    console.log("Create Memory Logic Triggered");
    // 1. Capture Data
    const title = newMemTitleInput.value || "New Memory";
    const date =
      newMemDateInput.value ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    const desc =
      newMemDescInput.value || "A beautiful moment captured in time.";
    const audio = newMemAudioInput.value;
    const themeColor = newMemColorInput.value;
    const audioFile = newMemAudioFileInput.files[0];

    // 2. Store in temp object
    tempMemoryDetails = { title, date, desc, audio, themeColor, audioFile };

    // 3. Trigger File Upload
    createMemoryModal.classList.remove("active"); // Hide modal
    photoUpload.click(); // Open system picker
  });

  // Handle Add Polaroid Click (Fullscreen)
  addPolaroidBtn.addEventListener("click", () => {
    isAddingPolaroid = true; // We are adding to EXISTING memory
    photoUpload.click();
  });

  // 5. Handle File Selection & Upload
  photoUpload.addEventListener("change", async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      let title = "";
      let caption = "";

      if (!isAddingPolaroid) {
        // Use Captured Data from Modal
        title = tempMemoryDetails.title || "New Memory";
      } else {
        // New Polaroid: Ask for Caption
        // caption = prompt("Enter Photo Caption (Optional):", "") || "";
        caption =
          (await showPrompt(
            "Photo Caption",
            "Enter a caption for this photo (optional):",
          )) || "";
      }

      // Show loading
      const originalBtnHTML = isAddingPolaroid
        ? addPolaroidBtn.innerHTML
        : addPhotoBtn.innerHTML;
      if (isAddingPolaroid) {
        addPolaroidBtn.innerText = "⏳";
        addPolaroidBtn.disabled = true;
      } else {
        addPhotoBtn.innerHTML = "⏳";
        addPhotoBtn.disabled = true;
      }

      const imageUrl = await uploadToCloudinary(file);

      if (imageUrl) {
        if (!isAddingPolaroid) {
          // --- SCENARIO A: CREATE NEW MEMORY (Enhanced) ---
          let finalAudioUrl =
            tempMemoryDetails.audio || "assets/audio/sparkle.mp3";

          // Check for custom audio upload
          if (tempMemoryDetails.audioFile) {
            showToast("Uploading custom audio... 🎵", "info");
            const uploadedAudio = await uploadToCloudinary(
              tempMemoryDetails.audioFile,
              "video",
            );
            if (uploadedAudio) {
              finalAudioUrl = uploadedAudio;
            } else {
              showToast("Audio upload failed. Using preset.", "error");
            }
          }

          const newMemory = {
            id: "mem_" + Date.now(),
            title: tempMemoryDetails.title || "New Memory", // Fallback
            date:
              tempMemoryDetails.date ||
              new Date().toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }),
            desc:
              tempMemoryDetails.desc || "A beautiful moment captured in time.",
            img: imageUrl,
            audio: finalAudioUrl,
            theme: { accent: tempMemoryDetails.themeColor || "#d13030" },
            polaroids: [],
          };
          await saveMemoryToDB(newMemory);
          showToast("New memory created successfully! ✨", "success");
        } else {
          // --- SCENARIO B: ADD PHOTO TO EXISTING MEMORY ---
          if (!activeMemoryId) return;
          const activeMem = memories.find((m) => m.id === activeMemoryId);
          if (activeMem) {
            if (!activeMem.polaroids) activeMem.polaroids = [];

            activeMem.polaroids.push({
              img: imageUrl, // UPDATED: Use 'img' to match renderer expectation
              caption: caption,
              angle: Math.random() * 6 - 3 + "deg", // Random tilt
            });

            // update in DOM immediately
            renderPolaroids(activeMem);

            // save whole memory object to DB (overwrites existing at that ID)
            await saveMemoryToDB(activeMem, false); // false = don't reload page

            addPolaroidBtn.innerText = "+ Add Photo";
            addPolaroidBtn.disabled = false;
            showToast("Photo added to album! 📸", "success");
          }
        }
      } else {
        // Failure Reset
        if (isAddingPolaroid) {
          addPolaroidBtn.innerHTML = originalBtnHTML;
          addPolaroidBtn.disabled = false;
        } else {
          addPhotoBtn.innerHTML = originalBtnHTML;
          addPhotoBtn.disabled = false;
        }
        showToast("Image upload failed.", "error");
      }

      // Clear input so same file can be selected again if needed
      photoUpload.value = "";
    }
  });

  // Helper to re-render polaroids (e.g. after adding one)
  function renderPolaroids(mem) {
    polaroidGrid.innerHTML = "";

    const containerWidth = polaroidGrid.clientWidth || window.innerWidth;
    const savedLayout =
      JSON.parse(localStorage.getItem(`layout_${mem.id}`)) || {};

    // Re-render ALL polaroids for this memory
    if (mem.polaroids) {
      mem.polaroids.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "fs-polaroid";
        polaroidGrid.appendChild(card);

        let posX, posY, rotation;

        if (savedLayout[i]) {
          posX = savedLayout[i].x;
          posY = savedLayout[i].y;
          // Clamp
          posX = Math.max(0, Math.min(posX, containerWidth - 150));
          posY = Math.max(0, posY);
          rotation = savedLayout[i].rot;
        } else {
          // Default random placement for new items specifically
          rotation = Math.random() * 20 - 10;
          const cols = window.innerWidth > 800 ? 3 : 2;
          const colWidth = containerWidth / cols;
          const colIndex = i % cols;
          const rowIndex = Math.floor(i / cols);

          posX = colIndex * colWidth + Math.random() * (colWidth - 200);
          posY = rowIndex * 250 + Math.random() * 100;

          posX = Math.max(20, posX);
          posY = Math.max(20, posY);
        }

        card.style.left = `${posX}px`;
        card.style.top = `${posY}px`;
        card.style.setProperty("--rotation", `${rotation}deg`);

        // Fallback just in case old data exists
        const imgSrc = p.img || p.src || "";

        card.innerHTML = `
                 <div class="pin" style="display:none;"></div>
                 <img src="${imgSrc}" alt="Mem" draggable="false">
                 <p class="fs-caption">${p.caption}</p>
            `;

        // Use Global Drag Helper
        setupGlobalDrag(card, mem.id, i);

        // Add Delete Button if Admin (Ensure this is in renderPolaroids)
        if (isAdmin) {
          const delBtn = document.createElement("div");
          delBtn.className = "delete-photo-btn";
          delBtn.innerHTML = "×";
          delBtn.title = "Delete Photo";
          delBtn.onclick = (e) => {
            e.stopPropagation();
            deletePolaroid(mem.id, i);
          };
          card.appendChild(delBtn);
        }
      });
    }
  }

  // --- DELETION LOGIC ---

  async function deleteMemory(memId) {
    try {
      await remove(ref(db, "memories/" + memId));
      // Remove layout as well
      await remove(ref(db, "layouts/" + memId));

      showToast("Memory deleted successfully.", "success");
      location.reload(); // Reload to refresh state
    } catch (error) {
      console.error("Error deleting memory:", error);
      showToast("Failed to delete memory.", "error");
    }
  }

  async function deletePolaroid(memId, index) {
    const isConfirmed = await showConfirm(
      "Delete Photo?",
      "Are you sure you want to delete this photo forever?",
    );
    if (!isConfirmed) return;

    const mem = memories.find((m) => m.id === memId);
    if (!mem || !mem.polaroids) return;

    // Remove item at index
    mem.polaroids.splice(index, 1);

    // Save updated memory to DB
    try {
      // Verify we are updating the correct path
      await set(ref(db, `memories/${memId}/polaroids`), mem.polaroids);

      // Refresh UI
      // If we are in fullscreen, re-render
      if (isFullscreen && activeMemoryId === memId) {
        // Optimistic update for immediate feedback
        openFullscreen(mem);
        showToast("Photo deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      showToast("Failed to delete photo.", "error");
    }
  }

  // Global Drag Helper
  function setupGlobalDrag(card, memId, index) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let globalZIndex = 1000;

    const startDrag = (e) => {
      if (e.target.tagName === "INPUT") return;
      isDragging = true;
      card.classList.add("dragging");
      card.style.transition = "none";
      card.style.zIndex = 1001; // Bring to front

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
      card.style.left = `${initialLeft + dx}px`;
      card.style.top = `${initialTop + dy}px`;
      e.preventDefault();
    };

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove("dragging");
      card.style.transition =
        "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.27)";

      // Save New Position
      const currentLayout =
        JSON.parse(localStorage.getItem(`layout_${memId}`)) || {};
      currentLayout[index] = {
        x: card.offsetLeft,
        y: card.offsetTop,
        rot: 0, // Simplification
      };
      localStorage.setItem(`layout_${memId}`, JSON.stringify(currentLayout));

      // Sync to Firebase
      // We need to import 'set' and 'ref' if not in closure scopes,
      // but 'db' and 'set' and 'ref' are available in the wider DOMContentLoaded scope here.
      set(ref(db, `layouts/${memId}`), currentLayout);
    };

    card.addEventListener("mousedown", startDrag);
    card.addEventListener("touchstart", startDrag, { passive: false });
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("touchmove", doDrag, { passive: false });
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
  }

  // --- CUSTOM CONFIRMATION MODAL ---
  function showConfirm(title, message) {
    return new Promise((resolve) => {
      const modal = document.getElementById("confirmModal");
      const titleEl = document.getElementById("confirmTitle");
      const msgEl = document.getElementById("confirmMessage");
      const cancelBtn = document.getElementById("confirmCancelBtn");
      const okBtn = document.getElementById("confirmOkBtn");

      if (!modal) return resolve(false);

      titleEl.innerText = title;
      msgEl.innerText = message;
      modal.classList.add("active");

      // Handlers
      const cleanup = () => {
        cancelBtn.removeEventListener("click", onCancel);
        okBtn.removeEventListener("click", onOk);
        window.removeEventListener("click", onOutside);
      };

      const onCancel = () => {
        modal.classList.remove("active");
        cleanup();
        resolve(false);
      };

      const onOk = () => {
        modal.classList.remove("active");
        cleanup();
        resolve(true);
      };

      const onOutside = (e) => {
        if (e.target === modal) {
          onCancel();
        }
      };

      cancelBtn.addEventListener("click", onCancel);
      okBtn.addEventListener("click", onOk);
      window.addEventListener("click", onOutside);
    });
  }

  // --- CUSTOM PROMPT MODAL ---
  function showPrompt(title, message, defaultValue = "") {
    return new Promise((resolve) => {
      const modal = document.getElementById("promptModal");
      const titleEl = document.getElementById("promptTitle");
      const msgEl = document.getElementById("promptMessage");
      const inputEl = document.getElementById("promptInput");
      const cancelBtn = document.getElementById("promptCancelBtn");
      const okBtn = document.getElementById("promptOkBtn");

      if (!modal) return resolve(null);

      titleEl.innerText = title;
      if (message) {
        msgEl.innerText = message;
        msgEl.style.display = "block";
      } else {
        msgEl.style.display = "none";
      }
      inputEl.value = defaultValue;
      modal.classList.add("active");
      inputEl.focus();

      // Handlers
      const cleanup = () => {
        cancelBtn.removeEventListener("click", onCancel);
        okBtn.removeEventListener("click", onOk);
        window.removeEventListener("click", onOutside);
        inputEl.removeEventListener("keydown", onKey);
      };

      const onCancel = () => {
        modal.classList.remove("active");
        cleanup();
        resolve(null);
      };

      const onOk = () => {
        const val = inputEl.value;
        modal.classList.remove("active");
        cleanup();
        resolve(val);
      };

      const onOutside = (e) => {
        if (e.target === modal) {
          onCancel();
        }
      };

      const onKey = (e) => {
        if (e.key === "Enter") onOk();
        if (e.key === "Escape") onCancel();
      };

      cancelBtn.addEventListener("click", onCancel);
      okBtn.addEventListener("click", onOk);
      window.addEventListener("click", onOutside);
      inputEl.addEventListener("keydown", onKey);
    });
  }
});
