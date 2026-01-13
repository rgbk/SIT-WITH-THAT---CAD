
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { Edges } from '@react-three/drei';
import { AppState } from '../types'; 
import FoilText from './FoilText';
import { DIMS as DIMENSIONS } from '../constants'; 

interface CatalogModelProps {
  state: AppState;
}

// Convert MM to Scene Units (1 unit = 1mm for simplicity)
const { frontW, frontH, backW, backH, flapTopH, flapBottomH, flapSideW, beltW, beltH, spineW, paperThickness } = DIMENSIONS;

const PaperMaterial = ({ color }: { color: string }) => (
  <meshStandardMaterial
    color={color}
    roughness={0.9} // Matte paper
    metalness={0.0}
    side={THREE.DoubleSide}
  />
);

const DebugEdges = ({ active }: { active: boolean }) => (
    active ? <Edges threshold={15} color="#222" linewidth={1.5} /> : <Edges threshold={20} color="#000" opacity={0.1} transparent linewidth={0.5} />
)

const CatalogModel: React.FC<CatalogModelProps> = ({ state }) => {
  const group = useRef<THREE.Group>(null);

  // Animation Springs
  const { openFactor } = useSpring({
    openFactor: state.isOpen ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 30 },
  });

  const degToRad = (deg: number) => deg * (Math.PI / 180);

  // Belt Shape Geometry - Convex Cap sticking OUT to the left
  const beltShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = beltW;
    const h = beltH;
    const r = h / 2; // Full round end
    
    // Draw belt shape from pivot (right side) extending left to -w
    shape.moveTo(0, h/2);
    shape.lineTo(-(w - r), h/2);
    shape.absarc(-(w - r), 0, r, Math.PI / 2, Math.PI * 1.5, false);
    shape.lineTo(0, -h/2);
    shape.lineTo(0, h/2);
    
    return shape;
  }, []);

  const beltGeometry = useMemo(() => new THREE.ExtrudeGeometry(beltShape, { depth: paperThickness, bevelEnabled: false }), [beltShape]);

  return (
    <group ref={group} rotation={[-Math.PI / 4, 0, 0]}> 
      
      {/* --- BACK PANEL (ROOT) --- */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[backW, backH, paperThickness]} />
        <PaperMaterial color={state.paperColor} />
        <DebugEdges active={state.showDebug} />
        
        {/* Back Content - Moved to Outside Face (-Z) and Rotated to face out */}
        <FoilText
           text={state.backText}
           config={state.fontConfig}
           foilType={state.foilType}
           foilColor={state.foilColor}
           width={backW}
           height={backH}
           position={[0, 0, -paperThickness / 2 - 0.05]} 
           rotation={[0, Math.PI, 0]} 
        />

        {/* --- TOP FLAP --- */}
        <animated.group
          position={[0, backH / 2, 0]}
          rotation-x={openFactor.to(o => degToRad(-179 * (1 - o)))}
        >
           <group position={[0, flapTopH / 2, paperThickness / 2]}> 
                <mesh>
                    <boxGeometry args={[backW, flapTopH, paperThickness]} />
                    <PaperMaterial color={state.paperColor} />
                    <DebugEdges active={state.showDebug} />
                </mesh>
           </group>
        </animated.group>

        {/* --- BOTTOM FLAP --- */}
        <animated.group
          position={[0, -backH / 2, 0]}
          rotation-x={openFactor.to(o => degToRad(179 * (1 - o)))}
        >
             <group position={[0, -flapBottomH / 2, paperThickness / 2]}>
                <mesh>
                    <boxGeometry args={[backW, flapBottomH, paperThickness]} />
                    <PaperMaterial color={state.paperColor} />
                    <DebugEdges active={state.showDebug} />
                </mesh>
             </group>
        </animated.group>

        {/* --- SIDE FLAP (RIGHT) --- */}
        <animated.group
          position={[backW / 2, 0, 0]}
          rotation-y={openFactor.to(o => degToRad(-179 * (1 - o)))}
        >
             <group position={[flapSideW / 2, 0, paperThickness / 2]}>
                <mesh>
                    <boxGeometry args={[flapSideW, backH, paperThickness]} />
                    <PaperMaterial color={state.paperColor} />
                    <DebugEdges active={state.showDebug} />
                </mesh>
             </group>
        </animated.group>

        {/* --- SPINE (LEFT) --- */}
        <animated.group
          position={[-backW / 2, 0, 0]} // Left edge of Back
          rotation-y={openFactor.to(o => degToRad(90 * (1 - o)))} // Folds UP 90 deg
        >
            {/* Spine Geometry */}
            <group position={[-spineW / 2, 0, 0]}> {/* Center of spine */}
                <mesh>
                    <boxGeometry args={[spineW, backH, paperThickness]} />
                    <PaperMaterial color={state.paperColor} />
                    <DebugEdges active={state.showDebug} />
                </mesh>

                {/* --- FRONT PANEL --- */}
                <animated.group
                    position={[-spineW / 2, 0, 0]} // Left edge of Spine
                    rotation-y={openFactor.to(o => degToRad(90 * (1 - o)))} // Folds another 90 deg to cover back
                >
                    {/* Front Panel Geometry */}
                    <group position={[-frontW / 2, 0, 0]}>
                        <mesh>
                            <boxGeometry args={[frontW, frontH, paperThickness]} />
                            <PaperMaterial color={state.paperColor} />
                            <DebugEdges active={state.showDebug} />
                            
                            {/* Front Text - Moved to Outside Face (-Z) and Rotated to face out */}
                            <FoilText
                                text={state.frontText}
                                config={state.fontConfig}
                                foilType={state.foilType}
                                foilColor={state.foilColor}
                                width={frontW}
                                height={frontH}
                                position={[0, 0, -paperThickness / 2 - 0.05]}
                                rotation={[0, Math.PI, 0]}
                            />
                        </mesh>

                        {/* --- BELT SYSTEM --- */}
                         <animated.group
                            position={[-frontW / 2, 0, 0]} 
                            rotation-y={openFactor.to(o => degToRad(-90 * (1 - o)))}
                         >
                            <group position={[-6, 0, 0]}>
                                <mesh>
                                     <boxGeometry args={[12, beltH, paperThickness]} />
                                     <PaperMaterial color={state.paperColor} />
                                     <DebugEdges active={state.showDebug} />
                                </mesh>
                                
                                <animated.group
                                    position={[-6, 0, 0]}
                                    rotation-y={openFactor.to(o => degToRad(-90 * (1 - o)))}
                                >
                                     <mesh geometry={beltGeometry} rotation={[0, 0, 0]}>
                                         <PaperMaterial color={state.paperColor} />
                                         <DebugEdges active={state.showDebug} />
                                     </mesh>
                                </animated.group>
                            </group>
                         </animated.group>
                    </group>
                </animated.group>
            </group>
        </animated.group>

      </mesh>
    </group>
  );
};

export default CatalogModel;
