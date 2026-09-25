import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GREETINGS, getRandomGreeting, createMidAutumnIllustrations } from './greetings.js';

// Pre-render artistic Mid-Autumn illustrations (cached as data URLs)
const midAutumnImages = createMidAutumnIllustrations();

/* ==========================================================================
   SIMPLE INLINE AUDIO (MP3 BGM + WEB AUDIO CHIME)
   ========================================================================== */
const bgmAudio = document.getElementById('bgm');
if (bgmAudio) {
  bgmAudio.src = './trungthu.mp3';
  bgmAudio.volume = 0.5;
}

let chimeCtx = null;
function playChime() {
  try {
    if (!chimeCtx) chimeCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = chimeCtx.createOscillator();
    const gain = chimeCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, chimeCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, chimeCtx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(660, chimeCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, chimeCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, chimeCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(chimeCtx.destination);
    osc.start();
    osc.stop(chimeCtx.currentTime + 0.6);
  } catch (e) { /* silent fail */ }
}

/* ==========================================================================
   SCENE SETUP & HIGH-PERFORMANCE RENDERER
   ========================================================================== */
const container = document.getElementById('webgl-container') || document.body;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080418, 0.006);

const camera = new THREE.PerspectiveCamera(
  window.innerWidth < 768 ? 55 : 45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const DEFAULT_CAM_POS = window.innerWidth < 768
  ? new THREE.Vector3(0, 14, 48)
  : new THREE.Vector3(0, 15, 46);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 5.5, 0);

camera.position.copy(DEFAULT_CAM_POS);

const renderer = new THREE.WebGLRenderer({
  antialias: window.devicePixelRatio < 2,
  powerPreference: 'high-performance',
  alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI * 0.55;
controls.minDistance = 8;
controls.maxDistance = 85;
controls.target.copy(DEFAULT_CAM_TARGET);
controls.autoRotate = false;

/* ==========================================================================
   LIGHTING (NO DIRECTIONAL SHADOWS - EVEN ILLUMINATION)
   ========================================================================== */
const ambientLight = new THREE.AmbientLight(0x2e1f48, 2.0);
scene.add(ambientLight);

// HemisphereLight: sky color above, ground color below
const hemiLight = new THREE.HemisphereLight(0xaab8dd, 0xcc9944, 1.2);
scene.add(hemiLight);

// Central warm tree lantern glow
const warmTreeLight = new THREE.PointLight(0xffb8d9, 2.2, 40);
warmTreeLight.position.set(0, 8.5, 0);
scene.add(warmTreeLight);

// Warm ground glow from below the island
const groundGlow = new THREE.PointLight(0xffcc66, 1.8, 28);
groundGlow.position.set(0, -1, 0);
scene.add(groundGlow);

// Spotlight shining DOWN onto island surface (dimmed)
const islandSpotlight = new THREE.PointLight(0xfff0dc, 1.4, 30);
islandSpotlight.position.set(0, 18, 0);
scene.add(islandSpotlight);

// Warm fill light at island level (dimmed)
const islandFillLight = new THREE.PointLight(0xffddcc, 0.9, 18);
islandFillLight.position.set(5, 3, 5);
scene.add(islandFillLight);

// Vivid colored rim accent lights for depth & color pop
const rimLight1 = new THREE.PointLight(0x6688ff, 1.0, 65);
rimLight1.position.set(30, 10, -20);
scene.add(rimLight1);

const rimLight2 = new THREE.PointLight(0xff66aa, 0.9, 65);
rimLight2.position.set(-25, 15, 25);
scene.add(rimLight2);

const rimLight3 = new THREE.PointLight(0xaa55ff, 0.7, 50);
rimLight3.position.set(0, 25, 30);
scene.add(rimLight3);

const rimLight4 = new THREE.PointLight(0x55ddaa, 0.6, 50);
rimLight4.position.set(-20, 5, -30);
scene.add(rimLight4);

// Main directional moonlight - casts soft shadows
const moonLight = new THREE.DirectionalLight(0xd0e8ff, 1.6);
moonLight.position.set(-45, 42, -90); // same as moon position
moonLight.target.position.set(0, 0, 0);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 200;
moonLight.shadow.camera.left = -25;
moonLight.shadow.camera.right = 25;
moonLight.shadow.camera.top = 25;
moonLight.shadow.camera.bottom = -25;
moonLight.shadow.radius = 3;
moonLight.shadow.bias = -0.001;
scene.add(moonLight);
scene.add(moonLight.target);

/* ==========================================================================
   BACKGROUND: CELESTIAL FULL MOON & STARS
   ========================================================================== */
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(255, 215, 225, 0.8)');
  grad.addColorStop(0.7, 'rgba(240, 162, 175, 0.25)');
  grad.addColorStop(1, 'rgba(240, 162, 175, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
const particleTexture = createParticleTexture();

// 1. Giant Full Moon - Always bright from every angle
const moonGroup = new THREE.Group();
const moonGeo = new THREE.SphereGeometry(13, 36, 36);
const moonMat = new THREE.MeshBasicMaterial({
  color: 0xfff8e7,
  fog: false
});
const moonMesh = new THREE.Mesh(moonGeo, moonMat);
moonGroup.add(moonMesh);

// Moon Atmospheric Corona Glow
const moonCoronaMat = new THREE.SpriteMaterial({
  map: particleTexture,
  color: 0xffe8a3,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  fog: false
});
const moonCorona = new THREE.Sprite(moonCoronaMat);
moonCorona.scale.set(65, 65, 1);
moonGroup.add(moonCorona);

// Second larger faint outer glow
const moonOuterGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: particleTexture,
    color: 0xffeebb,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false
  })
);
moonOuterGlow.scale.set(95, 95, 1);
moonGroup.add(moonOuterGlow);

moonGroup.position.set(-45, 42, -90);
scene.add(moonGroup);

// 2. Starfield
const starCount = window.innerWidth < 768 ? 600 : 1200;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 180 + Math.random() * 220;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) * 0.9;
  starPos[i * 3 + 2] = r * Math.cos(phi);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.8,
  transparent: true,
  opacity: 0.75,
  map: particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const starPoints = new THREE.Points(starGeo, starMat);
scene.add(starPoints);

/* ==========================================================================
   REALISTIC FLOATING ISLAND (MULTI-LAYER GEOLOGY + SHADOWS)
   ========================================================================== */
const GROUND_Y = 1.68;
const islandGroup = new THREE.Group();
scene.add(islandGroup);

const islandRadius = 13.5;
const islandDepth = 16;

// ── Main rock body with heavy vertex displacement for craggy look ──
const islandGeo = new THREE.CylinderGeometry(islandRadius, 0.8, islandDepth, 48, 20);
const posAttr = islandGeo.attributes.position;

