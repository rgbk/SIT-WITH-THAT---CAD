
export type FoilType = 'metallic' | 'gloss' | 'matte';

export type FontConfig = {
  family: string;
  size: number;
  letterSpacing: number;
  lineHeight: number;
  uppercase: boolean;
};

export type AppState = {
  isOpen: boolean;
  showDebug: boolean;
  paperColor: string;
  foilColor: string;
  foilType: FoilType;
  frontText: string;
  backText: string;
  fontConfig: FontConfig;
};

export const FONTS = [
  'Inter',
  'Roboto',
  'Playfair Display',
  'Lora',
  'Oswald',
  'Montserrat'
];
