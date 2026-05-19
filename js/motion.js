// ZAKA 2026 - Cinematic Motion Engine

window.ZakaMotion = {
  init() {
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.isMobile = window.innerWidth <= 768;

    this.setupObservers();
    this.setupSmoothParallax();
    
    // Only enable heavy 3D tracking on desktop/non-touch
    if (!this.isTouchDevice) {
      this.setupCursorReactive();
    }
    
    this.setupAmbientParticles();
  },

  // 1. Intersection Observers for Cinematic Entry
  setupObservers() {
    const options = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);

    document.querySelectorAll('.fade-up, .fade-in, .blur-in').forEach(el => {
      el.classList.add('gpu-accel');
      observer.observe(el);
    });
  },

  // 2. Ultra-soft Lerped Parallax
  setupSmoothParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let currentScrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render = () => {
      // Reduce inertia on mobile for better touch scrolling feel
      const lerpFactor = this.isTouchDevice ? 0.15 : 0.08;
      currentScrollY = lerp(currentScrollY, targetScrollY, lerpFactor);

      parallaxElements.forEach(el => {
        // Reduce parallax intensity on mobile
        let speed = parseFloat(el.dataset.parallax) || 0.1;
        if (this.isMobile) speed *= 0.5; 
        
        const yPos = -(currentScrollY * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.05)`;
      });

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  },

  // 3. Cursor Reactive Depth (Cards) - Desktop Only
  setupCursorReactive() {
    const cards = document.querySelectorAll('.card-cinematic');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -4; 
        const rotateY = ((x - centerX) / centerX) * 4;  
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none'; 
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform var(--duration-medium) var(--ease-cinematic)';
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });
    });
  },

  // 4. Ambient Motion Particles
  setupAmbientParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-canvas';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      
      // Significantly reduce particles on mobile to save battery/CPU
      const numParticles = this.isMobile ? 10 : 35; 
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.2, // Slower on mobile
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${p.alpha})`;
        ctx.fill();
      });
      
      requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      initCanvas();
    });

    initCanvas();
    drawParticles();
  }
};
