import { RoomInfo, WallDef } from '../types';

export const HOUSE_DIMENSIONS = {
  width: 10.8,
  depth: 8.6,
  minX: -5.4,
  maxX: 5.4,
  minZ: -4.3,
  maxZ: 4.3,
  groundFloorHeight: 2.8,
  slabThickness: 0.2,
  firstFloorY: 3.0,
  firstFloorHeight: 2.8,
  roofY: 5.8,
  stair: {
    minX: -0.2,
    maxX: 1.0,
    minZ: -0.8,
    maxZ: 1.8,
    steps: 16,
    width: 1.2,
    length: 2.6,
  },
};

export const ROOMS_GROUND: RoomInfo[] = [
  {
    id: 'flur-ground',
    floor: 'ground',
    name: 'Flur',
    nameIt: 'Ingresso Principale',
    area: '8,9 m²',
    bounds: { minX: -1.9, maxX: 0.8, minZ: 0.6, maxZ: 4.3 },
    center: [-0.5, 0, 2.4],
    color: '#e2e8f0',
  },
  {
    id: 'kueche',
    floor: 'ground',
    name: 'Küche',
    nameIt: 'Cucina con Isola',
    area: '11,5 m²',
    bounds: { minX: -5.4, maxX: -1.9, minZ: -4.3, maxZ: -1.0 },
    center: [-3.6, 0, -2.6],
    color: '#fef08a',
  },
  {
    id: 'essen',
    floor: 'ground',
    name: 'Essen',
    nameIt: 'Zona Pranzo',
    area: '10,6 m²',
    bounds: { minX: -1.9, maxX: 1.4, minZ: -4.3, maxZ: -1.0 },
    center: [-0.2, 0, -2.6],
    color: '#fed7aa',
  },
  {
    id: 'wohnen',
    floor: 'ground',
    name: 'Wohnen',
    nameIt: 'Soggiorno con Camino',
    area: '19,8 m²',
    bounds: { minX: 1.4, maxX: 5.4, minZ: -4.3, maxZ: 0.1 },
    center: [3.4, 0, -2.1],
    color: '#fed7aa',
  },
  {
    id: 'speisekammer',
    floor: 'ground',
    name: 'Speisekammer',
    nameIt: 'Dispensa',
    area: '3,92 m²',
    bounds: { minX: -5.4, maxX: -1.9, minZ: -1.0, maxZ: 0.4 },
    center: [-3.6, 0, -0.3],
    color: '#f1f5f9',
  },
  {
    id: 'technik',
    floor: 'ground',
    name: 'Technik',
    nameIt: 'Locale Tecnico',
    area: '7,5 m²',
    bounds: { minX: -5.4, maxX: -1.9, minZ: 0.4, maxZ: 2.8 },
    center: [-3.6, 0, 1.6],
    color: '#cbd5e1',
  },
  {
    id: 'abstellk',
    floor: 'ground',
    name: 'Abstellk.',
    nameIt: 'Ripostiglio',
    area: '5,2 m²',
    bounds: { minX: -5.4, maxX: -1.9, minZ: 2.8, maxZ: 4.3 },
    center: [-3.6, 0, 3.5],
    color: '#f8fafc',
  },
  {
    id: 'wc-ground',
    floor: 'ground',
    name: 'WC',
    nameIt: 'Bagno Ospiti',
    area: '1,4 m²',
    bounds: { minX: 0.8, maxX: 2.0, minZ: 3.0, maxZ: 4.3 },
    center: [1.4, 0, 3.6],
    color: '#e0f2fe',
  },
  {
    id: 'einlieger-living',
    floor: 'ground',
    name: 'Einliegerwohnung',
    nameIt: 'Appartamento Ospiti (Living/Cottura)',
    area: '18,0 m²',
    bounds: { minX: 0.8, maxX: 5.4, minZ: 0.1, maxZ: 4.3 },
    center: [2.5, 0, 1.5],
    color: '#fef3c7',
  },
  {
    id: 'einlieger-bad',
    floor: 'ground',
    name: 'Bad (Einlieger)',
    nameIt: 'Bagno Alloggio Ospiti',
    area: 'ca. 4 m²',
    bounds: { minX: 2.7, maxX: 5.4, minZ: 0.1, maxZ: 1.6 },
    center: [4.0, 0, 0.85],
    color: '#bae6fd',
  },
];

