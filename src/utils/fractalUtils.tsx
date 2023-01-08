import {NativeModules} from 'react-native';
const {FractalModule} = NativeModules;

export interface Complex {
  real: number;
  imaginary: number;
}

export interface AxisRange {
  upper: number;
  lower: number;
}

export interface Range {
  x: AxisRange;
  y: AxisRange;
}

export interface Coord {
  x: number;
  y: number;
}

const getAxisPosition = (
  limits: AxisRange,
  max: number,
  position: number,
): number => {
  const fraction = position / max;
  const range = limits.upper - limits.lower;
  return range * fraction + limits.lower;
};

export const getCoord = (
  size: number,
  range: Range,
  position: Coord,
): Complex => ({
  real: getAxisPosition(range.x, size, position.x),
  imaginary: getAxisPosition(range.y, size, size - position.y),
});

export const getFractal = async (
  size: number,
  range: Range,
  juliaSetValue: Complex | null,
  maxIterations = 30,
  colors: string[],
): Promise<number[]> => {
  return await FractalModule.getFractal(
    size,
    range.x.upper,
    range.x.lower,
    range.y.upper,
    range.y.lower,
    juliaSetValue?.real || 0,
    juliaSetValue?.imaginary || 0,
    maxIterations,
    !!juliaSetValue,
    colors,
  );
};