for (let i = 0; i < posAttr.count; i++) {
  let vx = posAttr.getX(i);
  let vy = posAttr.getY(i);
  let vz = posAttr.getZ(i);
  const distFromCenter = Math.sqrt(vx * vx + vz * vz);
  const t = (vy + islandDepth * 0.5) / islandDepth; // 0=bottom, 1=top

  // Multi-octave noise for organic look
  const n1 = Math.sin(vx * 0.55 + 0.3) * Math.cos(vz * 0.55 - 0.2) * 1.8;
  const n2 = Math.sin(vx * 1.4 + vz * 1.1 + 0.7) * 0.85;
  const n3 = Math.cos(vx * 2.5 - vz * 2.2) * 0.4;
  const noise = n1 + n2 + n3;

  if (vy > islandDepth * 0.1) {
    // Near-top: gentle undulation
    posAttr.setY(i, vy + noise * 0.35 * (1.0 - distFromCenter / (islandRadius + 1)));
  } else {
    // Underside: strong angular cliff displacement
    const jitter = 1.8 * (1.0 - t);
    posAttr.setX(i, vx + (Math.sin(vy * 0.5 + vz) * jitter + (Math.random() - 0.5) * 0.9));
    posAttr.setZ(i, vz + (Math.cos(vy * 0.5 + vx) * jitter + (Math.random() - 0.5) * 0.9));
    posAttr.setY(i, vy + (Math.random() - 0.5) * 0.6);
  }
}
islandGeo.computeVertexNormals();

// Natural dark basalt rock with color variation via vertex colors
const islandMat = new THREE.MeshStandardMaterial({
  color: 0x5a4a3a,       // warm brown-grey rock
  roughness: 0.92,
  metalness: 0.04,
  flatShading: true,
});
const islandMesh = new THREE.Mesh(islandGeo, islandMat);
islandMesh.position.y = -6.2;
islandMesh.castShadow = true;
islandMesh.receiveShadow = true;
islandGroup.add(islandMesh);

// ── Mid-band earth layer (soil/sediment stripe) ──
const midBandGeo = new THREE.CylinderGeometry(islandRadius * 0.98, islandRadius * 0.82, 2.2, 42, 3);
const midBandAttr = midBandGeo.attributes.position;
for (let i = 0; i < midBandAttr.count; i++) {
  const bx = midBandAttr.getX(i);
  const bz = midBandAttr.getZ(i);
  midBandAttr.setX(i, bx + (Math.sin(bz * 0.8) * 0.35 + (Math.random() - 0.5) * 0.4));
  midBandAttr.setZ(i, bz + (Math.cos(bx * 0.8) * 0.35 + (Math.random() - 0.5) * 0.4));
}
midBandGeo.computeVertexNormals();
const midBandMat = new THREE.MeshStandardMaterial({
  color: 0x7a5c3c,   // rich earthy brown
  roughness: 0.95,
  metalness: 0.0,
  flatShading: true
});
const midBandMesh = new THREE.Mesh(midBandGeo, midBandMat);
midBandMesh.position.y = -1.2;
midBandMesh.castShadow = false;
midBandMesh.receiveShadow = true;
islandGroup.add(midBandMesh);

// ── Cliff overhang rim - darker stone cap ──
const cliffRimGeo = new THREE.CylinderGeometry(islandRadius * 1.04, islandRadius * 0.96, 0.7, 48, 2);
const cliffRimAttr = cliffRimGeo.attributes.position;
for (let i = 0; i < cliffRimAttr.count; i++) {
  cliffRimAttr.setX(i, cliffRimAttr.getX(i) + (Math.random() - 0.5) * 0.5);
  cliffRimAttr.setZ(i, cliffRimAttr.getZ(i) + (Math.random() - 0.5) * 0.5);
}
cliffRimGeo.computeVertexNormals();
const cliffRimMat = new THREE.MeshStandardMaterial({
  color: 0x4a3a2e,   // darkest stone at rim
  roughness: 0.96,
  metalness: 0.02,
  flatShading: true
});
const cliffRimMesh = new THREE.Mesh(cliffRimGeo, cliffRimMat);
cliffRimMesh.position.y = 0.55;
cliffRimMesh.receiveShadow = true;
islandGroup.add(cliffRimMesh);

// ── Soil layer just below grass (dirt/loam) ──
const soilGeo = new THREE.CylinderGeometry(islandRadius * 1.005, islandRadius * 0.975, 0.55, 48, 1);
const soilMat = new THREE.MeshStandardMaterial({
  color: 0x8b6040,   // loamy soil brown
  roughness: 0.9,
  metalness: 0.0
});
const soilMesh = new THREE.Mesh(soilGeo, soilMat);
soilMesh.position.y = 1.2;
soilMesh.receiveShadow = true;
islandGroup.add(soilMesh);

// ── Lush grass top plateau ──
const topPlateauGeo = new THREE.CylinderGeometry(islandRadius * 1.01, islandRadius * 0.97, 0.38, 56, 1);
const topPlateauMat = new THREE.MeshStandardMaterial({
  color: 0x5a8a3a,   // rich natural grass green
  emissive: 0x1a3a10,
  emissiveIntensity: 0.08,
  roughness: 0.75,
  metalness: 0.0
});
const topPlateauMesh = new THREE.Mesh(topPlateauGeo, topPlateauMat);
topPlateauMesh.position.y = 1.59;
topPlateauMesh.receiveShadow = true;
islandGroup.add(topPlateauMesh);

// ── Rocky boulders along cliff edge for realism ──
const boulderColors = [0x5a4a3a, 0x4a3a2e, 0x6b5545, 0x3d3028];
for (let i = 0; i < 18; i++) {
  const boulderMat = new THREE.MeshStandardMaterial({
    color: boulderColors[i % boulderColors.length],
    roughness: 0.9 + Math.random() * 0.08,
    flatShading: true,
    metalness: 0.0
  });
  const bSize = 0.3 + Math.random() * 0.7;
  const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(bSize, 0), boulderMat);
  const ang = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
  const dist = (islandRadius - 1.5) + Math.random() * 2.8;
  boulder.position.set(Math.cos(ang) * dist, GROUND_Y - 0.1 + (Math.random() - 0.5) * 0.4, Math.sin(ang) * dist);
  boulder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  boulder.castShadow = true;
  boulder.receiveShadow = true;
  islandGroup.add(boulder);
}

// ── Scattered stones across the plateau ──
const stoneMat = new THREE.MeshStandardMaterial({
  color: 0x6b5a4a,
  roughness: 0.92,
  flatShading: true
});
for (let i = 0; i < 12; i++) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.15 + Math.random() * 0.3, 0),
    stoneMat
  );
  const ang = (i / 12) * Math.PI * 2 + 0.4;
  const dist = 3.5 + Math.random() * 7.5;
  rock.position.set(Math.cos(ang) * dist, GROUND_Y + 0.05, Math.sin(ang) * dist);
  rock.rotation.set(Math.random(), Math.random(), Math.random());
  rock.castShadow = true;
  rock.receiveShadow = true;
  islandGroup.add(rock);
}

