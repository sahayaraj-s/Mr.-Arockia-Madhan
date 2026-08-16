/**
 * MAIN APP CONTROLLER
 * Audio Synthesizer, Modals, Skills Filtering, Contact Actions, Toast Notifications, and UI State
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Web Audio API Sound Engine (Zero external file dependencies)
  // ==========================================================================
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  window.playCyberSound = function (type) {
    if (!isSoundEnabled || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.warn('Web Audio synthesis exception:', e);
    }
  };

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundToggleBtn.classList.toggle('active', isSoundEnabled);
      const icon = soundToggleBtn.querySelector('i');
      if (icon) {
        icon.className = isSoundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      if (isSoundEnabled) {
        window.playCyberSound('success');
        showToast('🔊 Audio feedback enabled');
      } else {
        showToast('🔇 Audio muted');
      }
    });
  }

  // Bind interactive hover sound to buttons & links
  document.querySelectorAll('button, a, .skill-card, .project-card, .soft-skill-pill').forEach((el) => {
    el.addEventListener('mouseenter', () => window.playCyberSound('hover'));
    el.addEventListener('click', () => window.playCyberSound('click'));
  });

  // ==========================================================================
  // 2. Custom Magnetic Cursor Follower
  // ==========================================================================
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .tilt-card');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ==========================================================================
  // 3. Navbar Scroll State & Mobile Menu
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navWrapper = document.querySelector('.nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Scroll Spy
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navWrapper) {
    mobileToggle.addEventListener('click', () => {
      navWrapper.classList.toggle('mobile-active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navWrapper.classList.remove('mobile-active');
      });
    });
  }

  // ==========================================================================
  // 4. Skills Matrix Filtering
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterCategory === 'all' || category === filterCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 5. Project Preview Modal System
  // ==========================================================================
  const projectData = {
    catering: {
      title: 'Catering Service Management Website',
      category: 'Full Stack Web Platform',
      tech: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Responsive UI'],
      description: `
        A comprehensive, full-stack catering management platform engineered for real-world banquet and catering operations.
        Features dynamic online customer registration, secure authentication, interactive catering menu browsing with categorization,
        real-time event booking calendar, shopping cart, multi-step checkout with simulated payment confirmation, and customer order history with reviews.
        Includes a robust administrative dashboard for real-time menu management, order dispatch tracking, customer analytics, and relational MySQL database queries.
      `,
      features: [
        'Interactive Menu Catalog with Dietary Filters',
        'Custom Event & Date Booking Engine',
        'Shopping Cart & Multi-Item Checkout Flow',
        'Customer Order History & Review Submission',
        'Comprehensive Admin Management Dashboard',
        'MySQL Relational Database Integration'
      ]
    },
    antigravity: {
      title: 'Antigravity 3D Interactive Web Universe',
      category: 'Creative WebGL & Frontend Experience',
      tech: ['Three.js', 'WebGL', 'GSAP', 'HTML5/CSS3', 'Audio API'],
      description: `
        An ultra-immersive 3D interactive web environment crafted with WebGL, Three.js, and GSAP animations.
        Features interactive particle constellations with real-time mouse repulsion, floating geometric polyhedrons,
        tactile cyber-synthesized Web Audio feedback, 3D card perspective tilt physics, and an interactive developer CLI terminal.
      `,
      features: [
        '60 FPS Three.js Dynamic WebGL Particle Field',
        'Perspective 3D Card Hover Physics',
        'Integrated Antigravity CLI Developer Terminal',
        'Pure Web Audio API Sound Synthesizer',
        'Modern Luxury Light UI/UX Pro Max Aesthetic'
      ]
    },
    commerce: {
      title: 'Smart Cloud Commerce & Booking Hub',
      category: 'Dynamic Web Application',
      tech: ['JavaScript (ES6+)', 'PHP', 'MySQL', 'CSS3 Grid', 'REST APIs'],
      description: `
        A responsive cloud commerce platform with real-time product discovery, interactive booking scheduler,
        instant cart state synchronization, and dynamic invoice generation. Built with clean code architecture and optimized SQL queries.
      `,
      features: [
        'Real-time Search & Instant Filter Bar',
        'Dynamic Booking Slot Reservation',
        'State-managed Cart with Local Persistence',
        'Optimized Relational Database Architecture'
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalBody = document.getElementById('project-modal-body');

  window.openProjectModal = function (projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    projectModalTitle.textContent = data.title;

    const techBadges = data.tech
      .map((t) => `<span class="project-tag" style="background: var(--primary-light); color: var(--primary); font-weight: 700;">${t}</span>`)
      .join(' ');

    const featuresList = data.features
      .map((f) => `<li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i> ${f}</li>`)
      .join('');

    projectModalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px;">
          ${techBadges}
        </div>
        <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.8;">
          ${data.description}
        </p>
        <div style="background: var(--bg-subtle); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
          <h4 style="font-family: var(--font-heading); margin-bottom: 12px; color: var(--text-primary); font-size: 1.1rem;">Key Architecture Modules:</h4>
          <ul style="list-style: none; padding: 0; margin: 0; color: var(--text-secondary); font-size: 0.95rem;">
            ${featuresList}
          </ul>
        </div>
        <div style="display: flex; gap: 14px; margin-top: 10px; flex-wrap: wrap;">
          <button class="btn-primary" onclick="showToast('🚀 Demo module launched!');">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Simulation
          </button>
          <a href="#contact" class="btn-secondary" onclick="closeAllModals();">
            <i class="fa-solid fa-paper-plane"></i> Discuss Project
          </a>
        </div>
      </div>
    `;

    projectModal.classList.add('active');
    window.playCyberSound('click');
  };

  if (projectModalClose) {
    projectModalClose.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
  }

  // ==========================================================================
  // 6. Resume Modal
  // ==========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close');

  window.openResumeModal = function () {
    if (resumeModal) {
      resumeModal.classList.add('active');
      window.playCyberSound('click');
    }
  };

  if (resumeModalClose && resumeModal) {
    resumeModalClose.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  window.closeAllModals = function () {
    if (projectModal) projectModal.classList.remove('active');
    if (resumeModal) resumeModal.classList.remove('active');
  };

  // Close modals on overlay backdrop click
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ==========================================================================
  // 7. One-Click Copy Actions & Toast Notifications
  // ==========================================================================
  window.copyToClipboard = function (text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        window.playCyberSound('success');
        showToast(`📋 Copied ${label} to clipboard!`);
      });
    } else {
      showToast(`📋 ${text}`);
    }
  };

  window.showToast = function (message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span class="toast-icon">✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  };

  // ==========================================================================
  // 8. Contact Form Handling
  // ==========================================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('⚠️ Please fill out all required fields.');
        return;
      }

      window.playCyberSound('success');
      showToast(`🎉 Thank you, ${name}! Your message has been received.`);

      // Optional: Generate direct mailto link
      const mailtoLink = `mailto:arockiamadhan2020@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;

      contactForm.reset();

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1000);
    });
  }
})();
