/**
 * INTERACTIVE DEVELOPER TERMINAL (Light Cyber CLI)
 * Full interactive simulated shell for tech leads, recruiters, and developers
 */

(function () {
  'use strict';

  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.querySelector('.terminal-body');
  if (!terminalInput || !terminalOutput) return;

  const history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `
<span style="color: #4f46e5; font-weight: 700;">Available Commands:</span>
  <span style="color: #06b6d4;">about</span>       - Learn about Arockia Madhan K
  <span style="color: #06b6d4;">skills</span>      - Display technical & soft skill sets
  <span style="color: #06b6d4;">projects</span>    - Browse key projects & full-stack architecture
  <span style="color: #06b6d4;">education</span>   - View academic background (BCA @ St. Joseph's)
  <span style="color: #06b6d4;">contact</span>     - Get direct contact email, phone, location
  <span style="color: #06b6d4;">hire</span>        - Direct prompt to hire Madhan
  <span style="color: #06b6d4;">resume</span>      - Open official resume viewer & download
  <span style="color: #06b6d4;">matrix</span>      - Trigger digital matrix visualizer
  <span style="color: #06b6d4;">clear</span>       - Clear the terminal screen
`,
    about: `
<span style="color: #0f172a; font-weight: 700;">Arockia Madhan K</span>
--------------------------------------------------
Dedicated and results-driven Full Stack Web Developer & BCA scholar.
Focused on achieving goals through hard work, adaptability, and modern web architectures.
Values collaboration, continuous learning, and crafting high-performance digital experiences.
`,
    skills: `
<span style="color: #4f46e5; font-weight: 700;">Core Tech Stack:</span>
  • <span style="color: #2563eb;">Languages:</span> HTML5, Modern CSS3, JavaScript (ES6+), PHP
  • <span style="color: #2563eb;">Databases:</span> MySQL Database Architecture, Relational Queries
  • <span style="color: #2563eb;">Tools & AI:</span> Git & GitHub, Antigravity AI, V-Lookup, Troubleshooting
  • <span style="color: #2563eb;">Soft Skills:</span> Problem Solving, Communication, Teamwork, Time Management
`,
    projects: `
<span style="color: #4f46e5; font-weight: 700;">Featured Projects:</span>
  [1] <span style="font-weight: 700; color: #0f172a;">Catering Service Management Website</span> (HTML, CSS, JS, PHP, MySQL)
      - Dynamic registration, login, menu catalog, cart, checkout, reviews & admin dashboard.
  [2] <span style="font-weight: 700; color: #0f172a;">Antigravity 3D Interactive Web Experience</span> (Three.js, WebGL, GSAP)
      - Ultra-responsive, 3D particle constellation & modern glassmorphism interface.
  [3] <span style="font-weight: 700; color: #0f172a;">Cloud Commerce & Booking Hub</span> (Full Stack Architecture)
`,
    education: `
<span style="color: #4f46e5; font-weight: 700;">Academic Qualifications:</span>
  • <span style="color: #0f172a; font-weight: 700;">Bachelor of Computer Applications (BCA)</span> (2023 - 2026)
    St. Joseph's College (Autonomous), Trichy | 65%
  • <span style="color: #0f172a; font-weight: 700;">Higher Secondary Certificate (HSC)</span> (2023)
    St. Antony's Higher Secondary School, Trichy | 67%
`,
    contact: `
<span style="color: #4f46e5; font-weight: 700;">Get in Touch with Madhan:</span>
  • Email:    <a href="mailto:arockiamadhan2020@gmail.com" style="color: #2563eb; text-decoration: underline;">arockiamadhan2020@gmail.com</a>
  • Phone:    <a href="tel:9361883721" style="color: #2563eb; text-decoration: underline;">+91 93618-83721</a>
  • Location: Trichy, Tamil Nadu, India
`,
    hire: `
<span style="color: #10b981; font-weight: 700;">🚀 Ready to hire Madhan?</span>
Madhan is actively available for Full Stack / Frontend Developer roles and internships!
Email: <span style="color: #4f46e5;">arockiamadhan2020@gmail.com</span> | Phone: <span style="color: #4f46e5;">+91 93618 83721</span>
Triggering direct contact form...
`,
    resume: `
<span style="color: #06b6d4; font-weight: 700;">📄 Opening official resume document...</span>
`,
    matrix: `
<span style="color: #10b981;">01001101 01000001 01000100 01001000 01000001 01001110</span>
<span style="color: #10b981;">Wake up, recruiter... Madhan is the developer you are looking for.</span>
`,
    whoami: `visitor@madhan-portfolio:~$ You are an authorized evaluator exploring Madhan's interactive portfolio.`,
    date: () => new Date().toLocaleString(),
    clear: ''
  };

  // Process a command
  function executeCommand(cmdStr) {
    const rawCmd = cmdStr.trim();
    if (!rawCmd) return;

    const lowerCmd = rawCmd.toLowerCase();
    history.push(rawCmd);
    historyIndex = history.length;

    // Create user prompt row
    const row = document.createElement('div');
    row.className = 'terminal-row';
    row.innerHTML = `<span class="terminal-prompt">madhan@portfolio:~$</span> <span class="terminal-cmd">${escapeHTML(rawCmd)}</span>`;
    terminalOutput.appendChild(row);

    // Play tactile sound if active
    if (window.playCyberSound) window.playCyberSound('click');

    // Handle clear
    if (lowerCmd === 'clear') {
      terminalOutput.innerHTML = '';
      terminalInput.value = '';
      return;
    }

    // Handle special triggers
    if (lowerCmd === 'hire' || lowerCmd === 'sudo hire') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }, 600);
      }
    }

    if (lowerCmd === 'resume') {
      if (window.openResumeModal) {
        setTimeout(() => window.openResumeModal(), 400);
      }
    }

    // Response row
    const resp = document.createElement('div');
    resp.className = 'terminal-response';

    if (COMMANDS[lowerCmd]) {
      const val = COMMANDS[lowerCmd];
      resp.innerHTML = typeof val === 'function' ? val() : val;
    } else {
      resp.innerHTML = `<span style="color: #ef4444;">Command not found: "${escapeHTML(rawCmd)}". Type <span style="color: #4f46e5; font-weight: 700;">help</span> for list of commands.</span>`;
    }

    terminalOutput.appendChild(resp);
    terminalInput.value = '';

    // Scroll terminal to bottom
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Input Key Listener
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  // Focus input when clicking anywhere inside terminal body
  if (terminalBody) {
    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });
  }

  // Quick chip buttons in header
  document.querySelectorAll('.terminal-chip-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
})();
