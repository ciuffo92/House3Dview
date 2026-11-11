import React from 'react';
import { FloorId, RoomInfo } from '../types';
import { ROOMS_GROUND, ROOMS_FIRST, HOUSE_DIMENSIONS } from '../constants/floorplanData';

interface MinimapProps {
  currentFloor: FloorId;
  playerPosition: { x: number; z: number };
  playerYaw: number;
}

export const Minimap: React.FC<MinimapProps> = ({
  currentFloor,
  playerPosition,
  playerYaw,
}) => {
  const rooms: RoomInfo[] = currentFloor === 'ground' ? ROOMS_GROUND : ROOMS_FIRST;

  // Map world bounds [-5.4, 5.4] to map [0, 200], depth [-4.3, 4.3] to [0, 160]
  const mapW = 190;
  const mapH = 155;
  const padding = 10;
  const contentW = mapW - padding * 2;
  const contentH = mapH - padding * 2;

  const worldXToMap = (x: number) => {
    const norm = (x - HOUSE_DIMENSIONS.minX) / HOUSE_DIMENSIONS.width;
    return padding + norm * contentW;
  };

  const worldZToMap = (z: number) => {
    const norm = (z - HOUSE_DIMENSIONS.minZ) / HOUSE_DIMENSIONS.depth;
    return padding + norm * contentH;
  };

  const playerMapX = worldXToMap(playerPosition.x);
  const playerMapY = worldZToMap(playerPosition.z);

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between text-xs font-semibold px-1 pb-1.5 border-b border-slate-700/60 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          Planimetria: {currentFloor === 'ground' ? 'Piano Terra' : '1° Piano'}
        </span>
        <span className="text-[10px] text-slate-400">Nord ↑</span>
      </div>

      <svg width={mapW} height={mapH} className="bg-slate-950/70 rounded-lg overflow-hidden border border-slate-800">
        {/* Exterior border */}
        <rect
          x={padding}
          y={padding}
          width={contentW}
          height={contentH}
          fill="none"
          stroke="#475569"
          strokeWidth="3"
        />

        {/* Rooms */}
        {rooms.map((r) => {
          const rx = worldXToMap(r.bounds.minX);
          const ry = worldZToMap(r.bounds.minZ);
          const rw = worldXToMap(r.bounds.maxX) - rx;
          const rh = worldZToMap(r.bounds.maxZ) - ry;
          return (
            <g key={r.id}>
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill={r.color}
                fillOpacity="0.15"
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={rx + rw / 2}
                y={ry + rh / 2}
                fontSize="7"
                fill="#cbd5e1"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-medium select-none pointer-events-none"
              >
                {r.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* Staircase Indicator */}
        <rect
          x={worldXToMap(HOUSE_DIMENSIONS.stair.minX)}
          y={worldZToMap(HOUSE_DIMENSIONS.stair.minZ)}
          width={worldXToMap(HOUSE_DIMENSIONS.stair.maxX) - worldXToMap(HOUSE_DIMENSIONS.stair.minX)}
          height={worldZToMap(HOUSE_DIMENSIONS.stair.maxZ) - worldZToMap(HOUSE_DIMENSIONS.stair.minZ)}
          fill="#d97706"
          fillOpacity="0.25"
          stroke="#b45309"
          strokeWidth="1.5"
        />
        <text
          x={worldXToMap((HOUSE_DIMENSIONS.stair.minX + HOUSE_DIMENSIONS.stair.maxX) / 2)}
          y={worldZToMap((HOUSE_DIMENSIONS.stair.minZ + HOUSE_DIMENSIONS.stair.maxZ) / 2)}
          fontSize="6.5"
          fill="#fbbf24"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bold select-none"
        >
          SCALE
        </text>

        {/* Player Indicator & View Cone */}
        <g transform={`translate(${playerMapX}, ${playerMapY})`}>
          {/* View field arrow */}
          <path
            d="M 0 0 L -8 -16 L 8 -16 Z"
            fill="#38bdf8"
            fillOpacity="0.4"
            transform={`rotate(${(playerYaw * 180) / Math.PI + 180})`}
          />
          {/* Player dot */}
          <circle r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