// ── Dense natural grass blades ──
const grassMat = new THREE.MeshStandardMaterial({
  color: 0x4a7a2a,
  emissive: 0x0a2005,
  emissiveIntensity: 0.1,
  roughness: 0.8,
  metalness: 0.0,
  side: THREE.DoubleSide
});
const grassMat2 = new THREE.MeshStandardMaterial({
  color: 0x5d9032,
  emissive: 0x102205,
  emissiveIntensity: 0.08,
  roughness: 0.75,
  metalness: 0.0,
  side: THREE.DoubleSide
});
const grassMat3 = new THREE.MeshStandardMaterial({
  color: 0x3d6622,
  emissive: 0x081a02,
  emissiveIntensity: 0.1,
  roughness: 0.82,
  side: THREE.DoubleSide
});
const grassMats = [grassMat, grassMat2, grassMat3];

for (let i = 0; i < 90; i++) {
  const ang = Math.random() * Math.PI * 2;
  const dist = 2.0 + Math.random() * 10.5;
  const gx = Math.cos(ang) * dist;
  const gz = Math.sin(ang) * dist;
  if (Math.sqrt(gx * gx + gz * gz) < 1.8) continue;

  const bladeCount = 2 + Math.floor(Math.random() * 3);
  for (let b = 0; b < bladeCount; b++) {
    const h = 0.22 + Math.random() * 0.42;
    const w = 0.055 + Math.random() * 0.055;
    const bladeGeo = new THREE.PlaneGeometry(w, h);
    bladeGeo.translate(0, h * 0.5, 0);
    const blade = new THREE.Mesh(bladeGeo, grassMats[Math.floor(Math.random() * 3)]);
    blade.position.set(
      gx + (Math.random() - 0.5) * 0.25,
      GROUND_Y,
      gz + (Math.random() - 0.5) * 0.25
    );
    blade.rotation.y = Math.random() * Math.PI;
    blade.rotation.x = -0.1 + Math.random() * 0.22;
    blade.castShadow = true;
    blade.receiveShadow = true;
    islandGroup.add(blade);
  }
}

// ── Glowing Mushrooms ──
const mushroomCapMat = new THREE.MeshStandardMaterial({
  color: 0xee88ff,
  emissive: 0xaa44dd,
  emissiveIntensity: 0.9,
  roughness: 0.4
});
const mushroomStemMat = new THREE.MeshStandardMaterial({
  color: 0xf5eeee,
  roughness: 0.6
});

const mushPositions = [
  { x: 4.5,  z:  3.2, scale: 0.6  },
  { x: -5.2, z:  2.8, scale: 0.45 },
  { x:  3.8, z: -4.6, scale: 0.52 },
  { x: -3.5, z: -5.1, scale: 0.38 },
  { x:  7.2, z: -1.8, scale: 0.5  },
  { x: -6.8, z: -3.2, scale: 0.42 },
  { x:  1.8, z:  6.5, scale: 0.48 },
  { x: -2.5, z:  7.0, scale: 0.35 }
];

mushPositions.forEach(mp => {
  const mGroup = new THREE.Group();
  const capGeo = new THREE.SphereGeometry(0.28, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const cap = new THREE.Mesh(capGeo, mushroomCapMat);
  cap.position.y = 0.32;
  cap.castShadow = true;
  mGroup.add(cap);

  const stemGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.32, 6);
  const stem = new THREE.Mesh(stemGeo, mushroomStemMat);
  stem.position.y = 0.16;
  stem.castShadow = true;
  mGroup.add(stem);

  mGroup.position.set(mp.x, GROUND_Y, mp.z);
  mGroup.scale.setScalar(mp.scale);
  mGroup.rotation.y = Math.random() * Math.PI * 2;
  islandGroup.add(mGroup);
});

// ── Small wildflowers ──
const flowerColors = [0xff88aa, 0xffbb55, 0xaaddff, 0xffccee, 0xfff0a0, 0xff6699];
for (let i = 0; i < 35; i++) {
  const ang = Math.random() * Math.PI * 2;
  const dist = 2.5 + Math.random() * 9.0;
  const fx = Math.cos(ang) * dist;
  const fz = Math.sin(ang) * dist;
  if (Math.sqrt(fx * fx + fz * fz) < 2.0) continue;

  const fColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
  const fMat = new THREE.MeshStandardMaterial({
    color: fColor,
    emissive: fColor,
    emissiveIntensity: 0.5,
    roughness: 0.45
  });
  const flower = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), fMat);
  flower.position.set(fx, GROUND_Y + 0.1, fz);
  flower.castShadow = true;
  islandGroup.add(flower);
}

// ── Moss fringe at the rim ──
const mossGeo = new THREE.RingGeometry(islandRadius * 0.87, islandRadius * 1.02, 56, 1);
const mossMat = new THREE.MeshStandardMaterial({
  color: 0x3d6e30,
  emissive: 0x0d1e08,
  emissiveIntensity: 0.1,
  roughness: 0.9,
  transparent: true,
  opacity: 0.65,
  side: THREE.DoubleSide
});
const mossRing = new THREE.Mesh(mossGeo, mossMat);
mossRing.rotation.x = -Math.PI / 2;
mossRing.position.y = GROUND_Y + 0.02;
mossRing.receiveShadow = true;
islandGroup.add(mossRing);

// ── Subtle under-island glow ──
const groundSparkle = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: particleTexture,
    color: 0xffe8cc,
    transparent: true,
    opacity: 0.10,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
groundSparkle.scale.set(28, 28, 1);
groundSparkle.position.set(0, GROUND_Y + 0.3, 0);
islandGroup.add(groundSparkle);



/* ==========================================================================
   STYLIZED CHERRY BLOSSOM TREE (ORGANIC TRUNK & 14 BRANCHES)
   ========================================================================== */
const treeClickables = [];
const treeGroup = new THREE.Group();
treeGroup.position.set(0, GROUND_Y, 0);
islandGroup.add(treeGroup);

const trunkMat = new THREE.MeshStandardMaterial({
  color: 0x2e1710,
  roughness: 0.86,
  metalness: 0.05
});

// Main Curved Trunk
const trunkCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0.18, 2.2, -0.12),
  new THREE.Vector3(-0.15, 4.5, 0.14),
  new THREE.Vector3(0.08, 6.8, -0.06),
  new THREE.Vector3(0.0, 8.8, 0.0)
]);

// Trunk tapered segments
const trunkSegments = [
  { start: trunkCurve.getPointAt(0.0), mid: trunkCurve.getPointAt(0.2), end: trunkCurve.getPointAt(0.4), r: 0.48 },
  { start: trunkCurve.getPointAt(0.4), mid: trunkCurve.getPointAt(0.6), end: trunkCurve.getPointAt(0.8), r: 0.34 },
  { start: trunkCurve.getPointAt(0.8), mid: trunkCurve.getPointAt(0.9), end: trunkCurve.getPointAt(1.0), r: 0.22 }
];

trunkSegments.forEach(seg => {
  const c = new THREE.CatmullRomCurve3([seg.start, seg.mid, seg.end]);
  const geo = new THREE.TubeGeometry(c, 14, seg.r, 8, false);
  const m = new THREE.Mesh(geo, trunkMat);
  m.castShadow = true;
  m.receiveShadow = true;
  treeGroup.add(m);
  treeClickables.push(m);
});

