// Initialize AOS with more sophisticated settings
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: false,
    mirror: true,
    offset: 100
});

// Theme Toggle with Local Storage
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
if (savedTheme === 'light') {
    html.classList.add('light-theme');
    updateThemeIcon('light');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('light-theme');
    const theme = html.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
    cursorFollower.style.transform = 'scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursorFollower.style.transform = 'scale(1)';
});

// Enhanced Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Advanced Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
let navbarTimeout;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Clear any existing timeout
    clearTimeout(navbarTimeout);
    
    // Hide navbar when scrolling down
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    // Set timeout to prevent rapid changes
    navbarTimeout = setTimeout(() => {
        lastScroll = currentScroll;
    }, 100);
});

// Parallax Effect for Hero Section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    hero.style.backgroundPositionY = scroll * 0.5 + 'px';
});

// Image Hover Effect
const profileImage = document.querySelector('.profile-image');
const imageGlow = document.querySelector('.image-glow');

profileImage.addEventListener('mousemove', (e) => {
    const rect = profileImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    imageGlow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--accent-color) 0%, transparent 70%)`;
});

// Card Hover Effects
document.querySelectorAll('.service-card, .experience-card, .product-card, .review-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Scroll Indicator
const scrollIndicator = document.querySelector('.hero-scroll-indicator');
let lastScrollTop = 0;
let indicatorTimeout;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear any existing timeout
    clearTimeout(indicatorTimeout);
    
    // Hide indicator when scrolling down
    if (scrollTop > lastScrollTop) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transform = 'translateY(20px)';
    } else {
        // Show indicator when scrolling up
        scrollIndicator.style.opacity = '0.7';
        scrollIndicator.style.transform = 'translateY(0)';
    }
    
    // Hide indicator after scrolling stops
    indicatorTimeout = setTimeout(() => {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transform = 'translateY(20px)';
    }, 2000);
    
    lastScrollTop = scrollTop;
});

// Add click handler to scroll indicator
scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const headerOffset = 70;
        const elementPosition = aboutSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Mobile Menu Toggle
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'mobile-menu-toggle';
mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.nav-right').prepend(mobileMenuButton);

const navLinks = document.querySelector('.nav-links');

mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuButton.classList.toggle('active');
});

// Music Player with Visualizer
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicStatus = document.querySelector('.music-status');
const volumeSlider = document.getElementById('volumeSlider');
const visualizerBars = document.querySelectorAll('.music-visualizer .bar');

// Initialize audio context
let audioContext;
let analyser;
let dataArray;
let animationFrameId;

function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(bgMusic);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 32;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function updateVisualizer() {
    if (!analyser) return;
    
    analyser.getByteFrequencyData(dataArray);
    const barValues = Array.from(dataArray).slice(0, 5);
    
    visualizerBars.forEach((bar, index) => {
        const value = barValues[index] / 255;
        bar.style.transform = `scaleY(${0.3 + value * 0.7})`;
        bar.style.opacity = 0.6 + value * 0.4;
    });
    
    animationFrameId = requestAnimationFrame(updateVisualizer);
}

// Start music automatically
function startMusic() {
    if (!audioContext) {
        initAudioContext();
    }
    bgMusic.play()
        .then(() => {
            audioContext.resume();
            musicStatus.textContent = 'Music: On';
            musicToggle.classList.add('playing');
            updateVisualizer();
            localStorage.setItem('musicPlaying', 'true');
        })
        .catch(error => {
            console.error('Error playing music:', error);
            musicToggle.addEventListener('click', () => {
                startMusic();
            }, { once: true });
        });
}

// Toggle music play/pause
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        startMusic();
    } else {
        bgMusic.pause();
        musicStatus.textContent = 'Music: Off';
        musicToggle.classList.remove('playing');
        cancelAnimationFrame(animationFrameId);
        localStorage.setItem('musicPlaying', 'false');
    }
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    bgMusic.volume = volume / 100;
    localStorage.setItem('musicVolume', volume);
});

// Start music on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedVolume = localStorage.getItem('musicVolume') || 50;
    bgMusic.volume = savedVolume / 100;
    volumeSlider.value = savedVolume;
    
    if (localStorage.getItem('musicPlaying') === 'true') {
        startMusic();
    }
});

// Pause music when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        bgMusic.pause();
        musicStatus.textContent = 'Music: Off';
        musicToggle.classList.remove('playing');
        cancelAnimationFrame(animationFrameId);
    } else if (localStorage.getItem('musicPlaying') === 'true') {
        startMusic();
    }
});

// Scroll Animation
const sections = document.querySelectorAll('section');

function checkScroll() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });
}

// Initial check
checkScroll();

// Check on scroll
window.addEventListener('scroll', checkScroll);

// Typing Animation
window.onload = function() {
    const text = "Professional Minecraft Developer";
    const typingText = document.querySelector('.typing-text');
    
    if (typingText) {
        typingText.textContent = ''; // Clear any existing text
        let index = 0;
        
        function writeText() {
            if (index < text.length) {
                typingText.textContent += text[index];
                index++;
                setTimeout(writeText, 150); // Adjust speed here (higher number = slower)
            }
        }
        
        writeText();
    }
}; 