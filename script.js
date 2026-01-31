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
            { img: "https://placehold.co/400x400/8a4b4b/fff?text=Fun", caption: "हावाको स्पर्श" },
            { img: "https://placehold.co/400x500/6a3b3b/fff?text=Map", caption: "नयाँ बाटो" },
            { img: "https://placehold.co/400x400/8a4b4b/fff?text=Us", caption: "हामी" }
        ]
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
            { img: "https://placehold.co/400x450/8d6e63/fff?text=Latte", caption: "मन पर्ने कफी" },
            { img: "https://placehold.co/400x400/5d4037/fff?text=Laugh", caption: "तिम्रो हाँसो" }
        ]
    },
    {
        id: "summer",
        title: "गर्मी बिदा (Summer)",
        date: "July 2026",
        desc: "घामको किरण र तिम्रो साथ। सुनौलो दिनहरू।",
        img: "https://placehold.co/1200x800/fbc02d/fff?text=Summer",
        theme: { accent: "#fbc02d" },
        audio: "assets/audio_summer.mp3",
        polaroids: [
            { img: "https://placehold.co/400x400/fbc02d/fff?text=Beach", caption: "रमाइलो" },
            { img: "https://placehold.co/400x500/f57f17/fff?text=Icecream", caption: "मिठो याद" },
            { img: "https://placehold.co/400x400/fbc02d/fff?text=Sunset", caption: "साँझपख" }
        ]
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
            { img: "https://placehold.co/400x400/607d8b/fff?text=Book", caption: "किताब र तिमी" },
            { img: "https://placehold.co/400x500/455a64/fff?text=Rain", caption: "पानी पर्दा" }
        ]
    },
    {
        id: "music",
        title: "संगीत (Concert)",
        date: "Oct 2026",
        desc: "धूनमा हराएको त्यो साँझ।",
        img: "https://placehold.co/1200x800/9c27b0/fff?text=Music",
        theme: { accent: "#ba68c8" },
        audio: "assets/audio_music.mp3",
        polaroids: [
            { img: "https://placehold.co/400x400/9c27b0/fff?text=Guitar", caption: "गीत" },
            { img: "https://placehold.co/400x500/7b1fa2/fff?text=Crowd", caption: "रमाइलो भीड" }
        ]
    }
];

class AudioManager {
    constructor() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.currentSrc = '';
        this.isPlaying = false;
        this.fadeInterval = null;
        this.volume = 0.02; // Changed to 2%
        this.audio.volume = 0; // Start silent

        this.playBtn = document.getElementById('playBtn');
        this.volSlider = document.getElementById('volumeSlider');

        this.setupControls();
    }

    setupControls() {
        this.playBtn.addEventListener('click', () => {
            if (this.isPlaying) this.pause(); else this.resume();
        });
        this.volSlider.addEventListener('input', (e) => {
            this.volume = e.target.value;
            if (this.isPlaying) this.audio.volume = this.volume;
        });
    }

    play(src, trackName) {
        if (src === this.currentSrc) return;

        // Fade out current track
        const fadeOutInterval = setInterval(() => {
            if (this.audio.volume > 0.05) {
                this.audio.volume -= 0.1;
            } else {
                clearInterval(fadeOutInterval);
                this.audio.pause();
                
                // Switch to new track
                this.audio.src = src;
                this.currentSrc = src;
                this.audio.volume = 0;
                
                if (this.isPlaying) {
                    this.audio.play().catch(e => console.log("Autoplay blocked"));
                    this.fadeIn();
                }
            }
        }, 30); // 30ms for smooth fade
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
        // Stop any fade outs
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

document.addEventListener('DOMContentLoaded', () => {
    const audioMgr = new AudioManager();
    const filmTrack = document.getElementById('filmTrack');
    const stageBg = document.getElementById('stageBg');
    const stageContent = document.getElementById('stageContent');
    const rightPanel = document.getElementById('rightPanel');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const polaroidGrid = document.getElementById('polaroidGrid');

    const trackNameEl = document.querySelector('.track-name');

    let activeMemoryId = memories[0].id;
    let isFullscreen = false;

    // Autoplay Policy Handling (Passive Unlock)
    // Browsers block audio until interaction. We catch the first click anywhere to unlock AND start playing.
    document.addEventListener('click', () => {
        if (audioMgr.audio.context && audioMgr.audio.context.state === 'suspended') {
            audioMgr.audio.context.resume();
        }

        // Auto-start on first click (because user requested "it should play when I hover")
        // We assume the first click (even on body) signals intent to engage.
        if (!audioMgr.isPlaying) {
            audioMgr.isPlaying = true;
            audioMgr.playBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                </svg>
            `;
            // Start playing whatever was queued (likely the first track)
            audioMgr.audio.play().catch(e => console.log("Autoplay blocked"));
            audioMgr.fadeIn();
        }
    }, { once: true });


    // 1. Render Left Panel
    memories.forEach((mem, index) => {
        const item = document.createElement('div');
        item.className = 'film-item';
        if (index === 0) item.classList.add('active');
        item.dataset.id = mem.id;
        item.innerHTML = `
            <div class="film-frame"><img src="${mem.img}" alt="Thumb"></div>
            <div class="film-meta">
                <span class="playing-dot"></span>
                <span>${mem.id}</span>
            </div>
        `;

        // HOVER
        item.addEventListener('mouseenter', () => {
            if (!isFullscreen) {
                previewMemory(mem, false);
            }
        });

        // CLICK
        item.addEventListener('click', () => {
            activeMemoryId = mem.id;
            // Update Active UI
            document.querySelectorAll('.film-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Lock content
            previewMemory(mem, true);

            // Expand to Fullscreen
            openFullscreen(mem);
        });

        filmTrack.appendChild(item);
    });

    // Initial View
    previewMemory(memories[0], true);

    function previewMemory(mem, isLock) {
        // Update Stage Text
        stageContent.querySelector('.stage-title').textContent = mem.title;
        stageContent.querySelector('.stage-desc').textContent = mem.desc;
        stageContent.querySelector('.stage-meta').textContent = mem.date;

        // Update Theme
        document.documentElement.style.setProperty('--theme-accent', mem.theme.accent);

        // Audio Switch
        audioMgr.play(mem.audio, mem.title);

        // Update Image - Clear old images first to prevent lag
        const oldImgs = stageBg.querySelectorAll('img');
        oldImgs.forEach(img => img.remove());

        const newImg = document.createElement('img');
        newImg.src = mem.img;
        newImg.onload = () => {
            stageBg.appendChild(newImg);
            setTimeout(() => newImg.classList.add('active'), 50);
        };

        // Text Animation Logic
        stageContent.classList.remove('animate-in');
        setTimeout(() => stageContent.classList.add('animate-in'), 50);
    }

    function openFullscreen(mem) {
        isFullscreen = true;
        fullscreenOverlay.classList.add('active');

        // Populate Fullscreen
        fullscreenOverlay.querySelector('.fs-title').textContent = mem.title;
        fullscreenOverlay.querySelector('.fs-desc').textContent = mem.desc;

        // Generate Polaroids
        polaroidGrid.innerHTML = '';
        mem.polaroids.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'fs-polaroid';
            card.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
            card.style.animationDelay = `${i * 0.1}s`;
            card.innerHTML = `
                <img src="${p.img}" alt="Mem">
                <p class="fs-caption">${p.caption}</p>
            `;
            polaroidGrid.appendChild(card);
        });
    }

    document.getElementById('closeFsBtn').addEventListener('click', () => {
        isFullscreen = false;
        fullscreenOverlay.classList.remove('active');
    });
});