// Roots spreading into ground
const rootAngles = [0, 1.25, 2.5, 3.75, 5.0];
rootAngles.forEach(ang => {
  const rDist = 2.2 + Math.random() * 0.7;
  const rPts = [
    new THREE.Vector3(0, 1.0, 0),
    new THREE.Vector3(Math.cos(ang) * (rDist * 0.5), 0.4, Math.sin(ang) * (rDist * 0.5)),
    new THREE.Vector3(Math.cos(ang) * rDist, 0.0, Math.sin(ang) * rDist)
  ];
  const rCurve = new THREE.CatmullRomCurve3(rPts);
  const rGeo = new THREE.TubeGeometry(rCurve, 8, 0.24, 6, false);
  const rMesh = new THREE.Mesh(rGeo, trunkMat);
  rMesh.castShadow = true;
  treeGroup.add(rMesh);
});

// 14 Curved Main Branches Radiating in All Directions
const branchClusters = [];
const mainBranchCount = 14;

for (let i = 0; i < mainBranchCount; i++) {
  const angle = (i / mainBranchCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
  const h = 3.6 + Math.random() * 4.6;
  const startP = trunkCurve.getPointAt(h / 8.8);
  const len = 3.5 + Math.random() * 2.6;

  const endP = new THREE.Vector3(
    startP.x + Math.cos(angle) * len,
    startP.y + 0.6 + Math.random() * 1.4,
    startP.z + Math.sin(angle) * len
  );

  const midP = new THREE.Vector3().addVectors(startP, endP).multiplyScalar(0.5);
  midP.y += 0.5 + Math.random() * 0.35;

  const bCurve = new THREE.CatmullRomCurve3([startP, midP, endP]);
  const bGeo = new THREE.TubeGeometry(bCurve, 10, 0.14, 6, false);
  const bMesh = new THREE.Mesh(bGeo, trunkMat);
  bMesh.castShadow = true;
  treeGroup.add(bMesh);
  treeClickables.push(bMesh);

  branchClusters.push({ center: endP, radius: 3.4 + Math.random() * 0.9 });

  // Sub-branch / twig
  const subAngle = angle + (Math.random() - 0.5) * 0.8;
  const subLen = 1.7 + Math.random() * 1.4;
  const subEnd = new THREE.Vector3(
    endP.x + Math.cos(subAngle) * subLen,
    endP.y + (Math.random() - 0.3) * 0.8,
    endP.z + Math.sin(subAngle) * subLen
  );
  const subCurve = new THREE.CatmullRomCurve3([endP, subEnd]);
  const subGeo = new THREE.TubeGeometry(subCurve, 6, 0.07, 5, false);
  const subMesh = new THREE.Mesh(subGeo, trunkMat);
  subMesh.castShadow = true;
  treeGroup.add(subMesh);
  treeClickables.push(subMesh);

  branchClusters.push({ center: subEnd, radius: 2.5 + Math.random() * 0.7 });
}

// Foliage Particle Clusters (26,000 particles - silky 60 FPS)
const foliageClusters = [
  { center: new THREE.Vector3(0, 10.4, 0), radius: 5.8 },
  { center: new THREE.Vector3(0, 8.6, 0), radius: 6.8 },
  { center: new THREE.Vector3(0, 6.6, 0), radius: 6.2 },
  ...branchClusters
];

const particleCount = 26000;
const blossomGeo = new THREE.BufferGeometry();
const blossomPos = new Float32Array(particleCount * 3);
const blossomColors = new Float32Array(particleCount * 3);

const colorDustyPink = new THREE.Color(0xe8a2a8);
const colorSoftPink = new THREE.Color(0xf0b6bc);
const colorPaleRose = new THREE.Color(0xf7d1d5);
const colorSoftWhite = new THREE.Color(0xfdf0f2);

for (let i = 0; i < particleCount; i++) {
  const c = foliageClusters[Math.floor(Math.random() * foliageClusters.length)];

  const u = Math.random();
  const r = Math.pow(u, 0.65) * c.radius;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const x = c.center.x + r * Math.sin(phi) * Math.cos(theta);
  const y = c.center.y + r * Math.sin(phi) * Math.sin(theta) * 0.78;
  const z = c.center.z + r * Math.cos(phi);

  blossomPos[i * 3] = x;
  blossomPos[i * 3 + 1] = y;
  blossomPos[i * 3 + 2] = z;

  // Height-based Sakura gradient
  const heightFactor = THREE.MathUtils.clamp((y - 4.5) / 7.2, 0, 1);
  const randC = Math.random();
  let col;

  if (heightFactor < 0.3) {
    col = randC < 0.6 ? colorDustyPink : colorSoftPink;
  } else if (heightFactor < 0.7) {
    col = (randC < 0.4) ? colorSoftPink : (randC < 0.8 ? colorPaleRose : colorDustyPink);
  } else {
    col = randC < 0.5 ? colorSoftWhite : colorPaleRose;
  }

  blossomColors[i * 3] = col.r;
  blossomColors[i * 3 + 1] = col.g;
  blossomColors[i * 3 + 2] = col.b;
}

blossomGeo.setAttribute('position', new THREE.BufferAttribute(blossomPos, 3));
blossomGeo.setAttribute('color', new THREE.BufferAttribute(blossomColors, 3));

const blossomMat = new THREE.PointsMaterial({
  size: 0.44,
  vertexColors: true,
  map: particleTexture,
  transparent: true,
  opacity: 0.82,
  blending: THREE.NormalBlending,
  depthWrite: false
});
const blossomPoints = new THREE.Points(blossomGeo, blossomMat);
treeGroup.add(blossomPoints);

/* ==========================================================================
   MOON RABBIT FAMILY (PERFECTLY GROUNDED ON FLAT SURFACE)
   ========================================================================== */
function createRabbitModel(furColor = 0xfafafa) {
  const group = new THREE.Group();

  const furMat = new THREE.MeshStandardMaterial({
    color: furColor,
    roughness: 0.5,
    metalness: 0.05
  });

  const innerEarMat = new THREE.MeshBasicMaterial({ color: 0xffb8c6 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 }); // ruby eye
  const noseMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 }); // pink nose

  // Body: sits just above paws
  const bodyGeo = new THREE.SphereGeometry(0.48, 14, 12);
  bodyGeo.scale(0.85, 0.95, 1.0);
  const bodyMesh = new THREE.Mesh(bodyGeo, furMat);
  bodyMesh.position.y = 0.42;
  group.add(bodyMesh);

  // Head
  const headGeo = new THREE.SphereGeometry(0.34, 14, 12);
  const headMesh = new THREE.Mesh(headGeo, furMat);
  headMesh.position.set(0, 0.82, 0.22);
  group.add(headMesh);

  // Pink nose
  const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), noseMat);
  noseMesh.position.set(0, 0.82, 0.55);
  group.add(noseMesh);

  // Ruby eyes
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
  leftEye.position.set(0.18, 0.90, 0.40);
  group.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.x = -0.18;
  group.add(rightEye);

  // Ears
  const earGroup = new THREE.Group();
  earGroup.position.set(0, 1.12, 0.18);

  const earGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.52, 8);
  const earLeft = new THREE.Mesh(earGeo, furMat);
  earLeft.position.set(-0.12, 0.24, 0);
  earLeft.rotation.z = 0.16;
  earLeft.rotation.x = -0.12;
  earGroup.add(earLeft);

  const leftInner = new THREE.Mesh(new THREE.PlaneGeometry(0.065, 0.36), innerEarMat);
  leftInner.position.set(-0.12, 0.24, 0.045);
  leftInner.rotation.z = 0.16;
  leftInner.rotation.x = -0.12;
  earGroup.add(leftInner);

  const earRight = new THREE.Mesh(earGeo, furMat);
  earRight.position.set(0.12, 0.24, 0);
  earRight.rotation.z = -0.16;
  earRight.rotation.x = -0.12;
  earGroup.add(earRight);

  const rightInner = new THREE.Mesh(new THREE.PlaneGeometry(0.065, 0.36), innerEarMat);
  rightInner.position.set(0.12, 0.24, 0.045);
  rightInner.rotation.z = -0.16;
  rightInner.rotation.x = -0.12;
  earGroup.add(rightInner);

  group.add(earGroup);

  // Paws: Bottom of paws touches y = 0
  const frontPawGeo = new THREE.SphereGeometry(0.10, 8, 8);
  frontPawGeo.scale(1, 0.65, 1.3);
  const leftFrontPaw = new THREE.Mesh(frontPawGeo, furMat);
  leftFrontPaw.position.set(0.22, 0.08, 0.38);
  group.add(leftFrontPaw);

  const rightFrontPaw = leftFrontPaw.clone();
  rightFrontPaw.position.x = -0.22;
  group.add(rightFrontPaw);

  const hindPawGeo = new THREE.SphereGeometry(0.15, 8, 8);
  hindPawGeo.scale(0.85, 0.65, 1.4);
  const leftHindPaw = new THREE.Mesh(hindPawGeo, furMat);
  leftHindPaw.position.set(0.32, 0.10, -0.2);
  group.add(leftHindPaw);

  const rightHindPaw = leftHindPaw.clone();
  rightHindPaw.position.x = -0.32;
  group.add(rightHindPaw);

  // Tail
  const tailMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), furMat);
  tailMesh.position.set(0, 0.40, -0.45);
  group.add(tailMesh);

  return { group, earGroup, bodyMesh };
}

