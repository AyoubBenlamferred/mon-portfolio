console.log("Script chargé !");


// Canvas réseau (initialisation, animation, explosions)
canvas = document.getElementById('networkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, nodes;
  let explosions = [];
  let resizeTimeout;

  function initCanvas() {
    width = window.innerWidth;
    height = window.innerWidth <= 480 ? 120 : 180;
    canvas.width = width;
    canvas.height = height;

    nodes = [];
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: 1 + Math.random() * 1,
      });
    }
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initCanvas, 150);
  });

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y); // plus performant et clair
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2 + Math.random() * 2;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.alpha = 1;
      this.life = 30 + Math.random() * 30;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 1 / this.life;
      this.radius *= 0.95;
    }
    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#00ffff';
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
      this.maxRadius = 50 + Math.random() * 30;
      this.lineWidth = 3;
      this.alpha = 1;
      this.growthSpeed = 2 + Math.random() * 2;
    }
    update() {
      this.radius += this.growthSpeed;
      this.alpha -= 0.02;
    }
    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = '#00ffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closestNode = null;
    let minDist = 15;
    for (const n of nodes) {
      const d = dist({ x: mouseX, y: mouseY }, n);
      if (d < minDist) {
        minDist = d;
        closestNode = n;
      }
    }

    if (closestNode) {
      explosions.push({
        x: closestNode.x,
        y: closestNode.y,
        rings: [new Ring(closestNode.x, closestNode.y)],
        particles: Array.from({ length: 25 }, () => new Particle(closestNode.x, closestNode.y)),
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Mise à jour des noeuds
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    // Dessin des lignes entre noeuds proches
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = dist(nodes[i], nodes[j]);
        if (d < 120) {
          const alpha = 1 - d / 120;
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.2})`;
          ctx.lineWidth = 1;
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
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Animation des explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
      const exp = explosions[i];

      exp.rings.forEach(r => {
        r.update();
        r.draw(ctx);
      });

      // Ajouter un nouvel anneau si besoin
      if (exp.rings.length < 4 && exp.rings[exp.rings.length - 1].radius > 20) {
        exp.rings.push(new Ring(exp.x, exp.y));
      }

      exp.particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      exp.particles = exp.particles.filter(p => p.alpha > 0.01);

      if (exp.particles.length === 0 && exp.rings.every(r => r.alpha <= 0)) {
        explosions.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  initCanvas();
  animate();
}

// Animation sections au scroll
const sections = document.querySelectorAll('section');

function checkSections() {
  const triggerBottom = window.innerHeight * 0.85;
  // Supprime les logs une fois testé
  // console.log('checkSections called, triggerBottom:', triggerBottom);

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    // console.log(section.id, 'top:', sectionTop);

    if (sectionTop < triggerBottom) {
      if (!section.classList.contains('visible')) {
        section.classList.add('visible');
        // console.log(section.id, 'added visible');
      }
    } else {
      if (section.classList.contains('visible')) {
        section.classList.remove('visible');
        // console.log(section.id, 'removed visible');
      }
    }
  });
}


window.addEventListener('scroll', checkSections);
window.addEventListener('load', checkSections);
checkSections();