export const ROOMS_FIRST: RoomInfo[] = [
  {
    id: 'flur-first',
    floor: 'first',
    name: 'Flur',
    nameIt: 'Disimpegno Piano Primo',
    area: '7 m²',
    bounds: { minX: -1.0, maxX: 2.0, minZ: -1.3, maxZ: 1.8 },
    center: [0.5, 3.0, 0.2],
    color: '#e2e8f0',
  },
  {
    id: 'galerie',
    floor: 'first',
    name: 'Galerie',
    nameIt: 'Galleria / Vista Nord',
    area: '7,5 m²',
    bounds: { minX: -1.0, maxX: 2.0, minZ: -4.3, maxZ: -1.3 },
    center: [0.5, 3.0, -2.8],
    color: '#fed7aa',
  },
  {
    id: 'bad-first',
    floor: 'first',
    name: 'Bad',
    nameIt: 'Bagno Padronale con Vasca',
    area: '14,3 m²',
    bounds: { minX: -5.4, maxX: -1.0, minZ: -4.3, maxZ: -0.8 },
    center: [-3.2, 3.0, -2.5],
    color: '#bfdbfe',
  },
  {
    id: 'anklei',
    floor: 'first',
    name: 'Ankleidez.',
    nameIt: 'Cabina Armadio',
    area: '8 m²',
    bounds: { minX: -5.4, maxX: -1.0, minZ: -0.8, maxZ: 1.2 },
    center: [-3.2, 3.0, 0.2],
    color: '#ffedd5',
  },
  {
    id: 'eltern',
    floor: 'first',
    name: 'Eltern',
    nameIt: 'Camera da Letto Padronale',
    area: '18 m²',
    bounds: { minX: -5.4, maxX: 0.0, minZ: 1.2, maxZ: 4.3 },
    center: [-2.7, 3.0, 2.7],
    color: '#fef3c7',
  },
  {
    id: 'kind1',
    floor: 'first',
    name: 'Kind I (con Soppalco)',
    nameIt: 'Camera 1 con Soppalco',
    area: '12 m²',
    bounds: { minX: 2.0, maxX: 5.4, minZ: -4.3, maxZ: -0.8 },
    center: [3.7, 3.0, -2.5],
    color: '#fbcfe8',
  },
  {
    id: 'buero',
    floor: 'first',
    name: 'Büro (con Soppalco)',
    nameIt: 'Ufficio / Studio con Soppalco',
    area: '7,5 m²',
    bounds: { minX: 2.0, maxX: 5.4, minZ: -0.8, maxZ: 1.4 },
    center: [3.7, 3.0, 0.3],
    color: '#fed7aa',
  },
  {
    id: 'kind2',
    floor: 'first',
    name: 'Kind II (con Soppalco)',
    nameIt: 'Camera 2 con Soppalco',
    area: '13,9 m²',
    bounds: { minX: 0.0, maxX: 5.4, minZ: 1.4, maxZ: 4.3 },
    center: [2.7, 3.0, 2.8],
    color: '#ddd6fe',
  },
];