// 5 Rabbits with customized sizes, orbits, and hopping speeds
const rabbits = [];
const rabbitConfigs = [
  { scale: 1.15, orbitRadius: 7.2, orbitSpeed: 0.12, hopSpeed: 5.2, hopHeight: 0.22, phase: 0.0, fur: 0xfafafa },
  { scale: 0.85, orbitRadius: 4.8, orbitSpeed: -0.16, hopSpeed: 6.0, hopHeight: 0.18, phase: 1.8, fur: 0xfffcf5 },
  { scale: 0.72, orbitRadius: 9.6, orbitSpeed: 0.14, hopSpeed: 5.6, hopHeight: 0.24, phase: 3.5, fur: 0xf5f3ff },
  { scale: 0.60, orbitRadius: 3.6, orbitSpeed: 0.22, hopSpeed: 7.2, hopHeight: 0.16, phase: 4.9, fur: 0xfff0f5 },
  { scale: 0.68, orbitRadius: 11.4, orbitSpeed: -0.13, hopSpeed: 5.0, hopHeight: 0.26, phase: 2.7, fur: 0xfdfdfd }
];

rabbitConfigs.forEach(cfg => {
  const { group, earGroup, bodyMesh } = createRabbitModel(cfg.fur);
  group.scale.setScalar(cfg.scale);
  islandGroup.add(group);

  rabbits.push({
    mesh: group,
    earGroup,
    bodyMesh,
    orbitRadius: cfg.orbitRadius,
    orbitSpeed: cfg.orbitSpeed,
    phase: cfg.phase,
    hopSpeed: cfg.hopSpeed,
    hopHeight: cfg.hopHeight
  });
});

/* ==========================================================================
   FLOATING SKY LANTERNS (THIÊN ĐĂNG) & RADIANT HALO SPRITES
   ========================================================================== */
function createLanternTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#ff4d4d');
  grad.addColorStop(0.45, '#e63946');
  grad.addColorStop(0.85, '#ffb703');
  grad.addColorStop(1, '#ff9100');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 5;
  ctx.strokeRect(3, 3, 122, 122);
  return new THREE.CanvasTexture(canvas);
}
const lanternTexture = createLanternTexture();

const lanternGlowMat = new THREE.SpriteMaterial({
  map: particleTexture,
  color: 0xffaa00,
  transparent: true,
  opacity: 0.65,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const lanterns = [];
const interactiveLanterns = [];
const lanternCount = 70;

for (let i = 0; i < lanternCount; i++) {
  const group = new THREE.Group();

  // Lantern body
  const bodyGeo = new THREE.CylinderGeometry(0.65, 0.48, 1.45, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: lanternTexture,
    emissive: 0xff6600,
    emissiveIntensity: 0.85,
    roughness: 0.4
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Top ring
  const capGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.08, 8);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6 });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 0.72;
  group.add(cap);

  // Hanging tag
  const tagGeo = new THREE.PlaneGeometry(0.35, 0.75);
  const tagMat = new THREE.MeshBasicMaterial({ color: 0xd90429, side: THREE.DoubleSide });
  const tag = new THREE.Mesh(tagGeo, tagMat);
  tag.position.set(0, -1.15, 0);
  group.add(tag);

  // Radiant Glowing Sprite Halo (Zero bloom cost!)
  const glow = new THREE.Sprite(lanternGlowMat);
  glow.scale.set(3.4, 3.4, 1);
  group.add(glow);

  // Invisible hit sphere for effortless clicking
  const hitGeo = new THREE.SphereGeometry(1.8, 8, 8);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  group.add(hitMesh);

  // Positioning - wider spread for denser lantern sky
  const radius = 12 + Math.random() * 44;
  const angle = Math.random() * Math.PI * 2;
  const y = -8 + Math.random() * 55;

  group.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);

  const sc = 0.85 + Math.random() * 0.45;
  group.scale.set(sc, sc, sc);

  const greeting = GREETINGS[i % GREETINGS.length];
  group.userData = {
    speedY: 0.003 + Math.random() * 0.005,
    swingSpeed: 0.8 + Math.random() * 1.2,
    initialX: group.position.x,
    initialZ: group.position.z,
    id: i,
    greeting
  };

  hitMesh.userData.parentLantern = group;

  scene.add(group);
  lanterns.push(group);
  interactiveLanterns.push(hitMesh);
}

/* ==========================================================================
   FALLING PETALS (LIGHTWEIGHT 80 PARTICLES)
   ========================================================================== */
const petalCount = 80;
const petalGeo = new THREE.BufferGeometry();
const petalPositions = new Float32Array(petalCount * 3);
const petalVelocities = [];

