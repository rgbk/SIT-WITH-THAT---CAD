
import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Environment, ContactShadows, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import CatalogModel from './components/CatalogModel';
import Controls from './components/Controls';
import { AppState } from './types';
import { INITIAL_FRONT_TEXT, INITIAL_BACK_TEXT } from './constants';

function CameraView({ detail, reset }: { detail: boolean; reset: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, detail ? 55 : 0, detail ? 260 : 520);
    camera.lookAt(0, detail ? 55 : 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, detail, reset]);
  return null;
}

const App: React.FC = () => {
  const [detail, setDetail] = useState(false);
  const [viewReset, setViewReset] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [state, setState] = useState<AppState>({
    isOpen: false,
    debossDepth: 0.22,
    showDebug: false,
    paperColor: '#D8262C', // GF Smith Colorplan Red (Approx)
    foilColor: '#E6E6E6', // Silver foil
    foilType: 'metallic',
    frontText: INITIAL_FRONT_TEXT,
    backText: INITIAL_BACK_TEXT,
    fontConfig: {
      family: 'Inter',
      size: 5, // Smaller size to fit the list
      letterSpacing: 0.02,
      lineHeight: 1.4,
      uppercase: false // Disabled to support mixed case input
    }
  });

  return (
    <div className="w-full h-screen relative bg-[#e0e0e0] overflow-hidden">
      <div className="w-full h-full absolute top-0 left-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 520], fov: 38 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}>
          <CameraView detail={detail} reset={viewReset} />
          <color attach="background" args={['#f3f4f6']} />

          <ambientLight intensity={0.35} />
          <directionalLight position={[-180, 250, 300]} intensity={1.6} />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={4} position={[-150, 100, 220]} scale={[120, 350, 1]} target={[0,0,0]} />
            <Lightformer form="rect" intensity={1.5} position={[200, 40, 100]} scale={[40, 300, 1]} target={[0,0,0]} />
            <Lightformer form="rect" intensity={2} position={[0, 240, -100]} scale={[300, 80, 1]} target={[0,0,0]} />
          </Environment>

          <Center>
            <CatalogModel state={state} />
          </Center>

          <OrbitControls
            makeDefault
            target={detail ? [0,55,0] : [0,0,0]}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            enableDamping={true}
            dampingFactor={0.05}
            enablePan={true}
            screenSpacePanning={true}
          />

          <ContactShadows
            position={[0, -120, 0]}
            opacity={0.4}
            scale={500}
            blur={2.5}
            far={200}
            color="#000000"
          />
        </Canvas>
      </div>

      <div className="absolute top-6 left-6 z-10 flex gap-2">
        <button className="bg-white/95 text-gray-800 px-3 py-2 rounded shadow text-xs" onClick={() => { setState(s => ({ ...s, isOpen: false })); setDetail(false); setViewReset(n => n+1); }}>Front view</button>
        <button className="bg-white/95 text-gray-800 px-3 py-2 rounded shadow text-xs" onClick={() => { setState(s => ({ ...s, isOpen: false })); setDetail(true); setViewReset(n => n+1); }}>Foil detail</button>
      </div>

      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Catalog Visualizer</h1>
        <div className="text-xs text-gray-500 mb-4 flex flex-col gap-1">
            <p>• Left Click + Drag to Rotate</p>
            <p>• Right Click + Drag to Move (Pan)</p>
            <p>• Scroll to Zoom</p>
        </div>

        <button
          onClick={() => setIsPanelOpen(true)}
          className={`pointer-events-auto flex items-center gap-2 bg-black text-white px-4 py-3 rounded shadow-lg hover:bg-gray-800 transition-opacity duration-300 ${isPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
          <span className="text-sm font-semibold">Configure</span>
        </button>
      </div>

      <Controls
        state={state}
        setState={setState}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default App;
