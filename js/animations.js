/**
 * GSAP, SCROLLTRIGGER & 3D TILT ANIMATIONS
 * Handles smooth entrance choreography, typewriter, 3D card tilt physics, and counters
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Typewriter Effect
  initTypewriter();

  // 2. 3D Card Tilt Physics
  initTiltCards();

  // 3. GSAP Timeline & ScrollTrigger
  if (typeof gsap !== 'undefined') {
    initGsapAnimations();
  }

  // 4. Number Counters
  initNumberCounters();
});

/* ==========================================================================
   1. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Full Stack Web Developer',
    'UI/UX Pro Max Specialist',
    'BCA Scholar @ St. Joseph\'s',
    'Antigravity AI Practitioner',
    'PHP & MySQL Architect'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingDelay = 90;
  const erasingDelay = 45;
  const pauseDelay = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseDelay);
        return;
      }
    } else {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
    }

    setTimeout(type, isDeleting ? erasingDelay : typingDelay);
  }

  type();
}

/* ==========================================================================
   2. 3D Perspective Card Tilt Physics
   ========================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   3. GSAP Timelines & ScrollTrigger
   ========================================================================== */
function initGsapAnimations() {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Entrance Sequence
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

  heroTL
    .from('.site-header', { y: -50, opacity: 0, duration: 0.9 })
    .from('.status-pill', { y: 20, opacity: 0 }, '-=0.4')
    .from('.hero-greeting', { y: 30, opacity: 0, duration: 1 }, '-=0.5')
    .from('.typewriter-container', { y: 20, opacity: 0 }, '-=0.6')
    .from('.hero-bio', { y: 20, opacity: 0 }, '-=0.5')
    .from('.hero-cta-group > *', { y: 20, opacity: 0, stagger: 0.12 }, '-=0.4')
    .from('.hero-stats-row .stat-item', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.3')
    .from('.avatar-card-wrapper', { scale: 0.88, opacity: 0, duration: 1.1, ease: 'back.out(1.5)' }, '-=0.9')
    .from('.floating-chip', { scale: 0, opacity: 0, stagger: 0.15, ease: 'back.out(2)' }, '-=0.4');

  // ScrollTrigger reveals for sections
  if (typeof ScrollTrigger !== 'undefined') {
    // Section Headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    // About Section
    gsap.from('.story-card', {
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%',
      },
      x: -40,
      opacity: 0,
      duration: 0.9,
    });

    gsap.from('.timeline-card', {
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%',
      },
      x: 40,
      opacity: 0,
      duration: 0.9,
    });

    // Skill Cards Stagger
    gsap.from('.skill-card', {
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power2.out',
      onComplete: () => {
        // Trigger skill bar width animation
        document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
          const targetWidth = bar.getAttribute('data-width') || '85%';
          bar.style.width = targetWidth;
        });
      }
    });

    // Project Cards
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
    });

    // Terminal Window
    gsap.from('.terminal-window', {
      scrollTrigger: {
        trigger: '.terminal-window',
        start: 'top 85%',
      },
      scale: 0.95,
      y: 30,
      opacity: 0,
      duration: 0.8,
    });

    // Contact Cards
    gsap.from('.contact-direct-card', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 85%',
      },
      x: -30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
    });

    gsap.from('.contact-form-card', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 85%',
      },
      x: 30,
      opacity: 0,
      duration: 0.8,
    });
  }
}

/* ==========================================================================
   4. Animated Number Counters
   ========================================================================== */
function initNumberCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          if (!targetVal) return;

          let count = 0;
          const duration = 1500;
          const increment = Math.ceil(targetVal / (duration / 25));

          const timer = setInterval(() => {
            count += increment;
            if (count >= targetVal) {
              count = targetVal;
              clearInterval(timer);
            }
            el.innerHTML = `${count}<span>${suffix}</span>`;
          }, 25);

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}
