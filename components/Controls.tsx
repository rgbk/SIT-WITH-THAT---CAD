
import React from 'react';
import { AppState, FONTS, FontConfig, FoilType } from '../types';

interface ControlsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isOpen: boolean;
  onClose: () => void;
}

const Controls: React.FC<ControlsProps> = ({ state, setState, isOpen, onClose }) => {
  const updateFontConfig = (updates: Partial<FontConfig>) => {
    setState(prev => ({ ...prev, fontConfig: { ...prev.fontConfig, ...updates } }));
  };

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
             <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>

        <h1 className="text-2xl font-bold mb-6 tracking-tight pr-10">Configuration</h1>

        {/* View Controls */}
        <div className="mb-8 border-b pb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setState(s => ({ ...s, isOpen: true }))}
              className={`flex-1 py-2 px-4 rounded border ${state.isOpen ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-gray-400'}`}
            >
              Open
            </button>
            <button
              onClick={() => setState(s => ({ ...s, isOpen: false }))}
              className={`flex-1 py-2 px-4 rounded border ${!state.isOpen ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-gray-400'}`}
            >
              Closed
            </button>
          </div>
          
          <div className="flex items-center">
              <input 
                  type="checkbox" 
                  id="debug-mode"
                  checked={state.showDebug}
                  onChange={(e) => setState(s => ({ ...s, showDebug: e.target.checked }))}
                  className="mr-2 accent-black"
              />
              <label htmlFor="debug-mode" className="text-xs text-gray-600">Show Edges (Debug)</label>
          </div>
        </div>

        {/* Colors & Materials */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-4">Materials</h2>
          
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Paper Color</label>
            <div className="flex items-center gap-3">
              <div className="relative overflow-hidden w-12 h-12 rounded-full border border-gray-300 shadow-sm">
                <input 
                  type="color" 
                  value={state.paperColor} 
                  onChange={(e) => setState(s => ({ ...s, paperColor: e.target.value }))}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                />
              </div>
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">Custom Color</span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">{state.paperColor}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Foil Finish</label>
              <div className="flex gap-2 mb-4">
                   {(['metallic', 'gloss', 'matte'] as FoilType[]).map(type => (
                       <button
                          key={type}
                          onClick={() => setState(s => ({ ...s, foilType: type }))}
                          className={`flex-1 py-2 px-2 text-xs rounded border capitalize transition-all ${
                              state.foilType === type 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                       >
                           {type}
                       </button>
                   ))}
              </div>

              {state.foilType === 'metallic' ? (
                  <div className="p-3 bg-gray-100 rounded text-center border border-gray-200">
                      <span className="text-xs font-semibold text-gray-500">Finish: Chrome / Silver Mirror</span>
                  </div>
              ) : (
                <div className="animate-fade-in">
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Foil Color</label>
                    <div className="flex items-center gap-3">
                        <div className="relative overflow-hidden w-full h-10 rounded border border-gray-300">
                            <input 
                            type="color" 
                            value={state.foilColor} 
                            onChange={(e) => setState(s => ({ ...s, foilColor: e.target.value }))}
                            className="absolute -top-2 -left-2 w-[120%] h-[150%] cursor-pointer p-0 border-0"
                            />
                        </div>
                    </div>
                </div>
              )}
          </div>
        </div>

        {/* Global Typography */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-4">Typography</h2>
          <FontControls config={state.fontConfig} update={updateFontConfig} />
        </div>

        {/* Content */}
        <div className="mb-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2">Content</h2>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Front Cover</label>
            <textarea
                value={state.frontText}
                onChange={(e) => setState(s => ({ ...s, frontText: e.target.value }))}
                className="w-full h-24 p-3 border rounded text-xs font-mono bg-gray-50 focus:border-black outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Back Cover</label>
            <textarea
                value={state.backText}
                onChange={(e) => setState(s => ({ ...s, backText: e.target.value }))}
                className="w-full h-24 p-3 border rounded text-xs font-mono bg-gray-50 focus:border-black outline-none resize-y"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const FontControls = ({ config, update }: { config: FontConfig, update: (c: Partial<FontConfig>) => void }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-xs text-gray-500 mb-1">Typeface</label>
            <select 
                value={config.family} 
                onChange={(e) => update({ family: e.target.value })}
                className="w-full p-2 border rounded text-xs bg-white text-gray-800 focus:outline-none focus:border-black shadow-sm"
            >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs text-gray-500 mb-1">Size</label>
                <input 
                    type="range" min="2" max="20" step="0.5" 
                    value={config.size} 
                    onChange={(e) => update({ size: parseFloat(e.target.value) })}
                    className="w-full accent-black"
                />
            </div>
            <div>
                 <label className="block text-xs text-gray-500 mb-1">Line Height</label>
                <input 
                    type="range" min="0.8" max="2.5" step="0.1" 
                    value={config.lineHeight} 
                    onChange={(e) => update({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full accent-black"
                />
            </div>
             <div>
                 <label className="block text-xs text-gray-500 mb-1">Tracking ({config.letterSpacing})</label>
                <input 
                    type="range" min="-0.1" max="0.5" step="0.01" 
                    value={config.letterSpacing} 
                    onChange={(e) => update({ letterSpacing: parseFloat(e.target.value) })}
                    className="w-full accent-black"
                />
            </div>
             <div className="flex items-center pt-4">
                <input 
                    type="checkbox" 
                    checked={config.uppercase} 
                    onChange={(e) => update({ uppercase: e.target.checked })}
                    className="mr-2 accent-black h-4 w-4"
                />
                <label className="text-xs text-gray-500">Uppercase</label>
            </div>
        </div>
    </div>
)

export default Controls;
