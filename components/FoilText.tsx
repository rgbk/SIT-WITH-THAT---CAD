import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { FontConfig, FoilType } from '../types';

interface FoilTextProps {
  text: string;
  config: FontConfig;
  foilType: FoilType;
  foilColor: string;
  paperColor: string;
  debossDepth: number;
  width: number;
  height: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const FONT_URLS: Record<string, string> = {
  'Inter': 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf',
  'Roboto': 'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbVmUiA8.ttf',
  'Playfair Display': 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtY.ttf',
  'Lora': 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqg.ttf',
  'Oswald': 'https://fonts.gstatic.com/s/oswald/v57/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiYA.ttf',
  'Montserrat': 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf'
};

const fontLoads = new Map<string, Promise<FontFace>>();
function loadFont(family: string) {
  if (!fontLoads.has(family)) {
    const face = new FontFace(`Foil ${family}`, `url(${FONT_URLS[family] || FONT_URLS.Inter})`);
    fontLoads.set(family, face.load().then(loaded => {
      document.fonts.add(loaded);
      return loaded;
    }));
  }
  return fontLoads.get(family)!;
}

// A single paper surface carries the foil mask and the recessed height field.
// This avoids floating letters: the shaded bevel follows the same glyph outline.
const FoilText: React.FC<FoilTextProps> = (props) => {
  const [loadedFamily, setLoadedFamily] = useState('');
  useEffect(() => {
    let active = true;
    loadFont(props.config.family).then(() => {
      if (active) setLoadedFamily(props.config.family);
    }).catch(() => { if (active) setLoadedFamily('sans-serif'); });
    return () => { active = false; };
  }, [props.config.family]);

  const maps = useMemo(() => {
    const scale = 12; // pixels per millimetre; retains small type at close zoom
    const w = Math.round(props.width * scale), h = Math.round(props.height * scale);
    const canvas = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const mask = canvas(), ctx = mask.getContext('2d')!;
    ctx.font = `${props.config.size * scale}px "Foil ${loadedFamily}", sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.letterSpacing = `${props.config.letterSpacing * props.config.size * scale}px`;
    const text = props.config.uppercase ? props.text.toUpperCase() : props.text;
    let y = 12 * scale;
    const maxWidth = (props.width - 24) * scale;
    for (const paragraph of text.split('\n')) {
      let line = '';
      for (const word of paragraph.split(/\s+/)) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > maxWidth) {
          ctx.fillText(line, 12 * scale, y);
          y += props.config.size * props.config.lineHeight * scale;
          line = word;
        } else line = next;
      }
      ctx.fillText(line, 12 * scale, y);
      y += props.config.size * props.config.lineHeight * scale;
    }
    const blurred = canvas(), bc = blurred.getContext('2d')!;
    bc.filter = 'blur(1.5px)'; bc.drawImage(mask, 0, 0);
    const glyph = ctx.getImageData(0, 0, w, h).data;
    const bevel = bc.getImageData(0, 0, w, h).data;
    const color = canvas(), metal = canvas(), rough = canvas(), height = canvas();
    const surfaces = [color, metal, rough, height].map(c => c.getContext('2d')!.createImageData(w,h));
    const paper = new THREE.Color(props.paperColor).convertLinearToSRGB();
    const foil = new THREE.Color(props.foilType === 'metallic' ? '#e6e6e6' : props.foilColor).convertLinearToSRGB();
    for (let i = 0; i < glyph.length; i += 4) {
      const a = glyph[i+3] / 255, b = bevel[i+3] / 255;
      const px = (i / 4) % w, py = Math.floor(i / 4 / w);
      const grain = (Math.sin(px * 12.9898 + py * 78.233) * 43758.5453) % 1;
      const inkRoughness = props.foilType === 'metallic' ? 0.2 : props.foilType === 'gloss' ? 0.14 : 0.8;
      for (let channel = 0; channel < 3; channel++) {
        const key = (['r','g','b'] as const)[channel];
        surfaces[0].data[i+channel] = 255 * (paper[key]*(1-a)+foil[key]*a) + grain * 1.3 * (1-a);
        surfaces[1].data[i+channel] = props.foilType === 'metallic' ? a*255 : 0;
        surfaces[2].data[i+channel] = 255 * (0.88*(1-a)+inkRoughness*a) + grain * 2;
        // Dark glyphs are below the paper; soft transition makes a rounded die shoulder.
        surfaces[3].data[i+channel] = 220 - b*170 + grain*3*(1-a) + a*(5*Math.sin(px*0.055 + py*0.012) + 3*Math.sin(py*0.09));
      }
      for (const surface of surfaces) surface.data[i+3] = 255;
    }
    const textures = [color, metal, rough, height].map((c,i) => {
      c.getContext('2d')!.putImageData(surfaces[i],0,0);
      const texture = new THREE.CanvasTexture(c);
      texture.anisotropy = 8;
      return texture;
    });
    textures[0].colorSpace = THREE.SRGBColorSpace;
    return textures;
  }, [props.text, props.config, props.width, props.height, props.paperColor, props.foilColor, props.foilType, loadedFamily]);
  useEffect(() => () => maps.forEach(map => map.dispose()), [maps]);

  return <mesh position={props.position} rotation={props.rotation}>
    <planeGeometry args={[props.width, props.height]} />
    <meshPhysicalMaterial
      map={maps[0]} metalnessMap={maps[1]} roughnessMap={maps[2]}
      bumpMap={maps[3]} bumpScale={props.debossDepth}
      metalness={1} roughness={1} envMapIntensity={1.1}
    />
  </mesh>;
};
export default FoilText;
