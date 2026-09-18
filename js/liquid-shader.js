/**
 * Royal Curtain House — Three.js Liquid Fabric Wave Shader
 * Ambient WebGL Background Canvas with Fluid Fabric Wave Deformation & Fresnel Refraction
 * Follows threejs-shaders and vercel-react-best-practices guidelines.
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
  const geometry = new THREE.PlaneGeometry(10, 7, 64, 48);

  // Custom Shader Material
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  const uniforms = {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(isDark() ? 0x004722 : 0x007a3d) }, // Architectural Emerald
    uColorB: { value: new THREE.Color(isDark() ? 0x9e4c08 : 0xf58220) }, // Warm Amber
    uColorBg: { value: new THREE.Color(isDark() ? 0x12100e : 0xfafaf8) },
    uOpacity: { value: isDark() ? 0.35 : 0.22 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) }
  };

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Compound sinusoidal wave simulating organic curtain pleats & liquid ripple
      float wave1 = sin(pos.x * 1.8 + uTime * 0.75) * 0.22;
      float wave2 = cos(pos.y * 1.4 + uTime * 0.55 + pos.x * 0.8) * 0.16;
      float wave3 = sin((pos.x + pos.y) * 2.2 + uTime * 0.4) * 0.08;

      // Subtle mouse interaction deflection
      float distToMouse = distance(uv, uMouse);
      float mouseInfluence = smoothstep(0.6, 0.0, distToMouse) * 0.15;

      pos.z += wave1 + wave2 + wave3 + mouseInfluence;

      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorBg;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Liquid glass Fresnel reflection
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.8);

      // Subtle drapery fold gradient
      float gradient = smoothstep(0.1, 0.9, vUv.x + sin(vUv.y * 3.0 + uTime * 0.3) * 0.2);
      vec3 waveColor = mix(uColorA, uColorB, gradient);

      // Blend with ambient background
      vec3 finalColor = mix(waveColor, uColorA, fresnel * 0.5);

      float alpha = uOpacity * (0.6 + fresnel * 0.4);
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
    uniforms.uColorA.value.set(dark ? 0x005528 : 0x007a3d);
    uniforms.uColorB.value.set(dark ? 0x874008 : 0xf58220);
    uniforms.uColorBg.value.set(dark ? 0x12100e : 0xfafaf8);
    uniforms.uOpacity.value = dark ? 0.38 : 0.22;
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
  const clock = new THREE.Clock();

  // IntersectionObserver to pause rendering when canvas is not in view
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId && !prefersReducedMotion) {
        clock.start();
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
        clock.start();
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

    const delta = clock.getDelta();
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
    clock.start();
    animate();
  }
})();

