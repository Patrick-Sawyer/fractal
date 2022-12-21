export interface Complex {
  real: number;
  imaginary: number;
}

interface ComplexMathsType {
  add: (a: Complex, b: Complex) => Complex;
  square: (a: Complex) => Complex;
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

const BLACK = [0, 0, 0];
const MAX_NUMBER = 3;

const CENTRE: Complex = {
  real: 0,
  imaginary: 0,
};

interface Color {
  r: number;
  g: number;
  b: number;
}

const PURPLE = {
  r: 88,
  g: 24,
  b: 69,
};
const MAROON = {
  r: 144,
  g: 12,
  b: 63,
};
const RED = {r: 199, g: 0, b: 57};
const ORANGE = {
  r: 255,
  g: 88,
  b: 51,
};
const YELLOW = {
  r: 255,
  g: 195,
  b: 15,
};

const COLORS: Color[] = [YELLOW, ORANGE, RED, MAROON, PURPLE];

const oldColorMaps: Record<number, number[][]> = {};

const createColorMap = (maxIterations: number) => {
  if (oldColorMaps[maxIterations]) {
    return oldColorMaps[maxIterations];
  }

  const map = new Array(maxIterations)
    .fill(null)
    .map((_: null, index: number) => {
      const valueAsFraction = index / maxIterations;
      const positionInColors = valueAsFraction * (COLORS.length - 1);
      const lowerColorIndex = Math.floor(positionInColors);
      const valueInRange = positionInColors - lowerColorIndex;
      const color1 = COLORS[lowerColorIndex];
      const color2 = COLORS[lowerColorIndex + 1];
      const red = Math.round((color2.r - color1.r) * valueInRange + color1.r);
      const green = Math.round((color2.g - color1.g) * valueInRange + color1.g);
      const blue = Math.round((color2.b - color1.b) * valueInRange + color1.b);
      return [red, green, blue];
    });

  oldColorMaps[maxIterations] = map;

  return map;
};

const ComplexMaths: ComplexMathsType = {
  add: (a, b) => ({
    real: a.real + b.real,
    imaginary: a.imaginary + b.imaginary,
  }),
  square: ({real, imaginary}) => ({
    real: real * real - imaginary * imaginary,
    imaginary: real * imaginary * 2,
  }),
};

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

const hasHitMax = (x: Complex): boolean =>
  Math.abs(x.real) > MAX_NUMBER || Math.abs(x.imaginary) > MAX_NUMBER;

export const getFractal = (
  size: number,
  range: Range,
  juliaSetValue: Complex | null,
  maxIterations = 30,
): number[] => {
  const data: number[] = new Array(size * size * 4).fill(255);
  const COLOR_MAPPER = createColorMap(maxIterations);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let maxedOut = false;
      let howFast = 0;
      const initCoord = getCoord(size, range, {x, y});
      let iteration = juliaSetValue ? initCoord : CENTRE;

      for (let i = 0; i < maxIterations - 1; i++) {
        const square = ComplexMaths.square(iteration);
        iteration = ComplexMaths.add(square, juliaSetValue || initCoord);

        if (hasHitMax(iteration)) {
          maxedOut = true;
          break;
        } else {
          howFast++;
        }
      }

      const color = maxedOut ? COLOR_MAPPER[howFast] : BLACK;
      const index = 4 * (y * size + x);
      data[index + 0] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
    }
  }

  return data;
};
