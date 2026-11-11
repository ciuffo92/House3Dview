import * as THREE from 'three';

// 1. Dark Anthracite Polished Porcelain / Gres Floor (AAA Penthouse Style)
export function createDarkPolishedTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep luxury charcoal/slate base
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 0, 1024, 1024);

  const tileSize = 256; // 4x4 large slab tiles
  for (let y = 0; y < 1024; y += tileSize) {
    for (let x = 0; x < 1024; x += tileSize) {
      // Subtle slab-to-slab mineral variation
      const v = (Math.random() - 0.5) * 8;
      const r = Math.min(255, Math.max(0, 32 + v));
      const g = Math.min(255, Math.max(0, 38 + v));
      const b = Math.min(255, Math.max(0, 48 + v));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Delicate micro-crystalline calcite veining (Calacatta Black marble style)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let vx = x + Math.random() * tileSize;
      let vy = y + Math.random() * tileSize;
      ctx.moveTo(vx, vy);
      for (let s = 0; s < 4; s++) {
        vx += (Math.random() - 0.5) * 80;
        vy += (Math.random() - 0.5) * 80;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();

      // Sharp luxury grout line
      ctx.strokeStyle = 'rgba(10, 14, 20, 0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 2. Smoked Oak Parquet for Bedrooms / Galerie (Rich Matte Satin)
export function createSmokedOakTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3a2e26';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankH = 48;
  const plankW = 256;

  for (let y = 0; y < 1024; y += plankH) {
    const shift = (Math.floor(y / plankH) % 2) * (plankW / 2);
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + shift;
      const v = (Math.random() - 0.5) * 16;
      ctx.fillStyle = `rgb(${Math.floor(58 + v)}, ${Math.floor(46 + v * 0.9)}, ${Math.floor(38 + v * 0.8)})`;
      ctx.fillRect(px, y, plankW, plankH);

      // Fine grain streaks
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(px, y + Math.random() * plankH, plankW, 1);
      }

      // Plank micro-bevel
      ctx.strokeStyle = 'rgba(18, 12, 8, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px, y, plankW, plankH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 3. Carrera White Marble with Dark Veins (Kitchen Island & Luxury Bathroom Vanity)
export function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  // Soft smoky underlayers
  for (let i = 0; i < 8; i++) {
    const grad = ctx.createRadialGradient(
      Math.random() * 512, Math.random() * 512, 20,
      Math.random() * 512, Math.random() * 512, 160
    );
    grad.addColorStop(0, 'rgba(203, 213, 225, 0.25)');
    grad.addColorStop(1, 'rgba(248, 250, 252, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }

  // Dramatic charcoal veins
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let mx = 40; let my = 10;
  ctx.moveTo(mx, my);
  for (let s = 0; s < 6; s++) {
    mx += 70 + Math.random() * 40;
    my += 60 + Math.random() * 30;
    ctx.lineTo(mx, my);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4. Fireplace Embers & Flame Glow
export function createFireplaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 190, 15, 128, 170, 130);
  gradient.addColorStop(0, '#fffbeb');
  gradient.addColorStop(0.25, '#fb923c');
  gradient.addColorStop(0.65, '#ea580c');
  gradient.addColorStop(1, '#09090b');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Vertical ember sparks
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#fde047' : '#fdba74';
    ctx.beginPath();
    ctx.arc(80 + Math.random() * 96, 60 + Math.random() * 140, 2 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 5. Scandinavian Designer Geometric Rug
export function createRugTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#262e3d';
  ctx.fillRect(0, 0, 512, 512);

  // Elegant brass/gold minimal geometric border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 452, 452);
  ctx.strokeRect(45, 45, 422, 422);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 60; i < 450; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 45);
    ctx.lineTo(45, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(512 - i, 45);
    ctx.lineTo(467, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 6. Natural Nordic Honey Oak Parquet (for First Floor & Galerie matching Attachment 3)
export function createNaturalOakTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm golden blonde base
  ctx.fillStyle = '#c89d68';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankH = 48;
  const plankW = 256;

  for (let y = 0; y < 1024; y += plankH) {
    const shift = (Math.floor(y / plankH) % 2) * (plankW / 2);
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + shift;
      const v = (Math.random() - 0.5) * 22;
      ctx.fillStyle = `rgb(${Math.floor(202 + v)}, ${Math.floor(160 + v * 0.9)}, ${Math.floor(108 + v * 0.8)})`;
      ctx.fillRect(px, y, plankW, plankH);

      // Delicate wood grain streaks
      ctx.fillStyle = 'rgba(120, 80, 40, 0.08)';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(px, y + Math.random() * plankH, plankW, 1.2);
      }

      // Micro bevel joint
      ctx.strokeStyle = 'rgba(90, 60, 30, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px, y, plankW, plankH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 7. Bookshelf Spine Texture (for Study/Office & Kids Rooms)
export function createBookshelfTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d1f18';
  ctx.fillRect(0, 0, 512, 256);

  const colors = ['#b91c1c', '#1d4ed8', '#047857', '#d97706', '#4338ca', '#374151', '#f59e0b', '#7c3aed'];
  let curX = 10;
  while (curX < 500) {
    const bookW = 12 + Math.random() * 18;
    const bookH = 180 + Math.random() * 50;
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = color;
    ctx.fillRect(curX, 256 - bookH, bookW, bookH);

    // Book spine gold title foil
    ctx.fillStyle = 'rgba(255, 230, 150, 0.7)';
    ctx.fillRect(curX + 2, 256 - bookH + 20, bookW - 4, 3);
    ctx.fillRect(curX + 2, 256 - bookH + 30, bookW - 4, 2);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeRect(curX, 256 - bookH, bookW, bookH);

    curX += bookW + 2;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
