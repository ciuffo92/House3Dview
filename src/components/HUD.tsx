import React, { useState } from 'react';
import { FloorId, CameraViewMode } from '../types';
import { Minimap } from './Minimap';
import {
  Compass,
  Download,
  Copy,
  Sun,
  Moon,
  Layers,
  Eye,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Check,
  Ghost,
} from 'lucide-react';

interface HUDProps {
  isLocked: boolean;
  currentFloor: FloorId;
  currentRoom: string;
  playerPosition: { x: number; y: number; z: number };
  playerYaw: number;
  viewMode: CameraViewMode;
  showCeilings: boolean;
  nightMode: boolean;
  ghostMode: boolean;
  onLockPointer: () => void;
  onTeleport: (target: 'ground' | 'first' | 'living' | 'kitchen' | 'master' | 'stairs' | 'kind2') => void;
  onToggleViewMode: () => void;
  onToggleCeilings: () => void;
  onToggleNightMode: () => void;
  onToggleGhostMode: () => void;
  onDownloadHtml: () => void;
  onCopyHtml: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  isLocked,
  currentFloor,
  currentRoom,
  playerPosition,
  playerYaw,
  viewMode,
  showCeilings,
  nightMode,
  ghostMode,
  onLockPointer,
  onTeleport,
  onToggleViewMode,
  onToggleCeilings,
  onToggleNightMode,
  onToggleGhostMode,
  onDownloadHtml,
  onCopyHtml,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyHtml();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Center FPS Crosshair (visible when locked in walk mode) */}
      {isLocked && viewMode === 'fps' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute w-5 h-[1.5px] bg-white/40" />
          <div className="absolute h-5 w-[1.5px] bg-white/40" />
        </div>
      )}

      {/* Top Status Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-900/85 border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-lg pointer-events-auto backdrop-blur-md">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide text-white ${
            currentFloor === 'ground' ? 'bg-sky-600' : 'bg-purple-600'
          }`}
        >
          {currentFloor === 'ground' ? 'Piano Terra' : 'Primo Piano'}
        </span>
        {ghostMode && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Ghost className="w-3 h-3 text-emerald-400" /> Ghost
          </span>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-100">{currentRoom}</span>
          <span className="text-[11px] text-slate-400">
            Quota: {playerPosition.y.toFixed(2)} m
          </span>
        </div>
      </div>

      {/* Top Right Minimap & Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 shadow-md flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          {showMinimap ? 'Nascondi Mappa' : 'Mostra Mappa'}
        </button>

        {showMinimap && (
          <Minimap
            currentFloor={currentFloor}
            playerPosition={playerPosition}
            playerYaw={playerYaw}
          />
        )}
      </div>

      {/* Start / Unlocked Overlay Modal */}
      {!isLocked && viewMode === 'fps' && (
        <div
          onClick={onLockPointer}
          className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm cursor-pointer p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-slate-700 max-w-xl w-full rounded-2xl p-7 shadow-2xl text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 mb-3">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Navigazione 3D in Prima Persona
            </h2>
            <p className="text-slate-300 text-sm mb-5 leading-relaxed">
              Esplora liberamente la casa su entrambi i piani. Usa le scale centrali per salire al primo piano o scendere al piano terra.
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 text-sky-300 px-2 py-1 rounded font-semibold">
                  W A S D / Frecce
                </span>
                <span>Movimento</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 text-sky-300 px-2 py-1 rounded font-semibold">
                  Mouse
                </span>
                <span>Guardati intorno</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 text-sky-300 px-2 py-1 rounded font-semibold">
                  Shift
                </span>
                <span>Scatta / Corri</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 text-sky-300 px-2 py-1 rounded font-semibold">
                  Scale
                </span>
                <span>Cammina sulle scale</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 text-sky-300 px-2 py-1 rounded font-semibold">
                  ESC
                </span>
                <span>Sblocca mouse / Pausa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 text-sky-300 px-2 py-1 rounded font-semibold">
                  1 / 2
                </span>
                <span>Piano Terra / 1° Piano</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 bg-emerald-950/40 border border-emerald-800/50 p-1.5 rounded-lg">
                <span className="font-mono bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                  G
                </span>
                <span className="text-emerald-300 font-medium text-[11px]">
                  Attraversa Muri Interni (Ghost Mode ON/OFF)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onLockPointer}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-7 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                CLICCA PER ENTRARE E NAVIGARE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Bottom Control Dock (collapsible, zero viewport occlusion) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-4xl pointer-events-auto">
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-t-lg border-t border-x border-slate-700/80 shadow flex items-center gap-1 backdrop-blur-md"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Mostra Strumenti
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Nascondi Barra
              </>
            )}
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5">
            {/* Quick Teleport Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                Teletrasporto:
              </span>
              <button
                onClick={() => onTeleport('ground')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🚪 P. Terra (Ingresso)
              </button>
              <button
                onClick={() => onTeleport('first')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🪜 1° Piano (Galleria)
              </button>
              <button
                onClick={() => onTeleport('living')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🔥 Soggiorno / Camino
              </button>
              <button
                onClick={() => onTeleport('kitchen')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🍳 Cucina
              </button>
              <button
                onClick={() => onTeleport('master')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🛏️ Camera Master
              </button>
              <button
                onClick={() => onTeleport('kind2')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🧸 Camera 2 (Kind II)
              </button>
              <button
                onClick={() => onTeleport('stairs')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700"
              >
                🦶 Inizio Scale
              </button>
            </div>

            {/* View & Lighting Toggles */}
            <div className="flex items-center gap-1.5 border-l border-slate-700/80 pl-2.5">
              <button
                onClick={onToggleGhostMode}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-medium ${
                  ghostMode
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Attiva/Disattiva attraversamento muri interni (Tasto G)"
              >
                <Ghost className={`w-3.5 h-3.5 ${ghostMode ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                {ghostMode ? 'Muri Passanti ON' : 'Muri Solidi'}
              </button>

              <button
                onClick={onToggleViewMode}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  viewMode === 'orbit'
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Passa da Prima Persona a Vista Spaccato 3D"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {viewMode === 'fps' ? 'Vista 3D Spaccato' : 'Modalità FPS'}
              </button>

              <button
                onClick={onToggleCeilings}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  showCeilings
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                }`}
                title="Mostra/Nascondi Tetti e Soffitti per vedere dentro"
              >
                <Layers className="w-3.5 h-3.5" />
                {showCeilings ? 'Tetti ON' : 'Tetti OFF'}
              </button>

              <button
                onClick={onToggleNightMode}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs p-1.5 rounded-lg border border-slate-700"
                title="Giorno / Notte con luci d'ambiente"
              >
                {nightMode ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {/* Standalone HTML Export Buttons */}
              <button
                onClick={onDownloadHtml}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1 shadow"
                title="Scarica il file HTML autonomo"
              >
                <Download className="w-3.5 h-3.5" />
                Scarica HTML
              </button>

              <button
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
                title="Copia il codice HTML autonomo negli appunti"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiato!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copia Codice
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
