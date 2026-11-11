import * as THREE from 'three';
import {
  HOUSE_DIMENSIONS,
  GROUND_WALLS,
  FIRST_WALLS,
} from '../constants/floorplanData';
import {
  createDarkPolishedTileTexture,
  createNaturalOakTexture,
  createSmokedOakTexture,
  createMarbleTexture,
  createFireplaceTexture,
  createRugTexture,
  createBookshelfTexture,
} from './proceduralTextures';
import { WallDef } from '../types';

export interface HouseBuildResult {
  group: THREE.Group;
  colliderBoxes: THREE.Box3[];
  ceilingGroup: THREE.Group;
  stairBoundingBox: THREE.Box3;
  lightsGroup: THREE.Group;
}

export function buildHouse(): HouseBuildResult {
  const root = new THREE.Group();
  root.name = 'NextGenHouseRoot';

  const colliderBoxes: THREE.Box3[] = [];
  const obstacleMeshes: THREE.Object3D[] = [];
  const ceilingGroup = new THREE.Group();
  ceilingGroup.name = 'CeilingsAndRoof';
  const lightsGroup = new THREE.Group();
  lightsGroup.name = 'AtmosphericLighting';

  // --- 1. Procedural Textures ---
  const darkGresTexture = createDarkPolishedTileTexture();
  darkGresTexture.repeat.set(5, 4);

  const naturalOakTexture = createNaturalOakTexture();
  naturalOakTexture.repeat.set(4, 4);

  const smokedOakTexture = createSmokedOakTexture();
  smokedOakTexture.repeat.set(4, 4);

  const marbleTexture = createMarbleTexture();
  const fireTexture = createFireplaceTexture();
  const rugTexture = createRugTexture();
  const bookshelfTexture = createBookshelfTexture();

  // --- 2. AAA Next-Gen PBR Materials ---
  // Ground floor: Ultra high-gloss dark anthracite porcelain floor (GTA V / Cyberpunk penthouse look)
  const polishedGresFloorMat = new THREE.MeshStandardMaterial({
    map: darkGresTexture,
    roughness: 0.12, // High specular gloss with razor-sharp ceiling and window reflections
    metalness: 0.22,
  });

  // First floor: Warm Nordic honey oak parquet (matching Attachment 3 3D render)
  const naturalOakMat = new THREE.MeshStandardMaterial({
    map: naturalOakTexture,
    roughness: 0.22,
    metalness: 0.08,
  });

  // Smoked oak for staircase treads and accents
  const smokedOakMat = new THREE.MeshStandardMaterial({
    map: smokedOakTexture,
    roughness: 0.28,
    metalness: 0.05,
  });

  // Matte architectural plaster walls (anti-glare, pristine finish)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.85,
    metalness: 0.02,
  });

  // Modern microcement / slate accent walls
  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    metalness: 0.05,
  });

  // Exterior insulated facade
  const extWallMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.85,
    metalness: 0.02,
  });

  // Ceilings (matte pure white)
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  // Semi-transparent architectural glazing
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.32,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.52,
  });

  // Dark matte anodized aluminum window & door frames
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.8,
  });

  // White lacquered door leaf material
  const doorLeafMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.3,
    metalness: 0.05,
  });

  // Brass / Gold metal accents
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.9,
  });

  // Calacatta White Marble (Kitchen & Master Bathroom)
  const marbleMat = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    roughness: 0.18,
    metalness: 0.05,
  });

  // Matte black cabinetry & electronics
  const matteBlackMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.4,
    metalness: 0.7,
  });

  // Walnut luxury wood accents
  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x5c3d2e,
    roughness: 0.35,
    metalness: 0.05,
  });

  // Light oak furniture wood (Galerie table, loft ladders, study desks)
  const lightOakMat = new THREE.MeshStandardMaterial({
    color: 0xd9b78c,
    roughness: 0.4,
    metalness: 0.02,
  });

  // Premium charcoal bouclé fabric for sectional sofa
  const sofaFabricMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    metalness: 0.0,
  });

  // White bedding fabric
  const bedLinenMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.85,
    metalness: 0.0,
  });

  // Mustard accent pillow
  const mustardMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.8,
    metalness: 0.0,
  });

  // ==========================================
  // 3. EXTERIOR ENVIRONMENT (TERRACE & GARDEN)
  // ==========================================
  const terraceGeo = new THREE.BoxGeometry(26, 0.25, 24);
  const terraceMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.7,
  });
  const terrace = new THREE.Mesh(terraceGeo, terraceMat);
  terrace.position.set(0, -0.15, 0);
  terrace.receiveShadow = true;
  root.add(terrace);

  const gardenGeo = new THREE.PlaneGeometry(90, 90);
  const gardenMat = new THREE.MeshStandardMaterial({
    color: 0x1b2e24,
    roughness: 0.9,
  });
  const garden = new THREE.Mesh(gardenGeo, gardenMat);
  garden.rotation.x = -Math.PI / 2;
  garden.position.set(0, -0.28, 0);
  garden.receiveShadow = true;
  root.add(garden);

  // Exterior terrace decorative planters
  const planterGeo = new THREE.BoxGeometry(7.0, 0.6, 0.5);
  const planterMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
  const planterN = new THREE.Mesh(planterGeo, planterMat);
  planterN.position.set(0, 0.3, -7.5);
  root.add(planterN);

  const hedgeGeo = new THREE.BoxGeometry(6.8, 1.2, 0.45);
  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
  const hedgeN = new THREE.Mesh(hedgeGeo, hedgeMat);
  hedgeN.position.set(0, 1.1, -7.5);
  hedgeN.castShadow = true;
  root.add(hedgeN);

  // ==========================================
  // 4. GROUND FLOOR BASE & HIGH-GLOSS SLAB
  // ==========================================
  const groundFloorGroup = new THREE.Group();
  groundFloorGroup.name = 'GroundFloor';

  // Master high-gloss dark polished floor (Z: -4.3 to 4.3, X: -5.4 to 5.4)
  const groundFloorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(HOUSE_DIMENSIONS.width, HOUSE_DIMENSIONS.depth),
    polishedGresFloorMat
  );
  groundFloorMesh.rotation.x = -Math.PI / 2;
  groundFloorMesh.position.set(0, 0.005, 0);
  groundFloorMesh.receiveShadow = true;
  groundFloorGroup.add(groundFloorMesh);

  // Smoked oak zone in guest bedroom area
  const guestBedFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 2.7),
    smokedOakMat
  );
  guestBedFloor.rotation.x = -Math.PI / 2;
  guestBedFloor.position.set(4.05, 0.008, 2.95);
  guestBedFloor.receiveShadow = true;
  groundFloorGroup.add(guestBedFloor);

  // Luxury area rug in living room
  const livingRug = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 2.4),
    new THREE.MeshStandardMaterial({ map: rugTexture, roughness: 0.92 })
  );
  livingRug.rotation.x = -Math.PI / 2;
  livingRug.position.set(3.4, 0.012, -2.1);
  groundFloorGroup.add(livingRug);

  root.add(groundFloorGroup);

  // ==========================================
  // 5. WALL BUILDER WITH DOORS & WINDOWS
  // ==========================================
  const buildWallWithOpenings = (
    wall: WallDef,
    baseY: number,
    defaultHeight: number,
    targetGroup: THREE.Group,
    customMat?: THREE.Material
  ) => {
    const dx = wall.x2 - wall.x1;
    const dz = wall.z2 - wall.z1;
    const wallLength = Math.hypot(dx, dz);
    if (wallLength < 0.05) return;

    const angle = Math.atan2(dz, dx);
    const thickness = wall.thickness || (wall.isExterior ? 0.36 : 0.16);
    const height = wall.height || defaultHeight;
    const mat = customMat || (wall.isExterior ? extWallMat : wallMat);

    const wallGroup = new THREE.Group();
    wallGroup.position.set(wall.x1, baseY, wall.z1);
    wallGroup.rotation.y = -angle;

    const addSegment = (
      startLocalX: number,
      endLocalX: number,
      localYBottom: number,
      localYTop: number,
      segmentMat = mat,
      castsShadow = true
    ) => {
      const segLength = endLocalX - startLocalX;
      const segHeight = localYTop - localYBottom;
      if (segLength <= 0.01 || segHeight <= 0.01) return;

      const geo = new THREE.BoxGeometry(segLength, segHeight, thickness);
      const mesh = new THREE.Mesh(geo, segmentMat);
      mesh.position.set(
        startLocalX + segLength / 2,
        localYBottom + segHeight / 2,
        0
      );
      mesh.castShadow = castsShadow;
      mesh.receiveShadow = true;
      wallGroup.add(mesh);
      obstacleMeshes.push(mesh);
    };

    // Thin dark aluminum baseboard along interior walls
    if (!wall.isExterior) {
      const baseboardGeo = new THREE.BoxGeometry(wallLength, 0.07, thickness + 0.02);
      const baseboard = new THREE.Mesh(baseboardGeo, frameMat);
      baseboard.position.set(wallLength / 2, 0.035, 0);
      wallGroup.add(baseboard);
    }

    if (wall.hasDoor) {
      const dWidth = wall.doorWidth || 0.9;
      const dHeight = wall.doorHeight || 2.15;
      const dCenter = (wall.doorPos ?? 0.5) * wallLength;
      const dStart = Math.max(0, dCenter - dWidth / 2);
      const dEnd = Math.min(wallLength, dCenter + dWidth / 2);

      if (dStart > 0.04) addSegment(0, dStart, 0, height);
      if (height > dHeight) addSegment(dStart, dEnd, dHeight, height);
      if (wallLength - dEnd > 0.04) addSegment(dEnd, wallLength, 0, height);

      // Aluminum door casing frame
      const casingThick = 0.04;
      const frameL = new THREE.Mesh(
        new THREE.BoxGeometry(casingThick, dHeight, thickness + 0.03),
        frameMat
      );
      frameL.position.set(dStart + casingThick / 2, dHeight / 2, 0);
      wallGroup.add(frameL);

      const frameR = new THREE.Mesh(
        new THREE.BoxGeometry(casingThick, dHeight, thickness + 0.03),
        frameMat
      );
      frameR.position.set(dEnd - casingThick / 2, dHeight / 2, 0);
      wallGroup.add(frameR);

      const frameT = new THREE.Mesh(
        new THREE.BoxGeometry(dWidth, casingThick, thickness + 0.03),
        frameMat
      );
      frameT.position.set(dStart + dWidth / 2, dHeight - casingThick / 2, 0);
      wallGroup.add(frameT);

      // 3D Realistic Open Door Leaf (Swung open at 65 degrees into the room)
      const doorLeafWidth = dWidth - casingThick * 2;
      const doorLeafHeight = dHeight - casingThick;
      const doorLeafThick = 0.04;

      const doorLeafGroup = new THREE.Group();
      doorLeafGroup.position.set(dStart + casingThick, 0, 0);
      // Hinge rotation: swing open into room
      doorLeafGroup.rotation.y = Math.PI * 0.38;

      const doorSlab = new THREE.Mesh(
        new THREE.BoxGeometry(doorLeafWidth, doorLeafHeight, doorLeafThick),
        doorLeafMat
      );
      doorSlab.position.set(doorLeafWidth / 2, doorLeafHeight / 2, 0);
      doorSlab.castShadow = true;
      doorLeafGroup.add(doorSlab);

      // Sleek matte black lever handle
      const handleBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12),
        frameMat
      );
      handleBase.rotation.x = Math.PI / 2;
      handleBase.position.set(doorLeafWidth - 0.08, 1.0, 0.03);
      doorLeafGroup.add(handleBase);

      const handleLever = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.015, 0.025),
        frameMat
      );
      handleLever.position.set(doorLeafWidth - 0.02, 1.0, 0.045);
      doorLeafGroup.add(handleLever);

      wallGroup.add(doorLeafGroup);
    } else if (wall.hasWindow) {
      const wWidth = wall.windowWidth || 1.6;
      const wHeight = wall.windowHeight || 1.6;
      const wBottom = wall.windowBottom || 0.8;
      const wCenter = (wall.windowPos ?? 0.5) * wallLength;
      const wStart = Math.max(0, wCenter - wWidth / 2);
      const wEnd = Math.min(wallLength, wCenter + wWidth / 2);
      const wTop = wBottom + wHeight;

      if (wStart > 0.04) addSegment(0, wStart, 0, height);
      if (wBottom > 0.04) addSegment(wStart, wEnd, 0, wBottom);
      if (height > wTop) addSegment(wStart, wEnd, wTop, height);
      if (wallLength - wEnd > 0.04) addSegment(wEnd, wallLength, 0, height);

      // Glass pane
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(wWidth - 0.08, wHeight - 0.08, 0.02),
        glassMat
      );
      glass.position.set(wStart + wWidth / 2, wBottom + wHeight / 2, 0);
      wallGroup.add(glass);

      // Window outer frame
      const frameOuter = new THREE.Mesh(
        new THREE.BoxGeometry(wWidth, wHeight, 0.08),
        frameMat
      );
      frameOuter.position.set(wStart + wWidth / 2, wBottom + wHeight / 2, 0);
      wallGroup.add(frameOuter);

      // Window mullion bar
      const mullion = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, wHeight, 0.09),
        frameMat
      );
      mullion.position.set(wStart + wWidth / 2, wBottom + wHeight / 2, 0);
      wallGroup.add(mullion);
    } else {
      addSegment(0, wallLength, 0, height);
    }

    targetGroup.add(wallGroup);
  };

  // Build Ground Floor Walls
  GROUND_WALLS.forEach((wall) => {
    buildWallWithOpenings(
      wall,
      0,
      HOUSE_DIMENSIONS.groundFloorHeight,
      groundFloorGroup
    );
  });

  // ==========================================
  // 6. CENTRAL STAIRCASE (LUXURY ARCHITECTURAL)
  // ==========================================
  const stairGroup = new THREE.Group();
  stairGroup.name = 'LuxuryStairs';

  const stairConfig = HOUSE_DIMENSIONS.stair;
  const numSteps = stairConfig.steps;
  const totalRise = HOUSE_DIMENSIONS.firstFloorY; // 3.0m
  const totalRun = stairConfig.maxZ - stairConfig.minZ; // 2.6m
  const stepRise = totalRise / numSteps; // ~0.1875m
  const stepRun = totalRun / numSteps; // ~0.1625m
  const stairWidth = stairConfig.maxX - stairConfig.minX; // 1.2m

  const stairTreadMat = new THREE.MeshStandardMaterial({
    map: smokedOakTexture,
    roughness: 0.22,
    metalness: 0.1,
  });

  const stairRiserMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.4,
  });

  const stairLedMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  for (let i = 0; i < numSteps; i++) {
    const yBottom = i * stepRise;
    const yTop = (i + 1) * stepRise;
    const zFront = stairConfig.maxZ - i * stepRun;
    const zBack = stairConfig.maxZ - (i + 1) * stepRun;
    const zCenter = (zFront + zBack) / 2;
    const xCenter = (stairConfig.minX + stairConfig.maxX) / 2;

    // Tread
    const treadMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stairWidth, 0.04, stepRun + 0.03),
      stairTreadMat
    );
    treadMesh.position.set(xCenter, yTop - 0.02, zCenter);
    treadMesh.castShadow = true;
    treadMesh.receiveShadow = true;
    stairGroup.add(treadMesh);

    // Riser
    const riserMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stairWidth, stepRise, 0.03),
      stairRiserMat
    );
    riserMesh.position.set(xCenter, yBottom + stepRise / 2, zFront);
    stairGroup.add(riserMesh);

    // Subtle LED under-tread strip glow
    if (i % 2 === 0) {
      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(stairWidth - 0.1, 0.015, 0.02),
        stairLedMat
      );
      ledStrip.position.set(xCenter, yTop - 0.04, zFront - 0.02);
      stairGroup.add(ledStrip);
    }
  }

  // Steel handrail bar
  const stairRailLen = Math.hypot(totalRun, totalRise);
  const stairRailAngle = Math.atan2(totalRise, totalRun);

  const handrailBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, stairRailLen, 12),
    frameMat
  );
  handrailBar.rotation.x = Math.PI / 2 + stairRailAngle;
  handrailBar.position.set(
    stairConfig.maxX - 0.04,
    totalRise / 2 + 0.9,
    (stairConfig.minZ + stairConfig.maxZ) / 2
  );
  stairGroup.add(handrailBar);

  root.add(stairGroup);

  const stairBoundingBox = new THREE.Box3(
    new THREE.Vector3(stairConfig.minX - 0.1, 0, stairConfig.minZ - 0.2),
    new THREE.Vector3(stairConfig.maxX + 0.1, HOUSE_DIMENSIONS.firstFloorY + 0.2, stairConfig.maxZ + 0.3)
  );

  // ==========================================
  // 7. INTERMEDIATE SLAB & FIRST FLOOR
  // ==========================================
  const firstFloorGroup = new THREE.Group();
  firstFloorGroup.name = 'FirstFloor';

  // Slabs with stairwell cutout (open stair shaft: X from -0.2 to 1.0, Z from -0.8 to 1.8)
  const addSlabBlock = (minX: number, maxX: number, minZ: number, maxZ: number) => {
    const sw = maxX - minX;
    const sd = maxZ - minZ;
    if (sw <= 0 || sd <= 0) return;

    // Concrete core / Ground ceiling
    const slabCore = new THREE.Mesh(
      new THREE.BoxGeometry(sw, HOUSE_DIMENSIONS.slabThickness, sd),
      ceilingMat
    );
    slabCore.position.set(
      minX + sw / 2,
      HOUSE_DIMENSIONS.firstFloorY - HOUSE_DIMENSIONS.slabThickness / 2,
      minZ + sd / 2
    );
    slabCore.receiveShadow = true;
    firstFloorGroup.add(slabCore);

    // Warm Nordic honey oak parquet floor finish on top
    const finish = new THREE.Mesh(
      new THREE.PlaneGeometry(sw, sd),
      naturalOakMat
    );
    finish.rotation.x = -Math.PI / 2;
    finish.position.set(
      minX + sw / 2,
      HOUSE_DIMENSIONS.firstFloorY + 0.005,
      minZ + sd / 2
    );
    finish.receiveShadow = true;
    firstFloorGroup.add(finish);
  };

  // --- First Floor Slabs with Stairwell & Galerie Double-Height Void Cutouts ---
  // The Galerie (X: -1.0 to 2.0, Z: -4.3 to -1.3) is an OPEN DOUBLE-HEIGHT VOID (Luftraum)
  // overlooking the ground floor dining table (Essen) below!

  // 1. West Wing (Master Bathroom, Walk-in Closet, Master Bedroom)
  // 1a. Master Bathroom (Bad): X from -5.4 to -1.0, Z from -4.3 to -0.8
  addSlabBlock(HOUSE_DIMENSIONS.minX, -1.0, HOUSE_DIMENSIONS.minZ, -0.8);
  // 1b. Ankleidezimmer & Eltern: X from -5.4 to stairConfig.minX (-0.2), Z from -0.8 to 4.3
  addSlabBlock(HOUSE_DIMENSIONS.minX, stairConfig.minX, -0.8, HOUSE_DIMENSIONS.maxZ);

  // 2. East Wing (Kind I, Büro, Kind II)
  // 2a. Kind I (Bedroom 1): X from 2.0 to 5.4, Z from -4.3 to -0.8
  addSlabBlock(2.0, HOUSE_DIMENSIONS.maxX, HOUSE_DIMENSIONS.minZ, -0.8);
  // 2b. Büro & Kind II: X from stairConfig.maxX (1.0) to 5.4, Z from -0.8 to 4.3
  addSlabBlock(stairConfig.maxX, HOUSE_DIMENSIONS.maxX, -0.8, HOUSE_DIMENSIONS.maxZ);

  // 3. Central Walkways & Landings
  // 3a. North Stair Landing & Galerie Viewing Walkway: X from -1.0 to 2.0, Z from -1.3 to -0.8
  // This connects the stair landing to Bad, Ankleide, Kind I, and provides the viewing balcony!
  addSlabBlock(-1.0, 2.0, -1.3, -0.8);
  // 3b. South Hallway between Eltern and Kind II: X from stairConfig.minX (-0.2) to stairConfig.maxX (1.0), Z from stairConfig.maxZ (1.8) to 4.3
  addSlabBlock(stairConfig.minX, stairConfig.maxX, stairConfig.maxZ, HOUSE_DIMENSIONS.maxZ);

  // (Notice: Area X from -1.0 to 2.0, Z from -4.3 to -1.3 HAS NO SLAB -> OPEN DOUBLE-HEIGHT VOID over Essen dining table!)
  // (Notice: Area X from -0.2 to 1.0, Z from -0.8 to 1.8 HAS NO SLAB -> OPEN STAIRWELL SHAFT!)

  // Master Bathroom luxury Calacatta marble floor on 1st Floor
  const masterBathW = -1.0 - (-5.4);
  const masterBathD = -0.8 - (-4.3);
  const bathFloorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(masterBathW, masterBathD),
    marbleMat
  );
  bathFloorMesh.rotation.x = -Math.PI / 2;
  bathFloorMesh.position.set(-5.4 + masterBathW / 2, HOUSE_DIMENSIONS.firstFloorY + 0.008, -4.3 + masterBathD / 2);
  bathFloorMesh.receiveShadow = true;
  firstFloorGroup.add(bathFloorMesh);

  // First Floor Stairwell & Galerie safety glass balustrades:
  // Balustrades along WEST side (X = -0.2), EAST side (X = 1.0),
  // and NORTH Galerie viewing balustrade overlooking the dining room below (Z = -1.3, X from -1.0 to 2.0)
  const buildUpperGlassRailing = (x1: number, z1: number, x2: number, z2: number) => {
    const rLen = Math.hypot(x2 - x1, z2 - z1);
    const rAngle = Math.atan2(z2 - z1, x2 - x1);
    const rGroup = new THREE.Group();
    rGroup.position.set(x1, HOUSE_DIMENSIONS.firstFloorY, z1);
    rGroup.rotation.y = -rAngle;

    const gMesh = new THREE.Mesh(new THREE.BoxGeometry(rLen - 0.02, 0.95, 0.025), glassMat);
    gMesh.position.set(rLen / 2, 0.48, 0);
    rGroup.add(gMesh);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(rLen, 0.035, 0.06), frameMat);
    cap.position.set(rLen / 2, 0.96, 0);
    rGroup.add(cap);

    firstFloorGroup.add(rGroup);
    obstacleMeshes.push(gMesh);
  };

  buildUpperGlassRailing(stairConfig.minX, stairConfig.maxZ, stairConfig.minX, stairConfig.minZ); // West stair rail
  buildUpperGlassRailing(stairConfig.maxX, stairConfig.minZ, stairConfig.maxX, 1.4); // East stair rail up to Kind II door
  buildUpperGlassRailing(-1.0, -1.3, 2.0, -1.3); // North viewing rail along Galerie walkway overlooking dining room below

  // Build First Floor Walls
  FIRST_WALLS.forEach((wall) => {
    buildWallWithOpenings(
      wall,
      HOUSE_DIMENSIONS.firstFloorY,
      HOUSE_DIMENSIONS.firstFloorHeight,
      firstFloorGroup
    );
  });

  root.add(firstFloorGroup);

  // ==========================================
  // 8. ROOF & UPPER CEILINGS (TOGGLEABLE)
  // ==========================================
  const roofMesh = new THREE.Mesh(
    new THREE.BoxGeometry(HOUSE_DIMENSIONS.width + 0.4, 0.25, HOUSE_DIMENSIONS.depth + 0.4),
    ceilingMat
  );
  roofMesh.position.set(0, HOUSE_DIMENSIONS.roofY + 0.12, 0);
  roofMesh.castShadow = true;
  roofMesh.receiveShadow = true;
  ceilingGroup.add(roofMesh);

  root.add(ceilingGroup);

  // ==========================================
  // 9. HIGH-END PENTHOUSE FURNITURE & FIXTURES
  // ==========================================
  const furnGroup = new THREE.Group();
  furnGroup.name = 'LuxuryFurniture';

  // ------------------------------------------
  // A. LIVING ROOM (Wohnen - 19.8 m²)
  // ------------------------------------------
  const livingGroup = new THREE.Group();
  livingGroup.position.set(3.4, 0, -2.1);

  // Sectional sofa in premium charcoal bouclé
  const sofaBase1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.38, 0.95), sofaFabricMat);
  sofaBase1.position.set(0, 0.19, -0.6);
  sofaBase1.castShadow = true;
  livingGroup.add(sofaBase1);

  const sofaBack1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.42, 0.22), sofaFabricMat);
  sofaBack1.position.set(0, 0.58, -0.98);
  sofaBack1.castShadow = true;
  livingGroup.add(sofaBack1);

  // L-shaped chaise lounge return
  const sofaBase2 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.38, 1.6), sofaFabricMat);
  sofaBase2.position.set(0.825, 0.19, 0.5);
  sofaBase2.castShadow = true;
  livingGroup.add(sofaBase2);

  // Decorative sofa accent pillows (mustard and cream)
  const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.12), mustardMat);
  pillow1.position.set(-0.7, 0.45, -0.85);
  pillow1.rotation.set(0.1, 0.2, 0.05);
  livingGroup.add(pillow1);

  const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.12), bedLinenMat);
  pillow2.position.set(0.2, 0.45, -0.85);
  pillow2.rotation.set(0.1, -0.15, -0.05);
  livingGroup.add(pillow2);

  // Luxury Calacatta marble coffee table
  const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.7), marbleMat);
  coffeeTable.position.set(-0.1, 0.16, 0.4);
  coffeeTable.castShadow = true;
  livingGroup.add(coffeeTable);

  // Coffee table art books & brass bowl
  const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.22), frameMat);
  bookMesh.position.set(-0.25, 0.34, 0.4);
  livingGroup.add(bookMesh);

  const bowlMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.05, 16), brassMat);
  bowlMesh.position.set(0.2, 0.345, 0.42);
  livingGroup.add(bowlMesh);

  // Designer indoor fiddle leaf fig plant in ceramic pot
  const potMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.45, 16), wallMat);
  potMesh.position.set(-1.4, 0.225, -1.0);
  livingGroup.add(potMesh);

  const plantMesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.35, 1),
    new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 })
  );
  plantMesh.position.set(-1.4, 0.72, -1.0);
  livingGroup.add(plantMesh);

  furnGroup.add(livingGroup);

  // --- Fireplace (Kamin) with Amber Glow ---
  const kaminGroup = new THREE.Group();
  kaminGroup.position.set(4.8, 0, -0.4);

  const kaminPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), accentWallMat);
  kaminPillar.position.set(0, 1.4, 0);
  kaminPillar.castShadow = true;
  kaminGroup.add(kaminPillar);
  obstacleMeshes.push(kaminPillar);

  const fireBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.45, 0.55),
    new THREE.MeshBasicMaterial({ map: fireTexture })
  );
  fireBox.position.set(-0.14, 0.65, -0.14);
  kaminGroup.add(fireBox);

  const firePointLight = new THREE.PointLight(0xf97316, 2.5, 6.0, 2);
  firePointLight.position.set(-0.35, 0.7, -0.35);
  kaminGroup.add(firePointLight);

  furnGroup.add(kaminGroup);

  // --- TV Media Wall: Walnut Slat & 75" OLED ---
  const tvGroup = new THREE.Group();
  tvGroup.position.set(3.2, 0, -0.2);

  const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.42, 0.38), walnutMat);
  tvConsole.position.set(0, 0.21, 0);
  tvConsole.castShadow = true;
  tvGroup.add(tvConsole);

  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.95, 0.03), matteBlackMat);
  tvScreen.position.set(0, 0.98, 0);
  tvGroup.add(tvScreen);

  const tvGlowLight = new THREE.PointLight(0x38bdf8, 1.2, 3.5, 2);
  tvGlowLight.position.set(0, 0.98, -0.06);
  tvGroup.add(tvGlowLight);

  furnGroup.add(tvGroup);

  // ------------------------------------------
  // B. KITCHEN & DINING (Küche & Essen)
  // ------------------------------------------
  const kitchenGroup = new THREE.Group();
  kitchenGroup.position.set(-3.6, 0, -2.6);

  // Calacatta Marble Waterfall Island
  const island = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.92, 1.9), marbleMat);
  island.position.set(1.4, 0.46, 0.2);
  island.castShadow = true;
  kitchenGroup.add(island);

  // Cooktop flush glass plate on island
  const cooktop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.01, 0.75), matteBlackMat);
  cooktop.position.set(1.4, 0.925, 0.2);
  kitchenGroup.add(cooktop);

  // Modern Bar Stools
  [-0.45, 0.45].forEach((sz) => {
    const stoolBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.68, 16), frameMat);
    stoolBase.position.set(2.05, 0.34, 0.2 + sz);
    kitchenGroup.add(stoolBase);

    const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), walnutMat);
    stoolSeat.position.set(2.05, 0.71, 0.2 + sz);
    kitchenGroup.add(stoolSeat);
  });

  // Matte Black Rear Kitchen Cabinetry
  const rearCabinet = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 0.65), matteBlackMat);
  rearCabinet.position.set(0, 0.45, -1.35);
  rearCabinet.castShadow = true;
  kitchenGroup.add(rearCabinet);

  // Stainless steel sink and gooseneck faucet under window
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.45), frameMat);
  sink.position.set(0, 0.91, -1.35);
  kitchenGroup.add(sink);

  furnGroup.add(kitchenGroup);

  // --- Dining Area (Essen - 10.6 m²) ---
  const diningGroup = new THREE.Group();
  diningGroup.position.set(-0.2, 0, -2.6);

  const diningTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.95), walnutMat);
  diningTop.position.set(0, 0.75, 0);
  diningTop.castShadow = true;
  diningGroup.add(diningTop);

  // Table legs
  [[-0.85, -0.38], [-0.85, 0.38], [0.85, -0.38], [0.85, 0.38]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.06), frameMat);
    leg.position.set(lx, 0.36, lz);
    diningGroup.add(leg);
  });

  // Dining chairs
  [-0.6, 0.0, 0.6].forEach((cx) => {
    // North side chairs
    const chairN = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), frameMat);
    chairN.position.set(cx, 0.225, -0.65);
    diningGroup.add(chairN);
    // South side chairs
    const chairS = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), frameMat);
    chairS.position.set(cx, 0.225, 0.65);
    diningGroup.add(chairS);
  });

  furnGroup.add(diningGroup);

  // ------------------------------------------
  // C. UPPER GALERIE (7.5 m² - Mezzanine con affaccio sul vuoto a doppia altezza)
  // Il tavolo da pranzo è UNICO ed è al Piano Terra: dalla galleria si vede il tavolo di sotto attraverso la vetrata!
  // ------------------------------------------
  const galerieGroup = new THREE.Group();
  galerieGroup.name = 'GalerieMezzanine';
  furnGroup.add(galerieGroup);

  // ------------------------------------------
  // D. MASTER BATHROOM (Bad - 14.3 m²)
  // ------------------------------------------
  const bathGroup = new THREE.Group();
  bathGroup.position.set(-3.2, HOUSE_DIMENSIONS.firstFloorY, -2.5);

  // Angled Freestanding Soaking Tub
  const tub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.52, 0.58, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
  );
  tub.position.set(1.2, 0.29, -1.1);
  tub.scale.set(1.4, 1.0, 0.85);
  tub.rotation.y = -Math.PI / 6;
  tub.castShadow = true;
  bathGroup.add(tub);

  // Chrome floor-standing waterfall faucet
  const tubFaucet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.85, 12), brassMat);
  tubFaucet.position.set(1.9, 0.425, -1.0);
  bathGroup.add(tubFaucet);

  // Walk-in Shower Enclosure with Rainfall Shower
  const showerGlass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.0), glassMat);
  showerGlass.position.set(-1.4, 1.1, 0.6);
  bathGroup.add(showerGlass);

  const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 16), frameMat);
  showerHead.position.set(-1.4, 2.1, 0.6);
  bathGroup.add(showerHead);

  // Floating Double Vanity Unit with Twin Vessel Sinks
  const vanity = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.55), walnutMat);
  vanity.position.set(-0.3, 0.55, 1.25);
  bathGroup.add(vanity);

  [-0.4, 0.4].forEach((vx) => {
    const sink = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    sink.position.set(-0.3 + vx, 0.83, 1.25);
    bathGroup.add(sink);
  });

  // Large LED Backlit Vanity Mirror
  const mirror = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.03), frameMat);
  mirror.position.set(-0.3, 1.55, 1.48);
  bathGroup.add(mirror);

  // Wall-mounted toilet
  const toilet = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.55),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  toilet.position.set(-1.6, 0.25, -1.4);
  bathGroup.add(toilet);

  furnGroup.add(bathGroup);
  obstacleMeshes.push(tub, showerGlass, vanity);

  // ------------------------------------------
  // E. WALK-IN CLOSET (Ankleidezimmer - 8 m²)
  // ------------------------------------------
  const ankleiGroup = new THREE.Group();
  ankleiGroup.position.set(-3.2, HOUSE_DIMENSIONS.firstFloorY, 0.2);

  // North row built-in oak wardrobes with clothes
  const wardrobeN = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.55), lightOakMat);
  wardrobeN.position.set(0, 1.1, -0.7);
  ankleiGroup.add(wardrobeN);

  // South row built-in oak wardrobes
  const wardrobeS = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.55), lightOakMat);
  wardrobeS.position.set(0, 1.1, 0.7);
  ankleiGroup.add(wardrobeS);

  // Full-length dressing mirror on west wall
  const fullMirror = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.8, 0.8), frameMat);
  fullMirror.position.set(-1.95, 1.0, 0);
  ankleiGroup.add(fullMirror);

  furnGroup.add(ankleiGroup);
  obstacleMeshes.push(wardrobeN, wardrobeS);

  // ------------------------------------------
  // F. MASTER BEDROOM (Eltern - 18 m²)
  // ------------------------------------------
  const elternGroup = new THREE.Group();
  elternGroup.position.set(-2.7, HOUSE_DIMENSIONS.firstFloorY, 2.7);

  // King-size Upholstered Bed
  const kingBed = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.45, 2.2), bedLinenMat);
  kingBed.position.set(0, 0.225, 0.3);
  kingBed.castShadow = true;
  elternGroup.add(kingBed);

  // Folded designer duvet runner (charcoal)
  const duvetRunner = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.08, 0.8), sofaFabricMat);
  duvetRunner.position.set(0, 0.47, -0.4);
  elternGroup.add(duvetRunner);

  // Pillows
  [[-0.5, 0.95], [0.5, 0.95]].forEach(([px, pz]) => {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.42), bedLinenMat);
    pillow.position.set(px, 0.52, pz);
    elternGroup.add(pillow);
  });

  // Walnut paneled headboard
  const kingHeadboard = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.1, 0.15), walnutMat);
  kingHeadboard.position.set(0, 0.65, 1.45);
  elternGroup.add(kingHeadboard);

  // Twin floating bedside tables with warm lamps
  [-1.3, 1.3].forEach((nx) => {
    const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.35), walnutMat);
    nightstand.position.set(nx, 0.4, 1.3);
    elternGroup.add(nightstand);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12), brassMat);
    lampBase.position.set(nx, 0.68, 1.3);
    elternGroup.add(lampBase);

    // Bedside warm reading light
    const lampGlow = new THREE.PointLight(0xfef08a, 1.5, 3.5, 2);
    lampGlow.position.set(nx, 0.85, 1.3);
    elternGroup.add(lampGlow);
  });

  // Full-height wardrobe along West wall
  const elternWardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.4, 2.4), lightOakMat);
  elternWardrobe.position.set(-2.3, 1.2, 0.2);
  elternGroup.add(elternWardrobe);

  furnGroup.add(elternGroup);
  obstacleMeshes.push(kingBed, elternWardrobe);

  // ------------------------------------------
  // G. KIDS' ROOM 1 (Kind I - 12 m² with Mezzanine Loft)
  // ------------------------------------------
  const kind1Group = new THREE.Group();
  kind1Group.position.set(3.7, HOUSE_DIMENSIONS.firstFloorY, -2.5);

  // Single Bed along East wall under window (matching Attachment 3 3D render)
  const bed1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 2.05), bedLinenMat);
  bed1.position.set(1.0, 0.225, 0.0);
  bed1.castShadow = true;
  kind1Group.add(bed1);

  // Study Desk against North wall
  const desk1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.74, 0.65), lightOakMat);
  desk1.position.set(-0.5, 0.37, -1.35);
  kind1Group.add(desk1);

  // Laptop
  const laptop1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), frameMat);
  laptop1.position.set(-0.5, 0.75, -1.35);
  kind1Group.add(laptop1);

  // --- EMPRE (Mezzanine Loft) ---
  const loft1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 3.2), lightOakMat);
  loft1.position.set(0.9, 1.7, 0); // Elevated platform
  loft1.castShadow = true;
  kind1Group.add(loft1);

  // Wooden slatted loft railing
  const loftRail1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 3.2), lightOakMat);
  loftRail1.position.set(0.2, 2.05, 0);
  kind1Group.add(loftRail1);

  // Wooden Ladder up to loft
  const ladder1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.85, 0.08), lightOakMat);
  ladder1.rotation.x = 0.25;
  ladder1.position.set(0.2, 0.85, 0.6);
  kind1Group.add(ladder1);

  furnGroup.add(kind1Group);
  obstacleMeshes.push(bed1, desk1);

  // ------------------------------------------
  // H. HOME OFFICE / STUDIO (Büro - 7.5 m² with Loft)
  // ------------------------------------------
  const bueroGroup = new THREE.Group();
  bueroGroup.position.set(3.7, HOUSE_DIMENSIONS.firstFloorY, 0.3);

  // Executive Desk with Ultra-Wide Curved Monitor along East window wall
  const officeDesk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.65), walnutMat);
  officeDesk.position.set(0.8, 0.375, 0.0);
  bueroGroup.add(officeDesk);

  const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.38, 0.04), matteBlackMat);
  monitor.position.set(0.8, 0.95, 0.0);
  bueroGroup.add(monitor);

  // Ergonomic office chair
  const officeChair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.85, 0.5), frameMat);
  officeChair.position.set(0.2, 0.425, 0.0);
  bueroGroup.add(officeChair);

  // Tall Bookshelf filled with colorful books along North wall
  const bookshelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 2.1, 0.32),
    new THREE.MeshStandardMaterial({ map: bookshelfTexture, roughness: 0.6 })
  );
  bookshelf.position.set(-0.3, 1.05, -0.85);
  bueroGroup.add(bookshelf);

  // Cozy daybed / reading bench
  const daybed = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.65), sofaFabricMat);
  daybed.position.set(0.8, 0.2, 0.8);
  bueroGroup.add(daybed);

  // Büro Empore (Loft)
  const bueroLoft = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 2.0), lightOakMat);
  bueroLoft.position.set(0.9, 1.7, 0.1);
  bueroGroup.add(bueroLoft);

  const bueroLadder = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.85, 0.08), lightOakMat);
  bueroLadder.rotation.x = 0.25;
  bueroLadder.position.set(0.2, 0.85, 0.2);
  bueroGroup.add(bueroLadder);

  furnGroup.add(bueroGroup);
  obstacleMeshes.push(officeDesk, bookshelf);

  // ------------------------------------------
  // I. KIDS' ROOM 2 (Kind II - 13.9 m² with Loft)
  // ------------------------------------------
  const kind2Group = new THREE.Group();
  kind2Group.position.set(3.4, HOUSE_DIMENSIONS.firstFloorY, 2.8);

  // Bed
  const bed2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 2.05), bedLinenMat);
  bed2.position.set(1.4, 0.225, 0.3);
  bed2.castShadow = true;
  kind2Group.add(bed2);

  // Workstation Desk
  const desk2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.74, 0.65), lightOakMat);
  desk2.position.set(-0.6, 0.37, 1.1);
  kind2Group.add(desk2);

  // Kind II Empore (Loft)
  const loft2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 2.6), lightOakMat);
  loft2.position.set(1.2, 1.7, -0.8);
  kind2Group.add(loft2);

  const ladder2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.85, 0.08), lightOakMat);
  ladder2.rotation.z = -0.25;
  ladder2.position.set(0.4, 0.85, -0.8);
  kind2Group.add(ladder2);

  furnGroup.add(kind2Group);
  obstacleMeshes.push(bed2, desk2);

  root.add(furnGroup);

  // ==========================================
  // 10. RECESSED CEILING SPOTLIGHTS & DRAMATIC LIGHT POOLS
  // ==========================================
  const addRecessedSpotlight = (x: number, y: number, z: number, color = 0xfffaed, intensity = 4.2) => {
    // Bezel ring
    const bezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16),
      matteBlackMat
    );
    bezel.position.set(x, y - 0.01, z);
    root.add(bezel);

    // Glowing bulb lens
    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(0.065, 16),
      new THREE.MeshBasicMaterial({ color: color })
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y - 0.02, z);
    root.add(lens);

    // Focused downlight with realistic physical decay (castShadow = false to stay within MAX_TEXTURE_IMAGE_UNITS)
    const spot = new THREE.SpotLight(color, intensity, 7.5, Math.PI / 4.2, 0.65, 2.0);
    spot.position.set(x, y - 0.05, z);
    spot.target.position.set(x, 0, z);
    root.add(spot.target);
    spot.castShadow = false;
    lightsGroup.add(spot);
  };

  // Ground Floor Spots (Y = 2.78m)
  addRecessedSpotlight(3.4, 2.78, -2.1, 0xffedd5, 4.5); // Living Room center
  addRecessedSpotlight(3.2, 2.78, -0.6, 0xfffaed, 3.8); // TV area
  addRecessedSpotlight(-0.2, 2.78, -2.6, 0xfffaed, 4.5); // Dining table
  addRecessedSpotlight(-2.2, 2.78, -2.4, 0xfffaed, 4.2); // Kitchen island
  addRecessedSpotlight(-0.5, 2.78, 2.4, 0xfef08a, 3.6);  // Ground entrance hall
  addRecessedSpotlight(2.5, 2.78, 1.5, 0xfffaed, 3.5);   // Guest apartment

  // First Floor Spots (Y = 5.78m)
  addRecessedSpotlight(0.5, 5.78, -2.8, 0xfffaed, 4.5);  // Upper Galerie
  addRecessedSpotlight(-2.7, 5.78, 2.7, 0xffedd5, 4.0);  // Master Bedroom
  addRecessedSpotlight(-3.2, 5.78, -2.5, 0xffffff, 4.2);  // Master Bathroom
  addRecessedSpotlight(3.7, 5.78, -2.5, 0xfffaed, 3.8);  // Bedroom 1
  addRecessedSpotlight(3.7, 5.78, 0.3, 0xffffff, 3.8);   // Office
  addRecessedSpotlight(3.4, 5.78, 2.8, 0xfffaed, 3.8);   // Bedroom 2
  addRecessedSpotlight(0.5, 5.78, 0.2, 0xfef08a, 3.6);   // Upper Hallway

  root.add(lightsGroup);

  // Compute all collider boxes after the entire scene hierarchy has been assembled
  // and its world transformation matrices have been calculated
  root.updateMatrixWorld(true);
  for (const obj of obstacleMeshes) {
    colliderBoxes.push(new THREE.Box3().setFromObject(obj));
  }

  return {
    group: root,
    colliderBoxes,
    ceilingGroup,
    stairBoundingBox,
    lightsGroup,
  };
}
