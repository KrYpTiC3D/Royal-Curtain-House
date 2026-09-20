/**
 * Royal Curtain House — Three.js Liquid Fabric Wave Shader
 * Ambient WebGL Background Canvas with Fluid Ripple Fold Curtain Wave Deformation & Specular Caustic Refraction
 * Follows threejs-shaders, cinematic-gsap-lenis-motion-system, and vercel-react-best-practices guidelines.
 */

(function initLiquidShader() {
  'use strict';

  // Check if THREE is available
  if (typeof THREE === 'undefined') {
    return;
  }

  const canvas = document.getElementById('liquidCanvas');
  if (!canvas) {
    return;
  }

  // Check for WebGL support via dummy canvas to leave liquidCanvas untouched for Three.js
  try {
    const dummy = document.createElement('canvas');
    const hasGl = !!(window.WebGLRenderingContext && (dummy.getContext('webgl2') || dummy.getContext('webgl') || dummy.getContext('experimental-webgl')));
    if (!hasGl) return;
  } catch (e) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  // Geometry: Subdivided plane for smooth curtain drapery wave displacement
  const geometry = new THREE.PlaneGeometry(12, 8, 96, 72);

  // Custom Shader Material
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  const uniforms = {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(isDark() ? 0xd2232a : 0xdfd5c4) }, // Royal Crimson in dark / warm cream in light
    uColorB: { value: new THREE.Color(isDark() ? 0xb31d23 : 0xd2c6b2) },
    uColorC: { value: new THREE.Color(isDark() ? 0x8a1218 : 0xc7b9a2) },
    uOpacity: { value: isDark() ? 0.24 : 0.20 },
    uIsDark: { value: isDark() ? 1.0 : 0.0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) }
  };

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying vec3 vNormalWorld;
    varying vec3 vViewPos;
    varying float vWave;

    // Multi-octave compound wave simulating architectural curtain drapery
    // traveling very slowly diagonally from top-left to bottom-right
    float getWave(vec2 p, float t) {
      // Coordinate along the diagonal from top-left (-x, +y) to bottom-right (+x, -y)
      float diag = (p.x - p.y) * 0.7071;
      // Transverse coordinate across the diagonal for organic fabric drape
      float perp = (p.x + p.y) * 0.7071;

      // Primary slow diagonal wave propagating toward bottom-right (- t * speed)
      float wave1 = sin(diag * 1.5 - t * 0.26) * 0.28;
      // Secondary harmonic fold undulation with cross-drape variation
      float wave2 = cos(diag * 2.8 - t * 0.36 + sin(perp * 1.1) * 0.40) * 0.14;
      // Delicate silk micro-ripple shimmer
      float wave3 = sin(diag * 4.6 - t * 0.20 + perp * 0.6) * 0.06;

      return wave1 + wave2 + wave3;
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      float w = getWave(pos.xy, uTime);

      // Subtle mouse interaction deflection
      float distToMouse = distance(uv, uMouse);
      float mouseInfluence = smoothstep(0.55, 0.0, distToMouse) * 0.16;

      pos.z += w + mouseInfluence;
      vWave = w;

      // Analytical surface normal computation via finite difference
      float eps = 0.03;
      float wR = getWave(pos.xy + vec2(eps, 0.0), uTime);
      float wU = getWave(pos.xy + vec2(0.0, eps), uTime);
      vec3 normalModel = normalize(vec3(-(wR - w) / eps * 0.7, -(wU - w) / eps * 0.7, 1.0));

      vNormalWorld = normalize(normalMatrix * normalModel);
      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      vViewPos = -mvPos.xyz;

      gl_Position = projectionMatrix * mvPos;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uOpacity;
    uniform float uIsDark;
    varying vec2 vUv;
    varying vec3 vNormalWorld;
    varying vec3 vViewPos;
    varying float vWave;

    void main() {
      vec3 viewDir = normalize(vViewPos);
      vec3 normal = normalize(vNormalWorld);

      // Directional light glancing along the diagonal wave pleats
      vec3 lightDir = normalize(vec3(0.55, 0.65, 0.52));
      float diff = max(0.0, dot(normal, lightDir));

      // Specular silk sheen highlight along moving wave crests
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(0.0, dot(normal, halfVec)), 18.0);

      // Liquid glass Fresnel refractive edge sheen
      float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.6);

      // Diagonal wave coordinate in UV space propagating top-left to bottom-right
      float diagUv = (vUv.x - vUv.y) * 0.7071;
      float waveCycle = sin(diagUv * 5.2 - uTime * 0.26 + vWave * 2.2) * 0.5 + 0.5;

      // Theme-specific wave coloration:
      // Dark mode: subtle royal crimson red wave
      // Light mode: darker shade of architectural cream wave
      vec3 waveColor = (uIsDark > 0.5)
        ? mix(vec3(0.55, 0.08, 0.11), vec3(0.82, 0.14, 0.18), waveCycle)
        : mix(vec3(0.88, 0.83, 0.75), vec3(0.82, 0.76, 0.67), waveCycle);

      // Specular crest silk sheen
      vec3 crestLight = (uIsDark > 0.5)
        ? vec3(1.0, 0.84, 0.82) * spec * 0.45
        : vec3(1.0, 0.98, 0.95) * spec * 0.40;

      vec3 finalColor = waveColor + crestLight;

      // Diagonal wave transparency: whisper-soft pleats, fading to near zero in troughs
      float alpha = (uIsDark > 0.5)
        ? (waveCycle * 0.10 + spec * 0.16 + fresnel * 0.03)
        : (waveCycle * 0.12 + spec * 0.14 + fresnel * 0.03);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Theme observer for real-time uniform color update
  function updateThemeColors() {
    const dark = isDark();
    uniforms.uColorA.value.set(dark ? 0xd2232a : 0xdfd5c4);
    uniforms.uColorB.value.set(dark ? 0xb31d23 : 0xd2c6b2);
    uniforms.uColorC.value.set(dark ? 0x8a1218 : 0xc7b9a2);
    uniforms.uOpacity.value = dark ? 0.24 : 0.20;
    uniforms.uIsDark.value = dark ? 1.0 : 0.0;
  }

  const themeObserver = new MutationObserver(updateThemeColors);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Passive mouse position listener for subtle refraction tilt
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  window.addEventListener('pointermove', function(e) {
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = 1.0 - (e.clientY / window.innerHeight);
  }, { passive: true });

  // Resize handler
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize, { passive: true });

  // Animation Loop with Visibility & Reduced-Motion Optimization
  let isVisible = true;
  let rafId = null;
  let lastTime = performance.now();

  // IntersectionObserver to pause rendering when canvas is not in view
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId && !prefersReducedMotion) {
        lastTime = performance.now();
        animate();
      }
    });
  }, { threshold: 0.05 });

  canvasObserver.observe(canvas);

  // Pause on tab switch
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      isVisible = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else {
      isVisible = true;
      if (!rafId && !prefersReducedMotion) {
        lastTime = performance.now();
        animate();
      }
    }
  });

  function animate() {
    if (!isVisible) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(animate);

    const now = performance.now();
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    uniforms.uTime.value += delta;

    // Smooth mouse interpolation
    uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.05;

    // Subtle floating plane rotation
    mesh.rotation.z = Math.sin(uniforms.uTime.value * 0.2) * 0.04;
    mesh.rotation.x = Math.cos(uniforms.uTime.value * 0.15) * 0.03;

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    // Render single static frame for reduced-motion users
    uniforms.uTime.value = 1.2;
    renderer.render(scene, camera);
  } else {
    lastTime = performance.now();
    animate();
  }
})();
