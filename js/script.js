// ==================== CANVAS RÉSEAU OPTIMISÉ ====================
const networkCanvas = document.getElementById('networkCanvas');
if (networkCanvas) {
  const ctx = networkCanvas.getContext('2d');
  let width, height, nodes = [], explosions = [];
  let animationId = null;
  let isMobile = window.innerWidth <= 768;

  const config = {
    nodeCount: isMobile ? 30 : 60,
    maxConnections: isMobile ? 80 : 120,
    canvasHeight: isMobile ? 120 : 180,
    particleCount: isMobile ? 15 : 25
  };

  function initCanvas() {
    width = window.innerWidth;
    height = config.canvasHeight;
    networkCanvas.width = width;
    networkCanvas.height = height;

    nodes = Array.from({ length: config.nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.0),
      vy: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.0),
      radius: 1 + Math.random() * 1
    }));
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (rect.top <= window.innerHeight) && (rect.bottom >= 0);
  }

  // ... (les classes Particle et Ring restent identiques) ...

  function animate() {
    if (document.hidden || !isElementInViewport(networkCanvas)) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    // ... reste du code animate() inchangé ...
  }

  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      isMobile = window.innerWidth <= 768;
      config.nodeCount = isMobile ? 30 : 60;
      config.maxConnections = isMobile ? 80 : 120;
      config.canvasHeight = isMobile ? 120 : 180;
      
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      initCanvas();
      if (!document.hidden) {
        animationId = requestAnimationFrame(animate);
      }
    }, 100);
  }

  // Événements
  networkCanvas.addEventListener('click', handleCanvasClick);
  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !animationId) {
      initCanvas();
      animationId = requestAnimationFrame(animate);
    }
  });

  // Démarrer
  initCanvas();
  if (!document.hidden) {
    animationId = requestAnimationFrame(animate);
  }
}

// ==================== MENU HAMBURGER AMÉLIORÉ ====================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  // Accessibilité améliorée
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Menu');

  function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('visible');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  }

  navToggle.addEventListener('click', toggleMenu);

  // Fermer le menu au clic sur un lien
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('visible')) {
        toggleMenu();
      }
    });
  });

  // Fermer le menu en cliquant à l'extérieur
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('visible') && 
        !navMenu.contains(e.target) && 
        e.target !== navToggle) {
      toggleMenu();
    }
  });
}

// ==================== ANIMATIONS SCROLL OPTIMISÉES ====================
const sections = document.querySelectorAll('section');
let isScrolling = false;

function checkSections() {
  if (isScrolling) return;
  isScrolling = true;

  const triggerBottom = window.innerHeight * 0.75;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    section.classList.toggle('visible', sectionTop < triggerBottom);
  });

  isScrolling = false;
}

// Utilisation de requestAnimationFrame pour le scroll
function throttleScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(checkSections);
    isScrolling = true;
  }
}

window.addEventListener('scroll', throttleScroll);
window.addEventListener('load', checkSections);
window.addEventListener('resize', checkSections);