for (let i = 0; i < petalCount; i++) {
  petalPositions[i * 3] = (Math.random() - 0.5) * 40;
  petalPositions[i * 3 + 1] = Math.random() * 30;
  petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

  petalVelocities.push({
    vy: 0.02 + Math.random() * 0.025,
    sway: Math.random() * Math.PI * 2
  });
}
petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
const petalMat = new THREE.PointsMaterial({
  size: 0.35,
  color: 0xf7d1d5,
  transparent: true,
  opacity: 0.75,
  map: particleTexture,
  blending: THREE.NormalBlending,
  depthWrite: false
});
const petalPoints = new THREE.Points(petalGeo, petalMat);
scene.add(petalPoints);

/* ==========================================================================
   NEBULA CLOUDS (LARGE SOFT SPRITES)
   ========================================================================== */
function createNebulaTexture(color1, color2) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, color1);
  grad.addColorStop(0.4, color2);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

const nebulaConfigs = [
  { pos: [60, 30, -80], scale: 80, color1: 'rgba(90,50,180,0.12)', color2: 'rgba(60,20,120,0.04)' },
  { pos: [-70, 25, -60], scale: 65, color1: 'rgba(180,60,100,0.10)', color2: 'rgba(100,30,60,0.03)' },
  { pos: [40, 50, 70], scale: 90, color1: 'rgba(50,80,180,0.09)', color2: 'rgba(30,40,120,0.03)' },
  { pos: [-50, 45, 50], scale: 70, color1: 'rgba(100,50,150,0.10)', color2: 'rgba(60,30,100,0.03)' }
];

