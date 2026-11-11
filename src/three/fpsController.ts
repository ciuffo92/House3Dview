import * as THREE from 'three';
import { HOUSE_DIMENSIONS } from '../constants/floorplanData';
import { FloorId } from '../types';

export interface FPSControllerOptions {
  camera: THREE.Camera;
  domElement: HTMLElement;
  colliderBoxes: THREE.Box3[];
  passThroughInteriorWalls?: boolean;
  onFloorChange?: (floor: FloorId) => void;
  onRoomChange?: (roomName: string) => void;
  onGhostModeChange?: (enabled: boolean) => void;
}

export class FPSController {
  public camera: THREE.Camera;
  public domElement: HTMLElement;
  public isLocked = false;
  public enabled = true;

  // Realistic Speeds & Eye Height
  public walkSpeed = 3.0;
  public sprintSpeed = 5.2;
  public eyeHeight = 1.6;

  // State
  public position = new THREE.Vector3(-0.5, 1.6, 3.2); // Start in Entrance Flur
  public velocity = new THREE.Vector3();
  public currentFloor: FloorId = 'ground';
  public passThroughInteriorWalls = true; // User request: pass through interior walls freely!

  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private isSprinting = false;

  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private colliderBoxes: THREE.Box3[] = [];
  private onFloorChange?: (floor: FloorId) => void;
  private onGhostModeChange?: (enabled: boolean) => void;

  // Web Audio footstep generator
  private audioCtx: AudioContext | null = null;
  private lastFootstepTime = 0;
  private lastUnlockTime = 0;

  constructor(options: FPSControllerOptions) {
    this.camera = options.camera;
    this.domElement = options.domElement;
    this.colliderBoxes = options.colliderBoxes;
    if (options.passThroughInteriorWalls !== undefined) {
      this.passThroughInteriorWalls = options.passThroughInteriorWalls;
    }
    this.onFloorChange = options.onFloorChange;
    this.onGhostModeChange = options.onGhostModeChange;

    this.camera.position.copy(this.position);
    this.euler.setFromQuaternion(this.camera.quaternion);

    this.bindEvents();
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playFootstep() {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio not permitted yet
    }
  }