export const GROUND_WALLS: WallDef[] = [
  // Muri Esterni Piano Terra
  // Nord (-4.3 Z)
  { x1: -5.4, z1: -4.3, x2: -1.9, z2: -4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.4, windowBottom: 0.9 },
  { x1: -1.9, z1: -4.3, x2: 1.4, z2: -4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 2.4, windowHeight: 2.3, windowBottom: 0.1 },
  { x1: 1.4, z1: -4.3, x2: 5.4, z2: -4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 2.4, windowHeight: 2.3, windowBottom: 0.1 },
  // Est (+5.4 X)
  { x1: 5.4, z1: -4.3, x2: 5.4, z2: 0.1, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.8, windowHeight: 1.6, windowBottom: 0.8 },
  { x1: 5.4, z1: 0.1, x2: 5.4, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.6, windowWidth: 1.6, windowHeight: 1.6, windowBottom: 0.8 },
  // Sud (+4.3 Z)
  { x1: -5.4, z1: 4.3, x2: -1.9, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.2, windowHeight: 1.2, windowBottom: 1.0 },
  { x1: -1.9, z1: 4.3, x2: 0.8, z2: 4.3, isExterior: true, hasDoor: true, doorPos: 0.55, doorWidth: 1.1, doorHeight: 2.2 },
  { x1: 0.8, z1: 4.3, x2: 2.0, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 0.7, windowHeight: 0.9, windowBottom: 1.3 },
  { x1: 2.0, z1: 4.3, x2: 5.4, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.6, windowBottom: 0.8 },
  // Ovest (-5.4 X)
  { x1: -5.4, z1: -4.3, x2: -5.4, z2: -1.0, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.4, windowHeight: 1.4, windowBottom: 0.9 },
  { x1: -5.4, z1: -1.0, x2: -5.4, z2: 0.4, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.0, windowHeight: 1.2, windowBottom: 1.0 },
  { x1: -5.4, z1: 0.4, x2: -5.4, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.4, windowWidth: 1.4, windowHeight: 1.2, windowBottom: 1.0 },

  // Muri Interni Piano Terra
  // Spina Ovest (X = -1.9, separa tecnico/dispensa dall'ingresso)
  { x1: -1.9, z1: -1.0, x2: -1.9, z2: 4.3, thickness: 0.18, hasDoor: true, doorPos: 0.65, doorWidth: 0.95, doorHeight: 2.15 },
  // Parete Cucina / Dispensa (Z = -1.0)
  { x1: -5.4, z1: -1.0, x2: -1.9, z2: -1.0, thickness: 0.16, hasDoor: true, doorPos: 0.45, doorWidth: 0.9, doorHeight: 2.15 },
  // Parete Dispensa / Tecnico (Z = +0.4)
  { x1: -5.4, z1: 0.4, x2: -1.9, z2: 0.4, thickness: 0.16 },
  // Parete Tecnico / Ripostiglio (Z = +2.8)
  { x1: -5.4, z1: 2.8, x2: -1.9, z2: 2.8, thickness: 0.16, hasDoor: true, doorPos: 0.5, doorWidth: 0.9, doorHeight: 2.15 },
  
  // Vano Scala Piano Terra (muri laterali a protezione della rampa)
  { x1: -0.2, z1: -0.8, x2: -0.2, z2: 1.8, thickness: 0.15 },
  { x1: 1.0, z1: -0.8, x2: 1.0, z2: 1.8, thickness: 0.15 },

  // Spina Est Alloggio Ospiti (X = +0.8)
  { x1: 0.8, z1: 0.1, x2: 0.8, z2: 4.3, thickness: 0.18, hasDoor: true, doorPos: 0.4, doorWidth: 0.95, doorHeight: 2.15 },
  // Bagno Ospiti WC (Z = +3.0, X: 0.8 a 2.0)
  { x1: 0.8, z1: 3.0, x2: 2.0, z2: 3.0, thickness: 0.16, hasDoor: true, doorPos: 0.5, doorWidth: 0.85, doorHeight: 2.15 },
  // Parete divisoria Alloggio Ospiti / Soggiorno (Z = 0.1, X: 1.0 a 5.4)
  { x1: 1.0, z1: 0.1, x2: 5.4, z2: 0.1, thickness: 0.18 },
  // Bagno Alloggio Ospiti Ovest (X = 2.7, Z: 0.1 a 1.6)
  { x1: 2.7, z1: 0.1, x2: 2.7, z2: 1.6, thickness: 0.16, hasDoor: true, doorPos: 0.5, doorWidth: 0.85, doorHeight: 2.15 },
  // Bagno Alloggio Ospiti Sud (Z = 1.6, X: 2.7 a 5.4)
  { x1: 2.7, z1: 1.6, x2: 5.4, z2: 1.6, thickness: 0.16 },
];

