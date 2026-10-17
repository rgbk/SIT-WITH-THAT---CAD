
import React from 'react';
import { Text } from '@react-three/drei';
import { FontConfig, FoilType } from '../types';

interface FoilTextProps {
  text: string;
  config: FontConfig;
  foilType: FoilType;
  foilColor: string;
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

const FoilText: React.FC<FoilTextProps> = (props) => {
    const fontUrl = FONT_URLS[props.config.family] || FONT_URLS['Inter'];
    
    // Calculate material props based on type
    const materialProps = React.useMemo(() => {
        switch (props.foilType) {
          case 'metallic':
            // Metallic is always CHROME/SILVER
            return { metalness: 0.9, roughness: 0.15, color: '#FFFFFF' }; 
          case 'gloss':
            return { metalness: 0.2, roughness: 0.1, color: props.foilColor };
          case 'matte':
            return { metalness: 0.0, roughness: 0.9, color: props.foilColor };
          default:
            return { metalness: 0.0, roughness: 0.4, color: props.foilColor };
        }
      }, [props.foilType, props.foilColor]);

    const displayText = props.config.uppercase ? props.text.toUpperCase() : props.text;

    return (
        <group position={props.position} rotation={props.rotation}>
          <Text
            font={fontUrl}
            fontSize={props.config.size} 
            letterSpacing={props.config.letterSpacing}
            lineHeight={props.config.lineHeight}
            maxWidth={props.width - 24} // More padding (12px each side approx)
            textAlign="left"
            anchorX="left"
            anchorY="top"
            position={[-props.width / 2 + 12, props.height / 2 - 12, 0.01]} // Adjusted position for padding
          >
            {displayText}
            <meshStandardMaterial
              {...materialProps}
            />
          </Text>
        </group>
      );
}

export default FoilText;
