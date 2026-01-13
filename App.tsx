
import React, { useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import CatalogModel from './components/CatalogModel';
import Controls from './components/Controls';
import { AppState } from './types';
import { INITIAL_FRONT_TEXT, INITIAL_BACK_TEXT } from './constants';

const Headlight = () => {
  const ref = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();
  
  useFrame(() => {
    if (ref.current) {
      ref.current.position.copy(camera.position);
    }
  });

  return <directionalLight ref={ref} intensity={1.5} />;
};

const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [state, setState] = useState<AppState>({
    isOpen: true,
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
        <Canvas shadows camera={{ position: [0, 0, 450], fov: 45 }}>
          <color attach="background" args={['#f3f4f6']} />
          
          <ambientLight intensity={0.7} />
          <Headlight />
          <Environment preset="studio" blur={1} />
          
          <Center>
            <CatalogModel state={state} />
          </Center>
          
          <OrbitControls 
            makeDefault 
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
