export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Villa a Due Piani 3D - Walkthrough Fotorealistico</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }
    body {
      overflow: hidden;
      background-color: #0b111c;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #f8fafc;
    }
    #canvas-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: block;
    }
    /* Mirino FPS */
    #crosshair {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
      z-index: 15;
      display: none;
    }
    #crosshair::before, #crosshair::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.45);
    }
    #crosshair::before { top: -8px; left: 1px; width: 2px; height: 20px; }
    #crosshair::after { top: 1px; left: -8px; width: 20px; height: 2px; }

    /* Schermata iniziale / Blocco PointerLock */
    #blocker {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(11, 17, 28, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 30;
      cursor: pointer;
      padding: 24px;
    }
    .panel-card {
      background: rgba(20, 27, 43, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 38px 34px;
      max-width: 620px;
      width: 100%;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8);
      text-align: center;
    }
    h1 {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #38bdf8;
      letter-spacing: -0.5px;
    }
    .sub-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f59e0b;
      margin-bottom: 16px;
    }
    p {
      color: #94a3b8;
      font-size: 14.5px;
      line-height: 1.6;
      margin-bottom: 22px;
    }
    .key-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      text-align: left;
      margin-bottom: 24px;
      background: rgba(11, 17, 28, 0.7);
      padding: 16px 18px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 13.5px;
    }
    .key-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #e2e8f0;
    }
    .kbd {
      background: #334155;
      color: #38bdf8;
      padding: 4px 9px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      font-size: 12px;
      border-bottom: 2px solid #1e293b;
      min-width: 32px;
      text-align: center;
    }
    .start-btn {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      padding: 14px 36px;
      border-radius: 12px;
      font-size: 15.5px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.5);
    }
    .start-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px -5px rgba(2, 132, 199, 0.65);
    }

    /* Barra di stato superiore */
    #top-hud {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(15, 23, 42, 0.85);
      padding: 10px 18px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 14px;
      pointer-events: none;
      backdrop-filter: blur(8px);
    }
    .badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-ground { background: #0284c7; color: white; }
    .badge-first { background: #7c3aed; color: white; }

    /* Barra comandi inferiore */
    #bottom-dock {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      background: rgba(15, 23, 42, 0.88);
      padding: 8px 12px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(8px);
      max-width: 95vw;
    }
    .dock-btn {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 13px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
    }
    .dock-btn:hover { background: #334155; color: white; }
    .dock-btn:active { transform: scale(0.97); }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/PointerLockControls.js"></script>
</head>
<body>
  <div id="canvas-container"></div>
  <div id="crosshair"></div>

  <!-- HUD Superiore -->
  <div id="top-hud">
    <span id="floor-badge" class="badge badge-ground">Piano Terra</span>
    <span id="room-name" style="font-weight: 600;">Ingresso / Flur</span>
    <span style="color: #64748b;">|</span>
    <span id="pos-info" style="color: #94a3b8; font-size: 12px;">Occhi: 1.60 m</span>
  </div>

  <!-- Barra Teletrasporti e Opzioni -->
  <div id="bottom-dock">
    <button class="dock-btn" onclick="teleportTo('ground')">📍 Piano Terra (Ingresso)</button>
    <button class="dock-btn" onclick="teleportTo('stairs')">🪜 Inizio Scale</button>
    <button class="dock-btn" onclick="teleportTo('first')">📍 1° Piano (Galleria)</button>
    <button class="dock-btn" onclick="teleportTo('living')">🛋️ Soggiorno / Camino</button>
    <button class="dock-btn" onclick="teleportTo('kitchen')">🍳 Cucina & Isola Marmo</button>
    <button class="dock-btn" onclick="teleportTo('master')">🛏️ Camera Master</button>
    <button class="dock-btn" onclick="teleportTo('kind2')">🧸 Camera 2</button>
    <button class="dock-btn" onclick="toggleCeilings()">🏠 Soffitto / Tetto: <span id="roof-label">Attivo</span></button>
  </div>

  <!-- Schermata Istruzioni -->
  <div id="blocker">
    <div class="panel-card">
      <div class="sub-tag">Next-Gen AAA PBR Architecture</div>
      <h1>Appartamento Moderno a Due Piani</h1>
      <p>Esplora l'appartamento in prima persona con arredi completi su entrambi i piani (soppalchi, vasca freestanding, cabina armadio, cucina a isola in marmo, camino, porte aperte).</p>
      
      <div class="key-grid">
        <div class="key-item"><span class="kbd">W A S D</span> <span>o Frecce: Camminata fluida</span></div>
        <div class="key-item"><span class="kbd">Mouse</span> <span>Sguardo a 360°</span></div>
        <div class="key-item"><span class="kbd">Shift</span> <span>Corsa accelerata</span></div>
        <div class="key-item"><span class="kbd">Scale</span> <span>Sali liberamente al 1° piano</span></div>
        <div class="key-item"><span class="kbd">1 / 2</span> <span>Teletrasporto rapido piani</span></div>
        <div class="key-item"><span class="kbd">ESC</span> <span>Pausa / Sblocca mouse</span></div>
      </div>

      <button class="start-btn">ENTRA NELL'APPARTAMENTO</button>
    </div>
  </div>

  <script>
    // --- 1. Texture procedurali ad alta fedeltà ---
    function makeDarkPolishedTileTexture() {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1e2430';
      ctx.fillRect(0, 0, 1024, 1024);

      const size = 256;
      for (let y = 0; y < 1024; y += size) {
        for (let x = 0; x < 1024; x += size) {
          const v = (Math.random() - 0.5) * 8;
          ctx.fillStyle = 'rgb(' + Math.floor(32 + v) + ',' + Math.floor(38 + v) + ',' + Math.floor(48 + v) + ')';
          ctx.fillRect(x + 2, y + 2, size - 4, size - 4);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          let vx = x + Math.random() * size;
          let vy = y + Math.random() * size;
          ctx.moveTo(vx, vy);
          for (let s = 0; s < 4; s++) {
            vx += (Math.random() - 0.5) * 70;
            vy += (Math.random() - 0.5) * 70;
            ctx.lineTo(vx, vy);
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(10, 14, 20, 0.9)';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, size, size);
        }
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(5, 4);
      return t;
    }

    function makeNaturalOakTexture() {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#c89d68';
      ctx.fillRect(0, 0, 1024, 1024);

      const pH = 48; const pW = 256;
      for (let y = 0; y < 1024; y += pH) {
        const shift = (Math.floor(y / pH) % 2) * (pW / 2);
        for (let x = -pW; x < 1024 + pW; x += pW) {
          const px = x + shift;
          const v = (Math.random() - 0.5) * 20;
          ctx.fillStyle = 'rgb(' + Math.floor(202 + v) + ',' + Math.floor(160 + v*0.9) + ',' + Math.floor(108 + v*0.8) + ')';
          ctx.fillRect(px, y, pW, pH);
          ctx.strokeStyle = 'rgba(90, 60, 30, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px, y, pW, pH);
        }
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 4);
      return t;
    }

    function makeMarbleTexture() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let mx = 30; let my = 15;
      ctx.moveTo(mx, my);
      for (let i = 0; i < 6; i++) {
        mx += 70 + Math.random() * 40;
        my += 60 + Math.random() * 30;
        ctx.lineTo(mx, my);
      }
      ctx.stroke();

      const t = new THREE.CanvasTexture(c);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      return t;
    }

    // --- 2. Inizializzazione Three.js ---
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbdd5ea);
    scene.fog = new THREE.FogExp2(0xbdd5ea, 0.016);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new THREE.PointerLockControls(camera, document.body);
    const blocker = document.getElementById('blocker');
    const crosshair = document.getElementById('crosshair');

    let lastUnlockTime = 0;
    function safeLock() {
      if (controls.isLocked) return;
      if (performance.now() - lastUnlockTime < 1250) return;
      try { controls.lock(); } catch (err) {}
    }

    blocker.addEventListener('click', safeLock);
    controls.addEventListener('lock', () => {
      blocker.style.display = 'none';
      crosshair.style.display = 'block';
    });
    controls.addEventListener('unlock', () => {
      lastUnlockTime = performance.now();
      blocker.style.display = 'flex';
      crosshair.style.display = 'none';
    });

    // --- 3. Illuminazione Fotorealistica ---
    const skyFillLight = new THREE.AmbientLight(0x7799bb, 0.25);
    scene.add(skyFillLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.0);
    sunLight.position.set(18, 16, -14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    const dSun = 15;
    sunLight.shadow.camera.left = -dSun;
    sunLight.shadow.camera.right = dSun;
    sunLight.shadow.camera.top = dSun;
    sunLight.shadow.camera.bottom = -dSun;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    scene.add(sunLight);

    // Luci calde interne di rimbalzo
    const livingBounce = new THREE.PointLight(0xffedd5, 2.6, 9, 2);
    livingBounce.position.set(3.4, 2.4, -2.1);
    scene.add(livingBounce);

    const kitchenBounce = new THREE.PointLight(0xfffaed, 2.4, 8, 2);
    kitchenBounce.position.set(-3.4, 2.4, -2.4);
    scene.add(kitchenBounce);

    const upperGalBounce = new THREE.PointLight(0xfffaed, 2.6, 8, 2);
    upperGalBounce.position.set(0.5, 5.2, -2.8);
    scene.add(upperGalBounce);

    // --- 4. Materiali PBR ---
    const darkTileTex = makeDarkPolishedTileTexture();
    const oakTex = makeNaturalOakTexture();
    const marbleTex = makeMarbleTexture();

    const floorGresMat = new THREE.MeshStandardMaterial({ map: darkTileTex, roughness: 0.12, metalness: 0.22 });
    const oakMat = new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.22, metalness: 0.08 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85, metalness: 0.02 });
    const accentWallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.05 });
    const extWallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85, metalness: 0.02 });
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9, side: THREE.DoubleSide });
    const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3, metalness: 0.05 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.32, roughness: 0.05, metalness: 0.1, transmission: 0.9 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.8 });
    const marbleMat = new THREE.MeshStandardMaterial({ map: marbleTex, roughness: 0.18, metalness: 0.05 });
    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.35 });
    const lightOakMat = new THREE.MeshStandardMaterial({ color: 0xd9b78c, roughness: 0.4 });
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    const bedLinenMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 });
    const matteBlackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4, metalness: 0.7 });

    const colliders = [];
    const obstacleMeshes = [];
    const houseGroup = new THREE.Group();
    const ceilingGroup = new THREE.Group();

    // Terrazza esterna
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(26, 0.25, 24), new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.7 }));
    terrace.position.set(0, -0.15, 0);
    terrace.receiveShadow = true;
    houseGroup.add(terrace);

    // Pavimento Piano Terra (10.8m x 8.6m)
    const groundFloorMesh = new THREE.Mesh(new THREE.PlaneGeometry(10.8, 8.6), floorGresMat);
    groundFloorMesh.rotation.x = -Math.PI / 2;
    groundFloorMesh.receiveShadow = true;
    houseGroup.add(groundFloorMesh);

    // Costruzione Muri con Porte Aperte 3D
    function buildWall(x1, z1, x2, z2, baseY, height, thickness, hasDoor, doorPos, doorW, isExt, hasWin, winW, winH, winBot) {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      if (len < 0.05) return;
      const ang = Math.atan2(dz, dx);
      const th = thickness || (isExt ? 0.36 : 0.16);
      const m = isExt ? extWallMat : wallMat;
      const g = new THREE.Group();
      g.position.set(x1, baseY, z1);
      g.rotation.y = -ang;

      function seg(sX, eX, bY, tY) {
        const sl = eX - sX; const sh = tY - bY;
        if (sl <= 0.02 || sh <= 0.02) return;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(sl, sh, th), m);
        mesh.position.set(sX + sl/2, bY + sh/2, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        g.add(mesh);
        obstacleMeshes.push(mesh);
      }

      if (!isExt) {
        const baseboard = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, th + 0.02), frameMat);
        baseboard.position.set(len / 2, 0.035, 0);
        g.add(baseboard);
      }

      if (hasDoor) {
        const dw = doorW || 0.9;
        const dh = 2.15;
        const dc = (doorPos || 0.5) * len;
        const ds = Math.max(0, dc - dw/2);
        const de = Math.min(len, dc + dw/2);
        if (ds > 0.04) seg(0, ds, 0, height);
        if (height > dh) seg(ds, de, dh, height);
        if (len - de > 0.04) seg(de, len, 0, height);

        // Telaio
        const cThick = 0.04;
        const fl = new THREE.Mesh(new THREE.BoxGeometry(cThick, dh, th + 0.03), frameMat);
        fl.position.set(ds + cThick/2, dh/2, 0);
        g.add(fl);
        const fr = new THREE.Mesh(new THREE.BoxGeometry(cThick, dh, th + 0.03), frameMat);
        fr.position.set(de - cThick/2, dh/2, 0);
        g.add(fr);
        const ft = new THREE.Mesh(new THREE.BoxGeometry(dw, cThick, th + 0.03), frameMat);
        ft.position.set(ds + dw/2, dh - cThick/2, 0);
        g.add(ft);

        // Porta 3D aperta a 65 gradi
        const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(dw - 0.08, dh - 0.04, 0.04), doorLeafMat);
        doorSlab.position.set((dw - 0.08) / 2, (dh - 0.04) / 2, 0);
        const doorPivot = new THREE.Group();
        doorPivot.position.set(ds + cThick, 0, 0);
        doorPivot.rotation.y = Math.PI * 0.38;
        doorPivot.add(doorSlab);
        g.add(doorPivot);
      } else if (hasWin) {
        const ww = winW || 1.8;
        const wh = winH || 1.8;
        const wb = winBot || 0.8;
        const wc = len / 2;
        const ws = Math.max(0, wc - ww/2);
        const we = Math.min(len, wc + ww/2);
        if (ws > 0.04) seg(0, ws, 0, height);
        if (wb > 0.04) seg(ws, we, 0, wb);
        if (height > wb + wh) seg(ws, we, wb + wh, height);
        if (len - we > 0.04) seg(we, len, 0, height);

        const glass = new THREE.Mesh(new THREE.BoxGeometry(ww - 0.08, wh - 0.08, 0.02), glassMat);
        glass.position.set(ws + ww/2, wb + wh/2, 0);
        g.add(glass);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(ww, wh, 0.08), frameMat);
        frame.position.set(ws + ww/2, wb + wh/2, 0);
        g.add(frame);
      } else {
        seg(0, len, 0, height);
      }
      houseGroup.add(g);
    }

    // --- Muri Piano Terra ---
    buildWall(-5.4, -4.3, 5.4, -4.3, 0, 2.8, 0.36, true, 0.45, 2.4, true); // Nord vetrata patio
    buildWall(5.4, -4.3, 5.4, 4.3, 0, 2.8, 0.36, false, 0, 0, true, true, 1.8, 1.6, 0.8);
    buildWall(-5.4, 4.3, 5.4, 4.3, 0, 2.8, 0.36, true, 0.45, 1.1, true); // Sud portone
    buildWall(-5.4, -4.3, -5.4, 4.3, 0, 2.8, 0.36, false, 0, 0, true, true, 1.6, 1.4, 1.0);

    buildWall(-1.9, -1.0, -1.9, 4.3, 0, 2.8, 0.18, true, 0.65, 0.95);
    buildWall(-5.4, -1.0, -1.9, -1.0, 0, 2.8, 0.16, true, 0.45, 0.9);
    buildWall(-5.4, 0.4, -1.9, 0.4, 0, 2.8, 0.16);
    buildWall(-5.4, 2.8, -1.9, 2.8, 0, 2.8, 0.16, true, 0.5, 0.9);
    buildWall(0.8, 0.1, 0.8, 4.3, 0, 2.8, 0.18, true, 0.4, 0.95);
    buildWall(0.8, 3.0, 2.0, 3.0, 0, 2.8, 0.16, true, 0.5, 0.85);
    buildWall(1.0, 0.1, 5.4, 0.1, 0, 2.8, 0.18);
    buildWall(2.7, 0.1, 2.7, 1.6, 0, 2.8, 0.16, true, 0.5, 0.85);
    buildWall(2.7, 1.6, 5.4, 1.6, 0, 2.8, 0.16);

    // --- Scala Centrale ---
    const stairX1 = -0.2; const stairX2 = 1.0;
    const stairZ1 = -0.8; const stairZ2 = 1.8;
    const numSteps = 16;
    const stepRise = 3.0 / numSteps;
    const stepRun = (stairZ2 - stairZ1) / numSteps;
    const stairW = stairX2 - stairX1;

    for (let i = 0; i < numSteps; i++) {
      const stepY = i * stepRise;
      const stepZ = stairZ2 - (i + 0.5) * stepRun;
      const stepX = (stairX1 + stairX2) / 2;

      const tread = new THREE.Mesh(new THREE.BoxGeometry(stairW, 0.04, stepRun + 0.02), oakMat);
      tread.position.set(stepX, stepY + stepRise - 0.02, stepZ);
      tread.castShadow = true;
      tread.receiveShadow = true;
      houseGroup.add(tread);

      const riser = new THREE.Mesh(new THREE.BoxGeometry(stairW, stepRise, 0.03), frameMat);
      riser.position.set(stepX, stepY + stepRise/2, stairZ2 - i * stepRun);
      houseGroup.add(riser);
    }

    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, Math.hypot(stairZ2 - stairZ1, 3.0), 12), frameMat);
    handrail.rotation.x = Math.PI / 2 + Math.atan2(3.0, stairZ2 - stairZ1);
    handrail.position.set(stairX2 - 0.04, 1.5 + 0.9, (stairZ1 + stairZ2) / 2);
    houseGroup.add(handrail);

    // --- Solaio Interpiano con Vuoto Scale ---
    function addSlab(minX, maxX, minZ, maxZ) {
      const w = maxX - minX; const d = maxZ - minZ;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), oakMat);
      slab.position.set(minX + w/2, 3.0 - 0.1, minZ + d/2);
      slab.receiveShadow = true;
      houseGroup.add(slab);
    }
    // 1. Ala Ovest: Bagno (-5.4 a -1.0, Z: -4.3 a -0.8), Cabina e Camera Padronale (-5.4 a -0.2, Z: -0.8 a 4.3)
    addSlab(-5.4, -1.0, -4.3, -0.8);
    addSlab(-5.4, stairX1, -0.8, 4.3);
    // 2. Ala Est: Camera 1 (2.0 a 5.4, Z: -4.3 a -0.8), Studio e Camera 2 (1.0 a 5.4, Z: -0.8 a 4.3)
    addSlab(2.0, 5.4, -4.3, -0.8);
    addSlab(stairX2, 5.4, -0.8, 4.3);
    // 3. Camminamento Nord Galleria (-1.0 a 2.0, Z: -1.3 a -0.8) e Corridoio Sud (Z: 1.8 a 4.3)
    addSlab(-1.0, 2.0, -1.3, stairZ1);
    addSlab(stairX1, stairX2, stairZ2, 4.3);
    // (L'area X: -1.0 a 2.0, Z: -4.3 a -1.3 è il VUOTO a DOPPIA ALTEZZA della Galleria che si affaccia sul tavolo da pranzo di sotto!)

    // Parapetti in vetro di sicurezza
    function addGlassRail(x1, z1, x2, z2) {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const ang = Math.atan2(z2 - z1, x2 - x1);
      const g = new THREE.Group();
      g.position.set(x1, 3.0, z1);
      g.rotation.y = -ang;
      const glass = new THREE.Mesh(new THREE.BoxGeometry(len, 0.95, 0.025), glassMat);
      glass.position.set(len/2, 0.48, 0);
      g.add(glass);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, 0.06), frameMat);
      cap.position.set(len/2, 0.96, 0);
      g.add(cap);
      houseGroup.add(g);
      obstacleMeshes.push(glass);
    }
    addGlassRail(stairX1, stairZ2, stairX1, stairZ1); // Ovest vano scale
    addGlassRail(stairX2, stairZ1, stairX2, 1.4);      // Est vano scale
    addGlassRail(-1.0, -1.3, 2.0, -1.3);              // Parapetto Galleria affacciato sulla sala da pranzo di sotto

    // --- Muri Primo Piano (Con Porte Dedicate e Accessi Perfettamente Aperti) ---
    buildWall(-5.4, -4.3, 5.4, -4.3, 3.0, 2.8, 0.36, false, 0, 0, true, true, 2.6, 2.2, 0.2); // Nord vetrata
    buildWall(5.4, -4.3, 5.4, 4.3, 3.0, 2.8, 0.36, false, 0, 0, true, true, 1.8, 1.6, 0.8);
    buildWall(-5.4, 4.3, 5.4, 4.3, 3.0, 2.8, 0.36, false, 0, 0, true, true, 2.4, 1.6, 0.8);
    buildWall(-5.4, -4.3, -5.4, 4.3, 3.0, 2.8, 0.36, false, 0, 0, true, true, 1.6, 1.4, 1.0);

    // Muri Interni Primo Piano
    buildWall(-1.0, -4.3, -1.0, -0.8, 3.0, 2.8, 0.18, true, 0.65, 0.95); // Porta Bagno Padronale
    buildWall(-5.4, -0.8, -1.0, -0.8, 3.0, 2.8, 0.16);                  // Divisorio Bagno / Cabina Armadio
    buildWall(-1.0, -0.8, -1.0, 1.2, 3.0, 2.8, 0.18, true, 0.5, 1.1);   // Ingresso Cabina Armadio
    buildWall(-5.4, 1.2, -1.0, 1.2, 3.0, 2.8, 0.16);                   // Divisorio Cabina Armadio / Master
    buildWall(-1.0, 1.2, -0.2, 1.2, 3.0, 2.8, 0.18, true, 0.5, 0.75);  // Porta Camera Padronale (Eltern)
    buildWall(2.0, -4.3, 2.0, -0.8, 3.0, 2.8, 0.18, true, 0.65, 0.95); // Porta Camera 1
    buildWall(2.0, -0.8, 5.4, -0.8, 3.0, 2.8, 0.16);                   // Divisorio Camera 1 / Studio
    buildWall(2.0, -0.8, 2.0, 1.4, 3.0, 2.8, 0.18, true, 0.5, 0.95);  // Porta Studio / Ufficio
    buildWall(2.0, 1.4, 5.4, 1.4, 3.0, 2.8, 0.16);                     // Divisorio Studio / Camera 2
    buildWall(1.0, 1.4, 2.0, 1.4, 3.0, 2.8, 0.18, true, 0.5, 0.85);   // Porta Camera 2 (Libera nel corridoio est!)
    buildWall(0.0, 1.8, 0.0, 4.3, 3.0, 2.8, 0.18);                     // Divisorio Sud Eltern / Camera 2
    buildWall(-0.2, 1.8, 1.0, 1.8, 3.0, 2.8, 0.16);                    // Parapetto Sud vano scala

    // Tetto
    const roof = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.25, 9.0), ceilingMat);
    roof.position.set(0, 5.92, 0);
    roof.castShadow = true;
    roof.receiveShadow = true;
    ceilingGroup.add(roof);
    houseGroup.add(ceilingGroup);

    // --- Arredamento Completo ad Alta Fedeltà ---
    // 1. Soggiorno: Divano a L, Tavolino marmo, Camino, TV OLED
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.42, 1.0), sofaMat);
    sofa.position.set(3.4, 0.21, -2.7);
    houseGroup.add(sofa);

    const sofaL = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.38, 1.6), sofaMat);
    sofaL.position.set(4.2, 0.19, -1.6);
    houseGroup.add(sofaL);

    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.7), marbleMat);
    coffeeTable.position.set(3.3, 0.175, -1.7);
    houseGroup.add(coffeeTable);

    const kamin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), accentWallMat);
    kamin.position.set(4.8, 1.4, -0.4);
    houseGroup.add(kamin);

    const fireGlow = new THREE.PointLight(0xf97316, 2.5, 5.5, 2);
    fireGlow.position.set(4.4, 0.7, -0.4);
    houseGroup.add(fireGlow);

    const tv = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.95, 0.03), matteBlackMat);
    tv.position.set(3.2, 0.98, -0.2);
    houseGroup.add(tv);

    // 2. Cucina & Pranzo: Isola a cascata in marmo Calacatta, Tavolo in noce con 6 sedie
    const island = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.92, 1.9), marbleMat);
    island.position.set(-2.2, 0.46, -2.4);
    houseGroup.add(island);

    const diningTable = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.95), walnutMat);
    diningTable.position.set(-0.2, 0.75, -2.6);
    houseGroup.add(diningTable);

    // 3. Galleria 1° Piano: Mezzanino aperto con affaccio diretto sul tavolo da pranzo di sotto
    // Il tavolo al piano superiore non esiste: dalla galleria si vede il tavolo da pranzo sottostante!

    // 4. Bagno Padronale: Vasca freestanding curva, doccia walk-in, mobile doppio lavabo
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.52, 0.58, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 }));
    tub.position.set(-2.0, 3.29, -3.6);
    tub.scale.set(1.4, 1.0, 0.85);
    tub.rotation.y = -Math.PI / 6;
    houseGroup.add(tub);

    const shower = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.0), glassMat);
    shower.position.set(-4.6, 4.1, -1.9);
    houseGroup.add(shower);

    // 5. Cabina Armadio (Ankleidezimmer): Armadiature in rovere bifacciali
    const wardrobeN = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.55), lightOakMat);
    wardrobeN.position.set(-3.2, 4.1, -0.5);
    houseGroup.add(wardrobeN);

    // 6. Camera Padronale: Letto King imbottito con comodini e lampade
    const masterBed = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.45, 2.2), bedLinenMat);
    masterBed.position.set(-2.7, 3.225, 3.0);
    houseGroup.add(masterBed);

    // 7. Camere con Soppalco (Empore KI, Büro, KII)
    // Soppalco Camera 1
    const loft1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 3.2), lightOakMat);
    loft1.position.set(4.6, 4.7, -2.5);
    houseGroup.add(loft1);
    const ladder1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.85, 0.08), lightOakMat);
    ladder1.rotation.x = 0.25;
    ladder1.position.set(3.9, 3.85, -1.9);
    houseGroup.add(ladder1);

    // Studio / Büro Desk & Bookshelf
    const bueroDesk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.65), walnutMat);
    bueroDesk.position.set(4.5, 3.375, 0.3);
    houseGroup.add(bueroDesk);

    const bueroLoft = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 2.0), lightOakMat);
    bueroLoft.position.set(4.6, 4.7, 0.4);
    houseGroup.add(bueroLoft);

    // Camera 2
    const bed2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 2.05), bedLinenMat);
    bed2.position.set(4.8, 3.225, 3.1);
    houseGroup.add(bed2);

    const loft2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 2.6), lightOakMat);
    loft2.position.set(4.6, 4.7, 2.0);
    houseGroup.add(loft2);

    obstacleMeshes.push(island, diningTable, tub, shower, wardrobeN, masterBed, bueroDesk, bed2);

    scene.add(houseGroup);
    houseGroup.updateMatrixWorld(true);
    for (const obj of obstacleMeshes) {
      colliders.push(new THREE.Box3().setFromObject(obj));
    }

    // --- Controlli Prima Persona Fluidi ---
    let currentFloor = 'ground';
    const eyeHeight = 1.6;
    const playerPos = new THREE.Vector3(-0.5, eyeHeight, 3.2);
    camera.position.copy(playerPos);

    const keys = { w: false, a: false, s: false, d: false, shift: false };
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.w = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.s = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.a = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.d = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = true;
      if (e.code === 'Digit1') teleportTo('ground');
      if (e.code === 'Digit2') teleportTo('first');
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.w = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.s = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.a = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.d = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = false;
    });

    window.teleportTo = function(target) {
      if (target === 'ground') { currentFloor = 'ground'; playerPos.set(-0.5, eyeHeight, 3.2); }
      else if (target === 'first') { currentFloor = 'first'; playerPos.set(0.5, 3.0 + eyeHeight, 0.2); }
      else if (target === 'living') { currentFloor = 'ground'; playerPos.set(3.4, eyeHeight, -2.1); }
      else if (target === 'kitchen') { currentFloor = 'ground'; playerPos.set(-3.2, eyeHeight, -2.4); }
      else if (target === 'stairs') { currentFloor = 'ground'; playerPos.set(0.4, eyeHeight, 1.7); }
      else if (target === 'master') { currentFloor = 'first'; playerPos.set(-2.7, 3.0 + eyeHeight, 2.7); }
      else if (target === 'kind2') { currentFloor = 'first'; playerPos.set(2.7, 3.0 + eyeHeight, 2.8); }
      velocity.set(0, 0, 0);
      camera.position.copy(playerPos);
      updateHUD();
    };

    let showCeilings = true;
    window.toggleCeilings = function() {
      showCeilings = !showCeilings;
      ceilingGroup.visible = showCeilings;
      document.getElementById('roof-label').textContent = showCeilings ? 'Attivo' : 'Nascosto (Spaccato)';
    };

    function updateHUD() {
      const isFirst = currentFloor === 'first';
      const floorBadge = document.getElementById('floor-badge');
      const roomName = document.getElementById('room-name');
      const posInfo = document.getElementById('pos-info');

      posInfo.textContent = 'Occhi: ' + playerPos.y.toFixed(2) + ' m';

      if (isFirst) {
        floorBadge.className = 'badge badge-first';
        floorBadge.textContent = 'Primo Piano';
        if (playerPos.z < -0.8 && playerPos.x >= -1.0 && playerPos.x <= 2.0) roomName.textContent = 'Galerie (Affaccio sul Tavolo da Pranzo)';
        else if (playerPos.x < -1.0 && playerPos.z < -0.8) roomName.textContent = 'Bagno Padronale in Marmo';
        else if (playerPos.x < -1.0 && playerPos.z >= -0.8 && playerPos.z <= 1.2) roomName.textContent = 'Cabina Armadio (Ankleidezimmer)';
        else if (playerPos.x < 0.0 && playerPos.z > 1.2) roomName.textContent = 'Camera Padronale (Eltern)';
        else if (playerPos.x > 2.0 && playerPos.z < -0.8) roomName.textContent = 'Camera 1 con Soppalco';
        else if (playerPos.x > 2.0 && playerPos.z < 1.4) roomName.textContent = 'Studio / Ufficio con Soppalco';
        else if (playerPos.x >= 0.0 && playerPos.z > 1.4) roomName.textContent = 'Camera 2 con Soppalco';
        else roomName.textContent = 'Disimpegno 1° Piano';
      } else {
        floorBadge.className = 'badge badge-ground';
        floorBadge.textContent = 'Piano Terra';
        if (playerPos.x < -1.9 && playerPos.z < -1.0) roomName.textContent = 'Cucina con Isola Marmo';
        else if (playerPos.x < 1.4 && playerPos.z < -1.0) roomName.textContent = 'Zona Pranzo (Essen - Soffitto Doppio)';
        else if (playerPos.x > 1.4 && playerPos.z < 0.1) roomName.textContent = 'Soggiorno con Camino';
        else if (playerPos.x > 0.8 && playerPos.z > 0.1) roomName.textContent = 'Appartamento Ospiti';
        else if (playerPos.x < -1.9 && playerPos.z > 0.4) roomName.textContent = 'Locale Tecnico / Ripostiglio';
        else roomName.textContent = 'Ingresso / Flur';
      }
    }

    let prevTime = performance.now();
    const velocity = new THREE.Vector3();

    function animate() {
      requestAnimationFrame(animate);

      const time = performance.now();
      const delta = Math.min((time - prevTime) / 1000, 0.1);
      prevTime = time;

      if (controls.isLocked) {
        const speed = keys.shift ? 5.2 : 3.0;
        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);
        const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);

        const moveDir = new THREE.Vector3();
        if (keys.w) moveDir.add(forward);
        if (keys.s) moveDir.sub(forward);
        if (keys.d) moveDir.add(right);
        if (keys.a) moveDir.sub(right);

        if (moveDir.lengthSq() > 0.001) {
          moveDir.normalize().multiplyScalar(speed);
        }

        velocity.x += (moveDir.x - velocity.x) * (1 - Math.exp(-14 * delta));
        velocity.z += (moveDir.z - velocity.z) * (1 - Math.exp(-14 * delta));

        const nextX = playerPos.x + velocity.x * delta;
        const nextZ = playerPos.z + velocity.z * delta;

        const inStairArea = nextX >= stairX1 - 0.15 && nextX <= stairX2 + 0.15 && nextZ >= stairZ1 - 0.15 && nextZ <= stairZ2 + 0.15;

        let targetGroundY = 0;
        if (inStairArea) {
          const t = (stairZ2 - nextZ) / (stairZ2 - stairZ1);
          const clampedT = Math.max(0, Math.min(1, t));
          targetGroundY = clampedT * 3.0;
          if (clampedT >= 0.85) currentFloor = 'first';
          else if (clampedT <= 0.15) currentFloor = 'ground';
        } else {
          targetGroundY = currentFloor === 'first' ? 3.0 : 0.0;
        }

        const radius = 0.22;
        let testX = nextX;
        let testZ = nextZ;

        if (inStairArea) {
          testX = Math.max(stairX1 + 0.15, Math.min(stairX2 - 0.15, nextX));
          testZ = nextZ;
        } else {
          const isUpper = targetGroundY > 1.8;

          const boxX = new THREE.Box3(
            new THREE.Vector3(testX - radius, targetGroundY + 0.2, playerPos.z - radius),
            new THREE.Vector3(testX + radius, targetGroundY + 1.5, playerPos.z + radius)
          );
          for (let i = 0; i < colliders.length; i++) {
            if (isUpper && colliders[i].max.y <= 2.85) continue;
            if (!isUpper && colliders[i].min.y >= 2.85) continue;
            if (boxX.intersectsBox(colliders[i])) {
              testX = playerPos.x;
              velocity.x = 0;
              break;
            }
          }

          const boxZ = new THREE.Box3(
            new THREE.Vector3(testX - radius, targetGroundY + 0.2, testZ - radius),
            new THREE.Vector3(testX + radius, targetGroundY + 1.5, testZ + radius)
          );
          for (let i = 0; i < colliders.length; i++) {
            if (isUpper && colliders[i].max.y <= 2.85) continue;
            if (!isUpper && colliders[i].min.y >= 2.85) continue;
            if (boxZ.intersectsBox(colliders[i])) {
              testZ = playerPos.z;
              velocity.z = 0;
              break;
            }
          }
        }

        playerPos.x = Math.max(-5.1, Math.min(5.1, testX));
        playerPos.z = Math.max(-4.0, Math.min(4.0, testZ));

        playerPos.y += (targetGroundY + eyeHeight - playerPos.y) * (1 - Math.exp(-14 * delta));
        camera.position.copy(playerPos);

        updateHUD();
      }

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>`;
}