nebulaConfigs.forEach(nc => {
  const nebTex = createNebulaTexture(nc.color1, nc.color2);
  const nebMat = new THREE.SpriteMaterial({
    map: nebTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const nebSprite = new THREE.Sprite(nebMat);
  nebSprite.position.set(...nc.pos);
  nebSprite.scale.set(nc.scale, nc.scale, 1);
  scene.add(nebSprite);
});

/* ==========================================================================
   COLORFUL FIREFLIES (MULTICOLOR PARTICLES AROUND ISLAND)
   ========================================================================== */
const fireflyCount = 50;
const fireflyGeo = new THREE.BufferGeometry();
const fireflyPositions = new Float32Array(fireflyCount * 3);
const fireflyColors = new Float32Array(fireflyCount * 3);
const fireflyData = [];

const ffPalette = [
  new THREE.Color(0xffee55), // warm gold
  new THREE.Color(0xff88cc), // pink
  new THREE.Color(0x88ccff), // cyan
  new THREE.Color(0xaa88ff), // purple
  new THREE.Color(0x88ffaa), // green
  new THREE.Color(0xff9955), // orange
  new THREE.Color(0xffaaee), // rose
  new THREE.Color(0x55eeff), // aqua
];

for (let i = 0; i < fireflyCount; i++) {
  const ang = Math.random() * Math.PI * 2;
  const dist = 3 + Math.random() * 16;
  const y = GROUND_Y + 0.5 + Math.random() * 10;
  fireflyPositions[i * 3] = Math.cos(ang) * dist;
  fireflyPositions[i * 3 + 1] = y;
  fireflyPositions[i * 3 + 2] = Math.sin(ang) * dist;

  const col = ffPalette[Math.floor(Math.random() * ffPalette.length)];
  fireflyColors[i * 3] = col.r;
  fireflyColors[i * 3 + 1] = col.g;
  fireflyColors[i * 3 + 2] = col.b;

  fireflyData.push({
    baseX: Math.cos(ang) * dist,
    baseY: y,
    baseZ: Math.sin(ang) * dist,
    speedX: 0.3 + Math.random() * 0.6,
    speedY: 0.5 + Math.random() * 0.8,
    speedZ: 0.4 + Math.random() * 0.5,
    amplitude: 0.6 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2
  });
}
fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
fireflyGeo.setAttribute('color', new THREE.BufferAttribute(fireflyColors, 3));

const fireflyMat = new THREE.PointsMaterial({
  size: 0.55,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  map: particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
scene.add(fireflyPoints);

/* ==========================================================================
   MAGIC DUST RING (COLORFUL ORBITING SPARKLES - SINGLE DRAW CALL)
   ========================================================================== */
const dustCount = 120;
const dustGeo = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustCount * 3);
const dustColors = new Float32Array(dustCount * 3);
const dustData = [];

const dustPalette = [
  new THREE.Color(0xffdd44), // gold
  new THREE.Color(0xff77bb), // pink
  new THREE.Color(0x77bbff), // sky blue
  new THREE.Color(0xcc77ff), // violet
  new THREE.Color(0x77ffbb), // mint
  new THREE.Color(0xff9944), // amber
  new THREE.Color(0xeeff66), // lime
];

for (let i = 0; i < dustCount; i++) {
  const orbitRadius = 8 + Math.random() * 22;
  const orbitSpeed = 0.08 + Math.random() * 0.15;
  const orbitPhase = Math.random() * Math.PI * 2;
  const orbitY = -2 + Math.random() * 22;
  const verticalWave = 0.5 + Math.random() * 2.0;
  const verticalSpeed = 0.3 + Math.random() * 0.5;

  dustPositions[i * 3] = Math.cos(orbitPhase) * orbitRadius;
  dustPositions[i * 3 + 1] = orbitY;
  dustPositions[i * 3 + 2] = Math.sin(orbitPhase) * orbitRadius;

  const col = dustPalette[Math.floor(Math.random() * dustPalette.length)];
  dustColors[i * 3] = col.r;
  dustColors[i * 3 + 1] = col.g;
  dustColors[i * 3 + 2] = col.b;

  dustData.push({
    orbitRadius,
    orbitSpeed: orbitSpeed * (Math.random() > 0.5 ? 1 : -1),
    orbitPhase,
    orbitY,
    verticalWave,
    verticalSpeed
  });
}

dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

const dustMat = new THREE.PointsMaterial({
  size: 0.32,
  vertexColors: true,
  transparent: true,
  opacity: 0.75,
  map: particleTexture,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const dustPoints = new THREE.Points(dustGeo, dustMat);
scene.add(dustPoints);

/* ==========================================================================
   SHOOTING STARS (OCCASIONAL TRAILS)
   ========================================================================== */
const shootingStars = [];
function createShootingStar() {
  const trailCount = 12;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(trailCount * 3);

  const startX = (Math.random() - 0.5) * 200;
  const startY = 40 + Math.random() * 40;
  const startZ = -80 - Math.random() * 60;

  const vx = (Math.random() - 0.5) * 2.5;
  const vy = -(1.5 + Math.random() * 1.5);
  const vz = Math.random() * 1.2;

  for (let i = 0; i < trailCount; i++) {
    positions[i * 3] = startX;
    positions[i * 3 + 1] = startY;
    positions[i * 3 + 2] = startZ;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.6,
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const mesh = new THREE.Points(geo, mat);
  scene.add(mesh);

  shootingStars.push({
    mesh, vx, vy, vz,
    headX: startX, headY: startY, headZ: startZ,
    life: 1.0, trailCount
  });
}

let shootingStarTimer = 0;

/* ==========================================================================
   CLICK INTERACTION, FIREWORKS & WISH MODAL
   ========================================================================== */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let targetCamPos = null;
let targetCamTarget = null;
let activeLantern = null;

// Fireworks
let fireworks = [];
function createFirework(pos) {
  const pCount = 50;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(pCount * 3);
  const velocities = [];

  for (let i = 0; i < pCount; i++) {
    pPositions[i * 3] = pos.x;
    pPositions[i * 3 + 1] = pos.y;
    pPositions[i * 3 + 2] = pos.z;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = 0.08 + Math.random() * 0.12;

    velocities.push(
      new THREE.Vector3(
        speed * Math.sin(phi) * Math.cos(theta),
        speed * Math.sin(phi) * Math.sin(theta),
        speed * Math.cos(phi)
      )
    );
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.38,
    color: 0xffd700,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const pMesh = new THREE.Points(pGeo, pMat);
  scene.add(pMesh);

  fireworks.push({ mesh: pMesh, velocities, life: 1.0 });
}

// Modal DOM Elements
const wishModal = document.getElementById('wishModal');
const wishTitle = document.getElementById('wishTitle');
const wishImage = document.getElementById('wishImage');
const wishText = document.getElementById('wishText');
const wishTag = document.getElementById('wishTag');
const closeWishBtn = document.getElementById('closeWishBtn');
const audioBtn = document.getElementById('audio-btn');

function resetCamera() {
  activeLantern = null;
  // Lerp smoothly back to the default overview position
  targetCamPos = DEFAULT_CAM_POS.clone();
  targetCamTarget = DEFAULT_CAM_TARGET.clone();
  isReturningToDefault = true;
}

function openWishCard(greeting) {
  if (wishTitle) wishTitle.innerText = greeting.title || 'Thông Điệp Gửi Cậu';
  if (wishTag) wishTag.innerText = greeting.wishTag || '✦ Trung Thu An Lành ✦';

  if (wishImage) {
    if (greeting.imgSrc) {
      // Try to load from file first
      wishImage.onerror = () => {
        // File not found – fall back to canvas illustration
        if (midAutumnImages.length > 0) {
          const idx = (greeting.imgIndex !== undefined)
            ? greeting.imgIndex % midAutumnImages.length
            : Math.floor(Math.random() * midAutumnImages.length);
          wishImage.onerror = null;
          wishImage.src = midAutumnImages[idx];
        }
      };
      wishImage.src = greeting.imgSrc;
    } else if (midAutumnImages.length > 0) {
      // No imgSrc defined – use canvas illustration
      const idx = (greeting.imgIndex !== undefined)
        ? greeting.imgIndex % midAutumnImages.length
        : Math.floor(Math.random() * midAutumnImages.length);
      wishImage.src = midAutumnImages[idx];
    }
  }

  if (wishText) {
    wishText.innerHTML = `"${greeting.quote.replace(/\n/g, '<br>')}"`;
  }

  wishModal.classList.add('active');
}

function closeWishCard(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  wishModal.classList.remove('active');
  resetCamera();
}

if (closeWishBtn) {
  closeWishBtn.addEventListener('click', closeWishCard);
  closeWishBtn.addEventListener('touchend', closeWishCard);
}

if (wishModal) {
  wishModal.addEventListener('click', (e) => {
    if (e.target === wishModal) closeWishCard(e);
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeWishCard();
});


// Audio Toggle - Play/Pause MP3 BGM
let isMusicOn = false;

function startMusic() {
  if (!bgmAudio || isMusicOn) return;
  bgmAudio.play().then(() => {
    isMusicOn = true;
    audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  }).catch(() => { /* blocked by browser, will retry on first interaction */ });
}

// Try autoplay immediately
startMusic();

// Fallback: start on first user interaction if autoplay was blocked
function onFirstInteraction() {
  startMusic();
  window.removeEventListener('pointerdown', onFirstInteraction);
  window.removeEventListener('keydown', onFirstInteraction);
}
window.addEventListener('pointerdown', onFirstInteraction);
window.addEventListener('keydown', onFirstInteraction);

audioBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!bgmAudio) return;
  if (isMusicOn) {
    bgmAudio.pause();
    isMusicOn = false;
  } else {
    bgmAudio.play().catch(() => { });
    isMusicOn = true;
  }
  audioBtn.innerHTML = isMusicOn
    ? '<i class="fas fa-volume-up"></i>'
    : '<i class="fas fa-music" style="opacity:0.5;"></i>';
});



// Reset Camera - lerp smoothly back to default view
const resetCamBtn = document.getElementById('reset-cam-btn');
if (resetCamBtn) {
  resetCamBtn.addEventListener('click', () => {
    targetCamPos = DEFAULT_CAM_POS.clone();
    targetCamTarget = DEFAULT_CAM_TARGET.clone();
    activeLantern = null;
  });
}

// Click / Touch Detection
let pointerDownPos = { x: 0, y: 0 };
let isReturningToDefault = false; // track if we're animating back to default

window.addEventListener('pointerdown', (e) => {
  pointerDownPos.x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  pointerDownPos.y = e.clientY || (e.touches && e.touches[0].clientY) || 0;

  // If user touches while camera is returning to default, cancel lerp immediately
  // so OrbitControls gets control right away — no need to wait for animation
  if (isReturningToDefault && targetCamPos) {
    targetCamPos = null;
    targetCamTarget = null;
    isReturningToDefault = false;
    controls.target.copy(DEFAULT_CAM_TARGET);
    controls.update();
  }
}, { passive: true });

window.addEventListener('pointerup', (e) => {
  if (e.target.closest('.top-bar') || e.target.closest('.wish-modal')) return;

  const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
  const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;

  const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);
  if (dist > 8) return;

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactiveLanterns, false);

  if (hits.length > 0) {
    const hitMesh = hits[0].object;
    activeLantern = hitMesh.userData.parentLantern;
    const lPos = activeLantern.position;

    // Sound and fireworks
    playChime();
    createFirework(lPos);

    // Smooth camera fly-in
    const offset = new THREE.Vector3().subVectors(camera.position, lPos).normalize().multiplyScalar(5.5);
    targetCamPos = new THREE.Vector3().addVectors(lPos, offset);
    targetCamTarget = lPos.clone();

    setTimeout(() => {
      openWishCard(activeLantern.userData.greeting);
      // Stop camera lerp so it doesn't keep chasing after modal opens
      targetCamPos = null;
      targetCamTarget = null;
    }, 320);
  }
});

/* ==========================================================================
   ANIMATION LOOP (BUTTER-SMOOTH 60 FPS)
   ========================================================================== */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // 1. Lantern float and gentle swing
  lanterns.forEach(lantern => {
    lantern.position.y += lantern.userData.speedY;
    lantern.position.x =
      lantern.userData.initialX +
      Math.sin(time * lantern.userData.swingSpeed + lantern.userData.id) * 0.4;
    lantern.position.z =
      lantern.userData.initialZ +
      Math.cos(time * lantern.userData.swingSpeed + lantern.userData.id) * 0.4;
    lantern.rotation.y += 0.005;

    if (lantern.position.y > 32) {
      lantern.position.y = -3;
    }
  });

  // 2. Subtle Wind Sway of Tree (Zero CPU vertex cost!)
  treeGroup.rotation.z = Math.sin(time * 0.8) * 0.012;
  treeGroup.rotation.x = Math.cos(time * 0.6) * 0.008;

  // 3. Falling petals
  const pPos = petalGeo.attributes.position.array;
  for (let i = 0; i < petalCount; i++) {
    pPos[i * 3 + 1] -= petalVelocities[i].vy;
    pPos[i * 3] += Math.sin(time + petalVelocities[i].sway) * 0.015;
    pPos[i * 3 + 2] += Math.cos(time + petalVelocities[i].sway) * 0.015;

    if (pPos[i * 3 + 1] < -3) {
      pPos[i * 3 + 1] = 28;
      pPos[i * 3] = (Math.random() - 0.5) * 40;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
  }
  petalGeo.attributes.position.needsUpdate = true;

  // 3b. Animate Colorful Fireflies
  const ffPos = fireflyGeo.attributes.position.array;
  for (let i = 0; i < fireflyCount; i++) {
    const fd = fireflyData[i];
    ffPos[i * 3] = fd.baseX + Math.sin(time * fd.speedX + fd.phase) * fd.amplitude;
    ffPos[i * 3 + 1] = fd.baseY + Math.sin(time * fd.speedY + fd.phase) * fd.amplitude * 0.6;
    ffPos[i * 3 + 2] = fd.baseZ + Math.cos(time * fd.speedZ + fd.phase) * fd.amplitude;
  }
  fireflyGeo.attributes.position.needsUpdate = true;
  fireflyMat.opacity = 0.55 + Math.sin(time * 2.5) * 0.4;

  // 3b2. Animate Magic Dust Ring
  const dPos = dustGeo.attributes.position.array;
  for (let i = 0; i < dustCount; i++) {
    const dd = dustData[i];
    const a = dd.orbitPhase + time * dd.orbitSpeed;
    dPos[i * 3] = Math.cos(a) * dd.orbitRadius;
    dPos[i * 3 + 1] = dd.orbitY + Math.sin(time * dd.verticalSpeed + dd.orbitPhase) * dd.verticalWave;
    dPos[i * 3 + 2] = Math.sin(a) * dd.orbitRadius;
  }
  dustGeo.attributes.position.needsUpdate = true;
  dustMat.opacity = 0.5 + Math.sin(time * 1.8) * 0.25;

  // 3c. Shooting Stars
  shootingStarTimer += delta;
  if (shootingStarTimer > 3.0 + Math.random() * 4.0) {
    createShootingStar();
    shootingStarTimer = 0;
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.headX += ss.vx;
    ss.headY += ss.vy;
    ss.headZ += ss.vz;
    ss.life -= delta * 0.8;

    const sPos = ss.mesh.geometry.attributes.position.array;
    // Shift trail positions back
    for (let j = ss.trailCount - 1; j > 0; j--) {
      sPos[j * 3] = sPos[(j - 1) * 3];
      sPos[j * 3 + 1] = sPos[(j - 1) * 3 + 1];
      sPos[j * 3 + 2] = sPos[(j - 1) * 3 + 2];
    }
    sPos[0] = ss.headX;
    sPos[1] = ss.headY;
    sPos[2] = ss.headZ;
    ss.mesh.geometry.attributes.position.needsUpdate = true;
    ss.mesh.material.opacity = Math.max(0, ss.life);

    if (ss.life <= 0) {
      scene.remove(ss.mesh);
      ss.mesh.geometry.dispose();
      ss.mesh.material.dispose();
      shootingStars.splice(i, 1);
    }
  }

  // 4. Update fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    fw.life -= delta * 1.3;
    const posArr = fw.mesh.geometry.attributes.position.array;

    for (let j = 0; j < fw.velocities.length; j++) {
      posArr[j * 3] += fw.velocities[j].x;
      posArr[j * 3 + 1] += fw.velocities[j].y;
      posArr[j * 3 + 2] += fw.velocities[j].z;
    }
    fw.mesh.geometry.attributes.position.needsUpdate = true;
    fw.mesh.material.opacity = Math.max(0, fw.life);

    if (fw.life <= 0) {
      scene.remove(fw.mesh);
      fw.mesh.geometry.dispose();
      fw.mesh.material.dispose();
      fireworks.splice(i, 1);
    }
  }

  // 5. Animate 5 Rabbits hopping perfectly on the flat island surface (GROUND_Y)
  rabbits.forEach(r => {
    const angle = r.phase + time * r.orbitSpeed;
    const sign = Math.sign(r.orbitSpeed) || 1;

    const x = Math.cos(angle) * r.orbitRadius;
    const z = Math.sin(angle) * r.orbitRadius;
    const hop = Math.abs(Math.sin(time * r.hopSpeed)) * r.hopHeight;

    // Sits directly on GROUND_Y, paws touching flat surface when hop is 0
    r.mesh.position.set(x, GROUND_Y + hop, z);

    const dx = -Math.sin(angle) * sign;
    const dz = Math.cos(angle) * sign;
    r.mesh.rotation.y = Math.atan2(dx, dz);

    r.bodyMesh.rotation.x = Math.sin(time * r.hopSpeed) * 0.16;
    r.earGroup.rotation.x = -Math.sin(time * r.hopSpeed) * 0.14;
  });

  // 6. Smooth Camera Transition (to lantern or back to default)
  if (targetCamPos && targetCamTarget) {
    camera.position.lerp(targetCamPos, 0.07);
    controls.target.lerp(targetCamTarget, 0.07);

    if (camera.position.distanceTo(targetCamPos) < 0.15) {
      camera.position.copy(targetCamPos);
      controls.target.copy(targetCamTarget);
      targetCamPos = null;
      targetCamTarget = null;
      isReturningToDefault = false;
      controls.update();
    }
  }

  // Subtle island floating rotation and bob
  islandGroup.rotation.y = Math.sin(time * 0.15) * 0.03;
  islandGroup.position.y = Math.sin(time * 0.4) * 0.15;

  // 7. Color-pulse accent rim lights for vivid atmosphere
  const hueShift = time * 0.15;
  rimLight1.color.setHSL((0.6 + Math.sin(hueShift) * 0.1) % 1, 0.7, 0.55);
  rimLight2.color.setHSL((0.85 + Math.sin(hueShift + 1.5) * 0.1) % 1, 0.7, 0.55);
  rimLight3.color.setHSL((0.75 + Math.sin(hueShift + 3.0) * 0.12) % 1, 0.65, 0.5);
  rimLight4.color.setHSL((0.4 + Math.sin(hueShift + 4.5) * 0.1) % 1, 0.6, 0.5);

  controls.update();
  renderer.render(scene, camera);
}

// Window resize handling
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.fov = width < 768 ? 55 : 45;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// Dismiss loading screen
window.addEventListener('DOMContentLoaded', () => {
  const loadingProgress = document.getElementById('loading-progress');
  const loadingScreen = document.getElementById('loading-screen');

  if (loadingProgress) loadingProgress.style.width = '100%';
  setTimeout(() => {
    if (loadingScreen) loadingScreen.classList.add('hidden');
  }, 600);
});

// Start loop
animate();
