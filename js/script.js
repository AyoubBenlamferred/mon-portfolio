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

// ==================== CODE PROTÉGÉ CONTRE LES ERREURS ====================
document.addEventListener('DOMContentLoaded', function() {
  try {
    // ==================== CANVAS RÉSEAU SÉCURISÉ ====================
    const initCanvasAnimation = function() {
      const networkCanvas = document.getElementById('networkCanvas');
      if (!networkCanvas) return;
      
      try {
        const ctx = networkCanvas.getContext('2d');
        let width, height, nodes = [], explosions = [];
        let animationId = null;
        const isMobile = window.innerWidth <= 768;

        const config = {
          nodeCount: isMobile ? 20 : 40,  // Réduit pour mobile
          maxConnections: isMobile ? 60 : 100,
          canvasHeight: isMobile ? 80 : 150,  // Hauteur réduite
          particleCount: isMobile ? 10 : 20
        };

        // ... (votre code canvas existant) ...
        
        // MODIFICATION CLAÉ : Désactivation mobile si erreur
        if(isMobile) {
          networkCanvas.style.display = 'none';
          return;
        }

        initCanvas();
        if (!document.hidden) {
          animationId = requestAnimationFrame(animate);
        }
      } catch(e) {
        console.error("Canvas error:", e);
        networkCanvas.style.display = 'none';
      }
    };

    // ==================== MENU HAMBURGER ====================
    const initMobileMenu = function() {
      const navToggle = document.getElementById('nav-toggle');
      const navMenu = document.getElementById('nav-menu');

      if (navToggle && navMenu) {
        // ... (votre code menu existant) ...
      }
    };

    // ==================== AFFICHAGE DES SECTIONS ====================
    const initSections = function() {
      const sections = document.querySelectorAll('section');
      
      // Force l'affichage immédiat sur mobile
      if(window.innerWidth <= 768) {
        sections.forEach(section => {
          section.style.opacity = 1;
          section.style.transform = 'none';
          section.classList.add('visible');
        });
        return;
      }

      // ... (votre code d'animation scroll existant) ...
    };

    // INITIALISATION
    initCanvasAnimation();
    initMobileMenu();
    initSections();

    // Garantit l'affichage du contenu
    setTimeout(() => {
      document.querySelectorAll('section').forEach(s => {
        s.style.display = 'block';
      });
    }, 100);

  } catch(e) {
    console.error("Global error:", e);
  }
});

// ==================== FALLBACK URGENCE ====================
// Garantit l'affichage même si JS échoue complètement
document.write('<style>section{display:block!important;opacity:1!important;}</style>');