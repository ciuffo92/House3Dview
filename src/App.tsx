import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildHouse } from './three/houseBuilder';
import { FPSController } from './three/fpsController';
import { generateStandaloneHtml } from './three/standaloneHtmlGenerator';
import { HUD } from './components/HUD';
import { FloorId, CameraViewMode } from './types';
import { ROOMS_GROUND, ROOMS_FIRST, HOUSE_DIMENSIONS } from './constants/floorplanData';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI State
  const [isLocked, setIsLocked] = useState(false);
  const [currentFloor, setCurrentFloor] = useState<FloorId>('ground');
  const [currentRoom, setCurrentRoom] = useState('Ingresso / Disimpegno');
  const [playerPosition, setPlayerPosition] = useState({ x: -0.5, y: 1.65, z: 3.2 });
  const [playerYaw, setPlayerYaw] = useState(0);
  const [viewMode, setViewMode] = useState<CameraViewMode>('fps');
  const [showCeilings, setShowCeilings] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  // Three.js References
  const fpsControllerRef = useRef<FPSController | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const ceilingGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene with bright realistic daylight exterior horizon
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xbdd5ea);
    scene.fog = new THREE.FogExp2(0xbdd5ea, 0.016);

    // Camera (eyeHeight: 1.6m)
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    cameraRef.current = camera;
    camera.position.set(-0.5, 1.6, 3.2);

    // High-definition PBR Renderer with Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true; // Always enabled for AAA realism
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Procedural RoomEnvironment for PBR reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting (Next-Gen AAA Interior)
    // 1. Light sky bounce fill
    const skyFillAmbient = new THREE.AmbientLight(0x7799bb, 0.25);
    scene.add(skyFillAmbient);

    // 2. High-intensity grazing sunlight streaming through windows
    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    sunLight.position.set(16, 18, -12); // Grazing angle entering patio doors & windows
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    const d = 15;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    // 3. Warm Interior Ambient Bounce Lights (Safehouse GTA V / Cyberpunk luxury style)
    const livingBounce = new THREE.PointLight(0xffedd5, 2.6, 9, 2);
    livingBounce.position.set(3.4, 2.4, -2.1);
    scene.add(livingBounce);

    const kitchenBounce = new THREE.PointLight(0xfffaed, 2.4, 8, 2);
    kitchenBounce.position.set(-3.4, 2.4, -2.4);
    scene.add(kitchenBounce);

    const flurBounce = new THREE.PointLight(0xfef08a, 2.2, 7, 2);
    flurBounce.position.set(-0.5, 2.4, 2.4);
    scene.add(flurBounce);

    const upperGalBounce = new THREE.PointLight(0xfffaed, 2.6, 8, 2);
    upperGalBounce.position.set(0.5, 5.2, -2.8);
    scene.add(upperGalBounce);

    const masterBedBounce = new THREE.PointLight(0xffedd5, 2.5, 8, 2);
    masterBedBounce.position.set(-2.5, 5.2, 2.7);
    scene.add(masterBedBounce);

    // Build Architectural House
    const { group: houseGroup, colliderBoxes, ceilingGroup, lightsGroup } = buildHouse();
    scene.add(houseGroup);
    ceilingGroupRef.current = ceilingGroup;
    lightsGroupRef.current = lightsGroup;

    // First-Person Controller
    const fpsController = new FPSController({
      camera,
      domElement: container,
      colliderBoxes,
      onFloorChange: (floor) => {
        setCurrentFloor(floor);
      },
    });
    fpsControllerRef.current = fpsController;

    // Orbit Controls for Dollhouse cross-section view
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = !isSoftwareGl;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.enabled = false;
    orbitControlsRef.current = orbitControls;

    // Window resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // PointerLock state listener
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === container;
      setIsLocked(locked);
      fpsController.isLocked = locked;
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Room name calculation helper
    const updateCurrentRoom = (pos: { x: number; y: number; z: number }) => {
      const isFirst = pos.y >= 2.6;
      const rooms = isFirst ? ROOMS_FIRST : ROOMS_GROUND;

      // Special check: stairs
      const s = HOUSE_DIMENSIONS.stair;
      if (pos.x >= s.minX - 0.2 && pos.x <= s.maxX + 0.2 && pos.z >= s.minZ - 0.2 && pos.z <= s.maxZ + 0.2) {
        setCurrentRoom('Scale Centrali (Treppe)');
        return;
      }

      for (const r of rooms) {
        if (
          pos.x >= r.bounds.minX &&
          pos.x <= r.bounds.maxX &&
          pos.z >= r.bounds.minZ &&
          pos.z <= r.bounds.maxZ
        ) {
          setCurrentRoom(`${r.nameIt} (${r.area})`);
          return;
        }
      }
      setCurrentRoom(isFirst ? 'Disimpegno 1° Piano' : 'Ingresso / Disimpegno');
    };

    // Animation Render Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (fpsControllerRef.current && fpsControllerRef.current.enabled) {
        fpsControllerRef.current.update(delta);
        const p = fpsControllerRef.current.position;
        setPlayerPosition({ x: p.x, y: p.y, z: p.z });

        // Calculate horizontal yaw
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        const yaw = Math.atan2(dir.x, dir.z);
        setPlayerYaw(yaw);

        updateCurrentRoom(p);
      } else if (orbitControls.enabled) {
        orbitControls.update();
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      fpsController.dispose();
      orbitControls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // View Mode Switcher: FPS Walk vs Dollhouse Orbit
  const handleToggleViewMode = () => {
    const nextMode: CameraViewMode = viewMode === 'fps' ? 'orbit' : 'fps';
    setViewMode(nextMode);

    if (nextMode === 'orbit') {
      if (fpsControllerRef.current) {
        fpsControllerRef.current.enabled = false;
        fpsControllerRef.current.unlock();
      }
      if (orbitControlsRef.current && cameraRef.current) {
        orbitControlsRef.current.enabled = true;
        cameraRef.current.position.set(12, 14, 16);
        orbitControlsRef.current.target.set(0, 1.5, 0);
        orbitControlsRef.current.update();
      }
      if (ceilingGroupRef.current) {
        ceilingGroupRef.current.visible = false;
        setShowCeilings(false);
      }
    } else {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }
      if (fpsControllerRef.current && cameraRef.current) {
        fpsControllerRef.current.enabled = true;
        const p = fpsControllerRef.current.position;
        cameraRef.current.position.set(p.x, p.y, p.z);
        fpsControllerRef.current.lock();
      }
    }
  };

  // Ceiling / Roof Toggle
  const handleToggleCeilings = () => {
    const next = !showCeilings;
    setShowCeilings(next);
    if (ceilingGroupRef.current) {
      ceilingGroupRef.current.visible = next;
    }
  };

  // Night Mode / Interior Lighting Toggle
  const handleToggleNightMode = () => {
    const next = !nightMode;
    setNightMode(next);
    if (sunLightRef.current && hemiLightRef.current && sceneRef.current) {
      if (next) {
        sunLightRef.current.intensity = 0.15;
        sunLightRef.current.color.setHex(0x38bdf8);
        sceneRef.current.background = new THREE.Color(0x0a0f1d);
        if (sceneRef.current.fog) sceneRef.current.fog.color.setHex(0x0a0f1d);
      } else {
        sunLightRef.current.intensity = 2.8;
        sunLightRef.current.color.setHex(0xfffaed);
        sceneRef.current.background = new THREE.Color(0xbdd5ea);
        if (sceneRef.current.fog) sceneRef.current.fog.color.setHex(0xbdd5ea);
      }
    }
  };

  // Teleportation Handler
  const handleTeleport = (target: 'ground' | 'first' | 'living' | 'kitchen' | 'master' | 'stairs' | 'kind2') => {
    if (!fpsControllerRef.current) return;

    if (viewMode === 'orbit') {
      setViewMode('fps');
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
      fpsControllerRef.current.enabled = true;
    }

    switch (target) {
      case 'ground':
        fpsControllerRef.current.teleport(-0.5, 0, 3.2, 'ground');
        break;
      case 'first':
        fpsControllerRef.current.teleport(0.5, 3.0, 0.2, 'first');
        break;
      case 'living':
        fpsControllerRef.current.teleport(3.4, 0, -2.1, 'ground');
        break;
      case 'kitchen':
        fpsControllerRef.current.teleport(-3.6, 0, -2.6, 'ground');
        break;
      case 'master':
        fpsControllerRef.current.teleport(-2.7, 3.0, 2.7, 'first');
        break;
      case 'kind2':
        fpsControllerRef.current.teleport(2.7, 3.0, 2.8, 'first');
        break;
      case 'stairs':
        fpsControllerRef.current.teleport(0.4, 0, 1.8, 'ground');
        break;
    }
  };

  // Standalone HTML Download
  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'casa_due_piani_3d_walkthrough.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Standalone HTML to Clipboard
  const handleCopyHtml = () => {
    const htmlContent = generateStandaloneHtml();
    navigator.clipboard.writeText(htmlContent);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Interactive HUD Overlay */}
      <HUD
        isLocked={isLocked}
        currentFloor={currentFloor}
        currentRoom={currentRoom}
        playerPosition={playerPosition}
        playerYaw={playerYaw}
        viewMode={viewMode}
        showCeilings={showCeilings}
        nightMode={nightMode}
        onLockPointer={() => fpsControllerRef.current?.lock()}
        onTeleport={handleTeleport}
        onToggleViewMode={handleToggleViewMode}
        onToggleCeilings={handleToggleCeilings}
        onToggleNightMode={handleToggleNightMode}
        onDownloadHtml={handleDownloadHtml}
        onCopyHtml={handleCopyHtml}
      />
    </div>
  );
}
