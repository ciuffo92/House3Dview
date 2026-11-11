// Automated Headless Testing Agent for 3D House Physics, Collisions, Stairs, and Door Access
import * as THREE from 'three';

// Shim browser globals for Node.js execution
if (typeof (global as any).document === 'undefined') {
  (global as any).document = {
    createElement: () => ({
      width: 1024,
      height: 1024,
      getContext: () => ({
        fillRect: () => {},
        strokeRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {},
        arc: () => {},
        createRadialGradient: () => ({ addColorStop: () => {} }),
      }),
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  (global as any).window = global;
  (global as any).performance = { now: () => Date.now() };
}

import { buildHouse } from '../src/three/houseBuilder';
import { HOUSE_DIMENSIONS } from '../src/constants/floorplanData';

console.log('=== STARTING AUTOMATED HOUSE TESTING AGENT ===\n');

const { colliderBoxes, group } = buildHouse();
console.log(`[PASS] Built house geometry. Total collider bounding boxes: ${colliderBoxes.length}`);

// Find mesh for box 84
group.traverse((obj: any) => {
  if (obj.isMesh) {
    const b = new THREE.Box3().setFromObject(obj);
    if (Math.abs(b.min.x) < 0.05 && Math.abs(b.max.x - 0.95) < 0.05 && Math.abs(b.min.z - (-0.18)) < 0.05) {
      console.log(`[FOUND BOX 84] Object:`, obj.name, obj.geometry?.parameters, 'Parent:', obj.parent?.name, obj.parent?.position, obj.parent?.rotation);
    }
  }
});

// Player collision test function
const playerRadius = 0.22;
function checkCollisionAt(x: number, y: number, z: number): { collided: boolean; box?: THREE.Box3 } {
  const isUpper = y > 1.8;
  const testBox = new THREE.Box3(
    new THREE.Vector3(x - playerRadius, y + 0.2, z - playerRadius),
    new THREE.Vector3(x + playerRadius, y + 1.5, z + playerRadius)
  );

  for (const box of colliderBoxes) {
    if (isUpper && box.max.y <= 2.85) continue;
    if (!isUpper && box.min.y >= 2.85) continue;

    if (testBox.intersectsBox(box)) {
      return { collided: true, box };
    }
  }
  return { collided: false };
}

// 1. Test Key Waypoints and Room Centers (Walkable floor areas)
const testWaypoints = [
  { name: 'Piano Terra: Ingresso (Flur)', x: -0.5, y: 0.0, z: 3.2 },
  { name: 'Piano Terra: Dispensa / Spina Ovest', x: -3.6, y: 0.0, z: -0.3 },
  { name: 'Piano Terra: Zona Pranzo (Essen)', x: -0.2, y: 0.0, z: -2.6 },
  { name: 'Piano Terra: Soggiorno (Wohnen)', x: 3.4, y: 0.0, z: -2.1 },
  { name: 'Piano Terra: Alloggio Ospiti (Living)', x: 1.8, y: 0.0, z: 2.2 },
  { name: 'Piano Terra: Piede della scala', x: 0.4, y: 0.0, z: 1.8 },
  
  // Upper floor
  { name: '1° Piano: Sbarco scala (North landing)', x: 0.4, y: 3.0, z: -0.85 },
  { name: '1° Piano: Galleria (Balconata affaccio vuoto)', x: 0.5, y: 3.0, z: -1.05 },
  { name: '1° Piano: Corridoio Ovest', x: -0.6, y: 3.0, z: 0.2 },
  { name: '1° Piano: Ingresso Camera Padronale', x: -0.6, y: 3.0, z: 1.2 },
  { name: '1° Piano: Camera Padronale (Fianco Letto)', x: -1.0, y: 3.0, z: 2.5 },
  { name: '1° Piano: Cabina Armadio (Ankleide)', x: -3.2, y: 3.0, z: 0.2 },
  { name: '1° Piano: Bagno Padronale (Pavimento)', x: -2.0, y: 3.0, z: -1.5 },
  { name: '1° Piano: Camera 1 (Kind I)', x: 3.7, y: 3.0, z: -2.5 },
  { name: '1° Piano: Studio (Büro)', x: 2.7, y: 3.0, z: 0.3 },
  { name: '1° Piano: Corridoio Est verso Camera 2', x: 1.5, y: 3.0, z: 1.0 },
  { name: '1° Piano: Porta d\'ingresso Camera 2', x: 1.5, y: 3.0, z: 1.4 },
  { name: '1° Piano: Dentro Camera 2 (Kind II)', x: 2.7, y: 3.0, z: 2.8 },
];

console.log('\n--- TESTING KEY WAYPOINTS & ROOM CLEARANCES ---');
let waypointFailures = 0;
for (const wp of testWaypoints) {
  const result = checkCollisionAt(wp.x, wp.y, wp.z);
  if (result.collided) {
    console.error(`[FAIL] Collision detected at "${wp.name}" (${wp.x}, ${wp.y}, ${wp.z})! Box:`, result.box);
    waypointFailures++;
  } else {
    console.log(`[PASS] Clear at "${wp.name}" (${wp.x}, ${wp.y}, ${wp.z})`);
  }
}

// Test Ground Floor Living Room Path (Entrance -> Hallway -> Open Dining -> Living Room)
console.log('\n--- TESTING GROUND FLOOR LIVING ROOM PATH ---');
let livingPathBlocked = false;

// Segment 1: Walk north through hallway from Entrance Z=2.0 to Dining room Z=-2.0 at X=-0.5
for (let z = 2.0; z >= -2.0; z -= 0.1) {
  const res = checkCollisionAt(-0.5, 0.0, z);
  if (res.collided) {
    console.error(`[FAIL] Hallway to Dining blocked at X=-0.5, Z=${z.toFixed(2)} by box:`, res.box);
    livingPathBlocked = true;
    break;
  }
}

// Segment 2: Walk east from Dining X=-0.5 to Living Room X=3.4 at Z=-2.0
if (!livingPathBlocked) {
  for (let x = -0.5; x <= 3.4; x += 0.1) {
    const res = checkCollisionAt(x, 0.0, -2.0);
    if (res.collided) {
      console.error(`[FAIL] Open plan Dining to Living blocked at X=${x.toFixed(2)}, Z=-2.0 by box:`, res.box);
      livingPathBlocked = true;
      break;
    }
  }
}

if (!livingPathBlocked) {
  console.log('[PASS] Ground floor walk from Entrance through Dining into Living Room is 100% clear and unblocked!');
}

// 2. Test Step-by-Step Stair Ascent
console.log('\n--- TESTING STEP-BY-STEP STAIR ASCENT ---');
const stair = HOUSE_DIMENSIONS.stair;
let stairBlocked = false;
for (let z = stair.maxZ; z >= stair.minZ - 0.3; z -= 0.05) {
  const t = Math.max(0, Math.min(1, (stair.maxZ - z) / (stair.maxZ - stair.minZ)));
  const y = t * HOUSE_DIMENSIONS.firstFloorY;
  const x = (stair.minX + stair.maxX) / 2; // Center of stair, ~0.4

  const isUpper = y > 1.8;
  const testBox = new THREE.Box3(
    new THREE.Vector3(x - playerRadius, y + 0.2, z - playerRadius),
    new THREE.Vector3(x + playerRadius, y + 1.5, z + playerRadius)
  );

  let hit = false;
  for (const box of colliderBoxes) {
    if (isUpper && box.max.y <= 2.85) continue;
    if (!isUpper && box.min.y >= 2.85) continue;
    if (testBox.intersectsBox(box)) {
      console.error(`[FAIL] Stair ascent blocked at Z=${z.toFixed(2)}, Y=${y.toFixed(2)} by box:`, box);
      hit = true;
      stairBlocked = true;
      break;
    }
  }
  if (hit) break;
}
if (!stairBlocked) {
  console.log('[PASS] Full stair ascent from Z=1.8 (Y=0.0) to Z=-1.1 (Y=3.0) is completely clear and unblocked!');
}

// 3. Test Door Access into Camera 2 (Kind II)
console.log('\n--- TESTING ACCESS INTO ALL UPPER ROOMS VIA DOORS ---');

// Doorway into Camera 2: Walk from hallway Z=0.8 down to Z=2.2 along X=1.5
let kind2Blocked = false;
for (let z = 0.8; z <= 2.2; z += 0.05) {
  const result = checkCollisionAt(1.5, 3.0, z);
  if (result.collided) {
    console.error(`[FAIL] Doorway to Camera 2 blocked at X=1.5, Z=${z.toFixed(2)} by box:`, result.box);
    kind2Blocked = true;
    break;
  }
}
if (!kind2Blocked) {
  console.log('[PASS] Doorway into Camera 2 (Kind II) along X=1.5 is 100% open and navigable!');
}

// Doorway into Master Bedroom (Eltern): Walk along X=-0.6 from Z=0.8 to Z=2.0
let elternBlocked = false;
for (let z = 0.8; z <= 2.0; z += 0.05) {
  const result = checkCollisionAt(-0.6, 3.0, z);
  if (result.collided) {
    console.error(`[FAIL] Doorway to Master Bedroom blocked at X=-0.6, Z=${z.toFixed(2)} by box:`, result.box);
    elternBlocked = true;
    break;
  }
}
if (!elternBlocked) {
  console.log('[PASS] Doorway into Master Bedroom (Eltern) along X=-0.6 is 100% open and navigable!');
}

// Doorway into Studio (Büro): Walk from hallway X=1.5 to X=2.7 along Z=0.3
let bueroBlocked = false;
for (let x = 1.5; x <= 2.7; x += 0.05) {
  const result = checkCollisionAt(x, 3.0, 0.3);
  if (result.collided) {
    console.error(`[FAIL] Doorway to Studio (Büro) blocked at X=${x.toFixed(2)}, Z=0.3 by box:`, result.box);
    bueroBlocked = true;
    break;
  }
}
if (!bueroBlocked) {
  console.log('[PASS] Doorway into Studio (Büro) along Z=0.3 is 100% open and navigable!');
}

// Doorway into Camera 1 (Kind I): Walk from hallway X=1.5 to X=2.7 along Z=-2.0
let kind1Blocked = false;
for (let x = 1.5; x <= 2.7; x += 0.05) {
  const result = checkCollisionAt(x, 3.0, -2.0);
  if (result.collided) {
    console.error(`[FAIL] Doorway to Camera 1 (Kind I) blocked at X=${x.toFixed(2)}, Z=-2.0 by box:`, result.box);
    kind1Blocked = true;
    break;
  }
}
if (!kind1Blocked) {
  console.log('[PASS] Doorway into Camera 1 (Kind I) along Z=-2.0 is 100% open and navigable!');
}

// Doorway into Master Bathroom (Bad): Walk from hallway X=-0.6 to X=-1.8 along Z=-2.0
let badBlocked = false;
for (let x = -0.6; x >= -1.8; x -= 0.05) {
  const result = checkCollisionAt(x, 3.0, -2.0);
  if (result.collided) {
    console.error(`[FAIL] Doorway to Master Bathroom (Bad) blocked at X=${x.toFixed(2)}, Z=-2.0 by box:`, result.box);
    badBlocked = true;
    break;
  }
}
if (!badBlocked) {
  console.log('[PASS] Doorway into Master Bathroom (Bad) along Z=-2.0 is 100% open and navigable!');
}

// Doorway into Walk-in Closet (Ankleide): Walk from hallway X=-0.6 to X=-2.0 along Z=0.2
let ankleiBlocked = false;
for (let x = -0.6; x >= -2.0; x -= 0.05) {
  const result = checkCollisionAt(x, 3.0, 0.2);
  if (result.collided) {
    console.error(`[FAIL] Doorway to Walk-in Closet (Ankleide) blocked at X=${x.toFixed(2)}, Z=0.2 by box:`, result.box);
    ankleiBlocked = true;
    break;
  }
}
if (!ankleiBlocked) {
  console.log('[PASS] Doorway into Walk-in Closet (Ankleide) along Z=0.2 is 100% open and navigable!');
}

console.log('\n=== TESTING AGENT SUMMARY ===');
const allDoorsClear = !kind2Blocked && !elternBlocked && !bueroBlocked && !kind1Blocked && !badBlocked && !ankleiBlocked;
if (waypointFailures === 0 && !stairBlocked && allDoorsClear) {
  console.log('[SUCCESS] ALL TESTS PASSED! ZERO ERRORS DETECTED ACROSS ALL ROOMS, STAIRS, AND DOORS.');
} else {
  console.error('[ERROR] Some tests failed! Review outputs above.');
  process.exit(1);
}
