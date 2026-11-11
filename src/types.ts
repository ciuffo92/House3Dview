export type FloorId = 'ground' | 'first';

export type CameraViewMode = 'fps' | 'orbit' | 'topDown';

export interface RoomInfo {
  id: string;
  floor: FloorId;
  name: string;
  nameIt: string;
  area: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  center: [number, number, number];
  color: string;
}

export interface WallDef {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  height?: number;
  thickness?: number;
  hasDoor?: boolean;
  doorPos?: number; // 0 to 1 along wall
  doorWidth?: number;
  doorHeight?: number;
  hasWindow?: boolean;
  windowPos?: number;
  windowWidth?: number;
  windowBottom?: number;
  windowHeight?: number;
  isExterior?: boolean;
}

export interface PlayerState {
  isLocked: boolean;
  canMove: boolean;
  currentFloor: FloorId;
  currentRoom: string;
  position: { x: number; y: number; z: number };
  isSprinting: boolean;
}