export const FIRST_WALLS: WallDef[] = [
  // Muri Esterni Primo Piano
  // Nord
  { x1: -5.4, z1: -4.3, x2: -1.0, z2: -4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.4, windowBottom: 0.9 },
  { x1: -1.0, z1: -4.3, x2: 2.0, z2: -4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 2.6, windowHeight: 2.3, windowBottom: 0.1 },
  { x1: 2.0, z1: -4.3, x2: 5.4, z2: -4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.8, windowHeight: 1.6, windowBottom: 0.8 },
  // Est
  { x1: 5.4, z1: -4.3, x2: 5.4, z2: -0.8, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.6, windowBottom: 0.8 },
  { x1: 5.4, z1: -0.8, x2: 5.4, z2: 1.4, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.6, windowBottom: 0.8 },
  { x1: 5.4, z1: 1.4, x2: 5.4, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.6, windowBottom: 0.8 },
  // Sud
  { x1: -5.4, z1: 4.3, x2: 0.0, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.45, windowWidth: 2.4, windowHeight: 1.8, windowBottom: 0.6 },
  { x1: 0.0, z1: 4.3, x2: 5.4, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.8, windowHeight: 1.6, windowBottom: 0.8 },
  // Ovest
  { x1: -5.4, z1: -4.3, x2: -5.4, z2: -0.8, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.4, windowHeight: 1.4, windowBottom: 0.9 },
  { x1: -5.4, z1: -0.8, x2: -5.4, z2: 1.2, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.4, windowHeight: 1.4, windowBottom: 0.9 },
  { x1: -5.4, z1: 1.2, x2: -5.4, z2: 4.3, isExterior: true, hasWindow: true, windowPos: 0.5, windowWidth: 1.6, windowHeight: 1.6, windowBottom: 0.8 },

  // Muri Interni Primo Piano (TUTTI CON PORTE DI ACCESSO DEDICATE, AMPIE E PERFETTAMENTE ACCESSIBILI)
  // 1. Parete Bagno Padronale da Galerie/Flur (X = -1.0, Z da -4.3 a -0.8): Porta per il Bagno
  { x1: -1.0, z1: -4.3, x2: -1.0, z2: -0.8, thickness: 0.18, hasDoor: true, doorPos: 0.65, doorWidth: 0.95, doorHeight: 2.15 },
  // 2. Parete tra Bagno e Cabina Armadio (Z = -0.8, X: -5.4 a -1.0)
  { x1: -5.4, z1: -0.8, x2: -1.0, z2: -0.8, thickness: 0.16 },
  // 3. Parete Cabina Armadio da Flur (X = -1.0, Z da -0.8 a 1.2): Ampia apertura con porte per la cabina armadio
  { x1: -1.0, z1: -0.8, x2: -1.0, z2: 1.2, thickness: 0.18, hasDoor: true, doorPos: 0.5, doorWidth: 1.1, doorHeight: 2.15 },
  // 4. Parete tra Cabina Armadio e Camera Padronale (Z = 1.2, X: -5.4 a -1.0)
  { x1: -5.4, z1: 1.2, x2: -1.0, z2: 1.2, thickness: 0.16 },
  // 5. Parete Ingresso Camera Padronale Eltern da Flur Ovest (Z = 1.2, X: -1.0 a -0.2): Porta d'ingresso camera matrimoniale
  { x1: -1.0, z1: 1.2, x2: -0.2, z2: 1.2, thickness: 0.18, hasDoor: true, doorPos: 0.5, doorWidth: 0.75, doorHeight: 2.15 },

  // 6. Parete Camera 1 (Kind I) da Galerie/Flur (X = 2.0, Z da -4.3 a -0.8): Porta d'ingresso Camera 1
  { x1: 2.0, z1: -4.3, x2: 2.0, z2: -0.8, thickness: 0.18, hasDoor: true, doorPos: 0.65, doorWidth: 0.95, doorHeight: 2.15 },
  // 7. Parete tra Camera 1 e Studio Büro (Z = -0.8, X: 2.0 a 5.4)
  { x1: 2.0, z1: -0.8, x2: 5.4, z2: -0.8, thickness: 0.16 },
  // 8. Parete Studio Büro da Flur (X = 2.0, Z da -0.8 a 1.4): Porta d'ingresso Studio
  { x1: 2.0, z1: -0.8, x2: 2.0, z2: 1.4, thickness: 0.18, hasDoor: true, doorPos: 0.5, doorWidth: 0.95, doorHeight: 2.15 },
  // 9. Parete tra Studio e Camera 2 (Z = 1.4, X: 2.0 a 5.4)
  { x1: 2.0, z1: 1.4, x2: 5.4, z2: 1.4, thickness: 0.16 },
  // 10. Parete Ingresso Camera 2 (Kind II) da Flur Est (Z = 1.4, X: 1.0 a 2.0): Porta d'ingresso Camera 2 (Completamente aperta e accessibile dal corridoio est!)
  { x1: 1.0, z1: 1.4, x2: 2.0, z2: 1.4, thickness: 0.18, hasDoor: true, doorPos: 0.5, doorWidth: 0.85, doorHeight: 2.15 },

  // 11. Parete divisoria Camera Matrimoniale Eltern / Camera 2 Kind II a Sud (X = 0.0, Z da 1.8 a 4.3)
  { x1: 0.0, z1: 1.8, x2: 0.0, z2: 4.3, thickness: 0.18 },
  // 12. Parapetto / Parete di fondo del vano scala a Sud (Z = 1.8, X: -0.2 a 1.0)
  { x1: -0.2, z1: 1.8, x2: 1.0, z2: 1.8, thickness: 0.16 },
];