  private bindEvents() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onPointerLockChange = this.onPointerLockChange.bind(this);
    this.onPointerLockError = this.onPointerLockError.bind(this);

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('pointerlockerror', this.onPointerLockError);
  }

  public dispose() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('pointerlockerror', this.onPointerLockError);
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }

  public lock() {
    this.initAudio();
    if (this.isLocked) return;

    // Browser enforces a security cooldown (~1.25s) after exiting pointer lock
    const elapsedSinceUnlock = performance.now() - this.lastUnlockTime;
    if (elapsedSinceUnlock < 1250) {
      return;
    }

    try {
      const lockPromise = this.domElement.requestPointerLock?.();
      if (lockPromise && typeof (lockPromise as Promise<void>).catch === 'function') {
        (lockPromise as Promise<void>).catch(() => {
          // Gracefully absorb cooldown or permission rejections
        });
      }
    } catch {
      // Ignore synchronous exceptions
    }
  }

  public unlock() {
    try {
      document.exitPointerLock?.();
    } catch {
      // Ignore
    }
  }

  private onPointerLockError() {
    // Absorb pointerlockerror events to prevent unhandled error alerts
  }

  private onPointerLockChange() {
    const wasLocked = this.isLocked;
    this.isLocked = document.pointerLockElement === this.domElement;
    if (wasLocked && !this.isLocked) {
      this.lastUnlockTime = performance.now();
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isLocked || !this.enabled) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y -= movementX * 0.0022;
    this.euler.x -= movementY * 0.0022;

    // Clamp vertical look angle (-85 deg to +85 deg)
    const maxPolar = Math.PI / 2 - 0.08;
    this.euler.x = Math.max(-maxPolar, Math.min(maxPolar, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.enabled) return;
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = true;
        break;
      case 'KeyG':
        this.passThroughInteriorWalls = !this.passThroughInteriorWalls;
        this.onGhostModeChange?.(this.passThroughInteriorWalls);
        break;
      case 'Digit1':
      case 'Numpad1':
        this.teleport(this.position.x, 0, this.position.z, 'ground');
        break;
      case 'Digit2':
      case 'Numpad2':
        this.teleport(this.position.x, 3.0, this.position.z, 'first');
        break;
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = false;
        break;
    }
  }

  public teleport(x: number, y: number, z: number, floor?: FloorId) {
    const determinedFloor = floor || (y >= 2.0 ? 'first' : 'ground');
    this.currentFloor = determinedFloor;
    const baseGroundY = determinedFloor === 'first' ? HOUSE_DIMENSIONS.firstFloorY : 0;
    this.position.set(x, baseGroundY + this.eyeHeight, z);
    this.camera.position.copy(this.position);
    this.velocity.set(0, 0, 0);
    this.onFloorChange?.(determinedFloor);
  }

  public update(delta: number) {
    if (!this.enabled) return;

    // Clamp delta to prevent huge jumps on tab switch
    const dt = Math.min(delta, 0.1);
    const speed = this.isSprinting ? this.sprintSpeed : this.walkSpeed;

    // Calculate forward/right vectors based on horizontal camera yaw only
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.euler.y
    );
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.euler.y
    );

    const wishDir = new THREE.Vector3();
    if (this.moveForward) wishDir.add(forward);
    if (this.moveBackward) wishDir.sub(forward);
    if (this.moveRight) wishDir.add(right);
    if (this.moveLeft) wishDir.sub(right);

    const isMoving = wishDir.lengthSq() > 0.001;
    if (isMoving) {
      wishDir.normalize();
      wishDir.multiplyScalar(speed);
    }

    // Damping towards target velocity
    const dampFactor = 1 - Math.exp(-14 * dt);
    this.velocity.x += (wishDir.x - this.velocity.x) * dampFactor;
    this.velocity.z += (wishDir.z - this.velocity.z) * dampFactor;

    // Move candidate
    const nextX = this.position.x + this.velocity.x * dt;
    const nextZ = this.position.z + this.velocity.z * dt;

    // --- Vertical Floor & Stair Navigation Logic ---
    const stair = HOUSE_DIMENSIONS.stair;
    // Stair shaft active zone
    const isStairX = nextX >= stair.minX - 0.15 && nextX <= stair.maxX + 0.15;
    const isStairZ = nextZ >= stair.minZ - 0.15 && nextZ <= stair.maxZ + 0.15;
    const inStairArea = isStairX && isStairZ;

    let targetGroundY = 0;

    if (inStairArea) {
      // Progress along stair from South (+1.8) to North (-0.8)
      const t = (stair.maxZ - nextZ) / (stair.maxZ - stair.minZ);
      const clampedT = Math.max(0, Math.min(1, t));
      targetGroundY = clampedT * HOUSE_DIMENSIONS.firstFloorY;

      // Update currentFloor state as player traverses the stairs
      if (clampedT >= 0.85) {
        if (this.currentFloor !== 'first') {
          this.currentFloor = 'first';
          this.onFloorChange?.('first');
        }
      } else if (clampedT <= 0.15) {
        if (this.currentFloor !== 'ground') {
          this.currentFloor = 'ground';
          this.onFloorChange?.('ground');
        }
      }
    } else {
      // Outside stairwell: player remains on their current floor (ground: 0m, first: 3m)
      targetGroundY = this.currentFloor === 'first' ? HOUSE_DIMENSIONS.firstFloorY : 0;
    }

    // Collision detection with agile player radius = 0.22m
    const radius = 0.22;
    let allowedX = nextX;
    let allowedZ = nextZ;

    // Inside the stair shaft: clamp lateral X between side balustrades (if solid), allow free North/South ascent/descent
    if (inStairArea) {
      if (!this.passThroughInteriorWalls) {
        allowedX = Math.max(stair.minX + 0.15, Math.min(stair.maxX - 0.15, nextX));
      }
      allowedZ = nextZ; // Free movement along stair incline
    } else if (!this.passThroughInteriorWalls) {
      // Solid walls mode: perform full collision testing against all interior walls, doors & furniture
      const isPlayerUpper = targetGroundY > 1.8;

      // Test X move
      const testBoxX = new THREE.Box3(
        new THREE.Vector3(allowedX - radius, targetGroundY + 0.2, this.position.z - radius),
        new THREE.Vector3(allowedX + radius, targetGroundY + 1.5, this.position.z + radius)
      );
      for (const col of this.colliderBoxes) {
        if (isPlayerUpper && col.max.y <= 2.85) continue;
        if (!isPlayerUpper && col.min.y >= 2.85) continue;

        if (testBoxX.intersectsBox(col)) {
          allowedX = this.position.x;
          this.velocity.x = 0;
          break;
        }
      }

      // Test Z move
      const testBoxZ = new THREE.Box3(
        new THREE.Vector3(allowedX - radius, targetGroundY + 0.2, allowedZ - radius),
        new THREE.Vector3(allowedX + radius, targetGroundY + 1.5, allowedZ + radius)
      );
      for (const col of this.colliderBoxes) {
        if (isPlayerUpper && col.max.y <= 2.85) continue;
        if (!isPlayerUpper && col.min.y >= 2.85) continue;

        if (testBoxZ.intersectsBox(col)) {
          allowedZ = this.position.z;
          this.velocity.z = 0;
          break;
        }
      }
    }

    // Always clamp strictly inside outer building bounds so player never leaves the house perimeter
    allowedX = Math.max(HOUSE_DIMENSIONS.minX + 0.35, Math.min(HOUSE_DIMENSIONS.maxX - 0.35, allowedX));
    allowedZ = Math.max(HOUSE_DIMENSIONS.minZ + 0.35, Math.min(HOUSE_DIMENSIONS.maxZ - 0.35, allowedZ));

    this.position.x = allowedX;
    this.position.z = allowedZ;

    const targetEyeY = targetGroundY + this.eyeHeight;
    this.position.y += (targetEyeY - this.position.y) * (1 - Math.exp(-14 * dt));
    this.camera.position.copy(this.position);

    // Floor check
    const newFloor: FloorId = this.position.y >= 2.6 ? 'first' : 'ground';
    if (newFloor !== this.currentFloor) {
      this.currentFloor = newFloor;
      this.onFloorChange?.(newFloor);
    }

    // Footsteps sound loop
    if (isMoving && this.isLocked) {
      const now = performance.now();
      const footstepInterval = this.isSprinting ? 280 : 420;
      if (now - this.lastFootstepTime > footstepInterval) {
        this.playFootstep();
        this.lastFootstepTime = now;
      }
    }
  }
}
