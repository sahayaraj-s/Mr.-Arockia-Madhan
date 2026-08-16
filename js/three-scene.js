/**
 * THREE.JS 3D INTERACTIVE LIGHT-MODE BACKGROUND
 * Interactive particle constellation & floating crystal geometric polyhedrons
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 85;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group to hold all 3D scene items
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Particle Constellation
  const particleCount = window.innerWidth < 768 ? 70 : 130;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];
  const particleColors = new Float32Array(particleCount * 3);

  // Light-theme chromatic color palette
  const colorPalette = [
    new THREE.Color(0x4f46e5), // Indigo
    new THREE.Color(0x06b6d4), // Cyan
    new THREE.Color(0x8b5cf6), // Violet
    new THREE.Color(0x3b82f6), // Blue
  ];

  const spreadX = 140;
  const spreadY = 110;
  const spreadZ = 80;

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * spreadX;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.04,
      y: (Math.random() - 0.5) * 0.04,
      z: (Math.random() - 0.5) * 0.03,
    });

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    particleColors[i * 3] = chosenColor.r;
    particleColors[i * 3 + 1] = chosenColor.g;
    particleColors[i * 3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3)
  );
  particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(particleColors, 3)
  );

  // Particle Material
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 32;
  pCanvas.height = 32;
  const pCtx = pCanvas.getContext('2d');
  const gradient = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(0, 0, 32, 32);

  const particleTexture = new THREE.CanvasTexture(pCanvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 4.0,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.NormalBlending,
    depthWrite: false,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  masterGroup.add(particleSystem);

  // Constellation Lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4f46e5,
    transparent: true,
    opacity: 0.12,
    linewidth: 1,
  });

  const maxConnections = particleCount * 5;
  const linePositions = new Float32Array(maxConnections * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(linePositions, 3)
  );

  const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  masterGroup.add(linesMesh);

  // 2. Floating 3D Crystal Polyhedrons
  const floatingMeshes = [];

  function createFloatingMesh(geometry, x, y, z, scale, colorHex) {
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: colorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const mesh = new THREE.Mesh(geometry, wireframeMaterial);
    mesh.position.set(x, y, z);
    mesh.scale.set(scale, scale, scale);

    // Inner subtle glow core
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.08,
    });
    const core = new THREE.Mesh(geometry, coreMaterial);
    core.scale.set(0.85, 0.85, 0.85);
    mesh.add(core);

    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008 + 0.004,
      rotY: (Math.random() - 0.5) * 0.008 + 0.004,
      initialY: y,
      floatSpeed: 0.001 + Math.random() * 0.001,
      floatOffset: Math.random() * Math.PI * 2,
    };

    masterGroup.add(mesh);
    floatingMeshes.push(mesh);
    return mesh;
  }

  createFloatingMesh(new THREE.IcosahedronGeometry(7, 0), -45, 25, -20, 1.2, 0x4f46e5);
  createFloatingMesh(new THREE.OctahedronGeometry(6, 0), 48, 15, -15, 1.1, 0x06b6d4);
  createFloatingMesh(new THREE.TorusGeometry(5, 1.5, 8, 16), -38, -25, -10, 1.0, 0x8b5cf6);
  createFloatingMesh(new THREE.DodecahedronGeometry(6, 0), 42, -28, -25, 1.15, 0x3b82f6);

  // Mouse Interaction & Inertia
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.05;
    mouseY = (e.clientY - windowHalfY) * 0.05;
  }, { passive: true });

  // Scroll Parallax
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Mouse Dampening
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    masterGroup.rotation.y = targetX * 0.012;
    masterGroup.rotation.x = targetY * 0.012;

    // Scroll Camera Depth Shift
    camera.position.y = -scrollY * 0.025;

    // Update Particles
    const positions = particleGeometry.attributes.position.array;
    let lineIdx = 0;
    const linePos = lineGeometry.attributes.position.array;
    const connectDistance = 24;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] += particleVelocities[i].x;
      positions[idx + 1] += particleVelocities[i].y;
      positions[idx + 2] += particleVelocities[i].z;

      // Bounce at boundary
      if (Math.abs(positions[idx]) > spreadX / 2) particleVelocities[i].x *= -1;
      if (Math.abs(positions[idx + 1]) > spreadY / 2) particleVelocities[i].y *= -1;
      if (Math.abs(positions[idx + 2]) > spreadZ / 2) particleVelocities[i].z *= -1;

      // Dynamic Constellation Lines calculation
      for (let j = i + 1; j < particleCount; j++) {
        const jdx = j * 3;
        const dx = positions[idx] - positions[jdx];
        const dy = positions[idx + 1] - positions[jdx + 1];
        const dz = positions[idx + 2] - positions[jdx + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectDistance && lineIdx < maxConnections * 6 - 6) {
          linePos[lineIdx++] = positions[idx];
          linePos[lineIdx++] = positions[idx + 1];
          linePos[lineIdx++] = positions[idx + 2];

          linePos[lineIdx++] = positions[jdx];
          linePos[lineIdx++] = positions[jdx + 1];
          linePos[lineIdx++] = positions[jdx + 2];
        }
      }
    }

    // Clear unused line vertex slots
    for (let k = lineIdx; k < maxConnections * 6; k++) {
      linePos[k] = 0;
    }

    particleGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;

    // Update Floating Meshes
    floatingMeshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotX;
      mesh.rotation.y += mesh.userData.rotY;
      mesh.position.y =
        mesh.userData.initialY +
        Math.sin(elapsedTime * 1.5 + mesh.userData.floatOffset) * 3;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
