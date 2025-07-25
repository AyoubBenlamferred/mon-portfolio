// Canvas réseau optimisé QHD avec explosions
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let explosions = [];
  let width, height;
  let resizeTimeout;

  // Initialisation adaptée (sans factor d’échelle devicePixelRatio)
  function initCanvas() {
    width = window.innerWidth;
    height = window.innerWidth <= 480 ? 120 : 180;

    // Dimensions canvas sans multiplication par dpr
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Réinitialiser toute transformation du contexte
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Réinitialisation des noeuds
    nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: 1 + Math.random() * 1.5,
    }));
  }

  // Gestion du redimensionnement optimisé
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initCanvas();
      // Réajuste les explosions en cours
      explosions.forEach(exp => {
        exp.x = Math.min(exp.x, width);
        exp.y = Math.min(exp.y, height);
      });
    }, 200);
  });

  // Classes améliorées avec effets cyberpunk
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2 + Math.random() * 3;
      this.vx = (Math.random() - 0.5) * 6;
      this.vy = (Math.random() - 0.5) * 6;
      this.alpha = 1;
      this.life = 40 + Math.random() * 40;
      this.color = `hsla(${180 + Math.random() * 30}, 100%, 70%, ${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 1 / this.life;
      this.radius *= 0.97;
      this.color = `hsla(${180 + Math.random() * 30}, 100%, 70%, ${this.alpha})`;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15 * (this.alpha * 2);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Ring {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 60 + Math.random() * 40;
      this.lineWidth = 2;
      this.alpha = 1;
      this.growthSpeed = 3 + Math.random() * 3;
    }
    update() {
      this.radius += this.growthSpeed;
      this.alpha -= 0.015;
      this.lineWidth = Math.max(0.5, this.lineWidth * 0.98);
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha * 0.7;
      ctx.strokeStyle = '#00ffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 25 * this.alpha;
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Interaction améliorée (calcul simple du clic)
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closestNode = nodes.reduce((closest, node) => {
      const d = Math.hypot(node.x - mouseX, node.y - mouseY);
      return d < 25 && d < (closest.d || Infinity) ? { node, d } : closest;
    }, {}).node;

    if (closestNode) {
      explosions.push({
        x: closestNode.x,
        y: closestNode.y,
        rings: [new Ring(closestNode.x, closestNode.y)],
        particles: Array.from({ length: 30 }, () => new Particle(closestNode.x, closestNode.y)),
        createdAt: Date.now()
      });
    }
  });

  // Animation principale avec optimisations
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arrière-plan dynamique
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    gradient.addColorStop(0, '#001a2a');
    gradient.addColorStop(1, '#000913');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Mise à jour des noeuds
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    // Connexions entre noeuds
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const alpha = 1 - dist / 150;
          ctx.strokeStyle = `hsla(180, 100%, 70%, ${alpha * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Dessin des noeuds
    nodes.forEach(n => {
      ctx.save();
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Gestion des explosions
    explosions.forEach((exp) => {
      // Ajout d'un nouvel anneau toutes les 200ms (max 3)
      if (Date.now() - exp.createdAt > exp.rings.length * 200 && exp.rings.length < 3) {
        exp.rings.push(new Ring(exp.x, exp.y));
      }

      exp.rings.forEach(r => {
        r.update();
        r.draw(ctx);
      });

      exp.particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      exp.particles = exp.particles.filter(p => p.alpha > 0.05);
    });

    explosions = explosions.filter(exp =>
      exp.particles.length > 0 || exp.rings.some(r => r.alpha > 0)
    );

    requestAnimationFrame(animate);
  }

  // Initialisation et animation
  initCanvas();
  animate();
});

// Menu hamburger (inchangé)
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
  });
}

// Animation scroll optimisée (inchangée)
function checkSections() {
  const triggerBottom = window.innerHeight * 0.85;
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    section.classList.toggle('visible', sectionTop < triggerBottom);
  });
}

window.addEventListener('scroll', checkSections);
window.addEventListener('load', checkSections);
checkSections();
