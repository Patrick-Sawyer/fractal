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

export const ComplexMaths: ComplexMathsType = {
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

const MAX_NUMBER = 10;
const SENSITIVITY = 250;

const hasHitMax = (x: Complex): boolean =>
  Math.abs(x.real) > MAX_NUMBER || Math.abs(x.imaginary) > MAX_NUMBER;

const CENTRE: Complex = {
  real: 0,
  imaginary: 0,
};

export const getFractal = (
  size: number,
  range: Range,
  juliaSetValue: Complex | null,
): number[] => {
  const data: number[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let didMaxOut = false;
      let howFast = 0;
      const initCoord = getCoord(size, range, {x, y});
      let iteration = juliaSetValue ? initCoord : CENTRE;

      for (let i = 0; i < SENSITIVITY; i++) {
        howFast++;
        const square = ComplexMaths.square(iteration);
        iteration = ComplexMaths.add(square, juliaSetValue || initCoord);

        if (hasHitMax(iteration)) {
          didMaxOut = true;
          break;
        }
      }

      const value = didMaxOut ? Math.pow(howFast / SENSITIVITY, 0.7) : 0;
      data.push(value);
    }
  }

  return data;
};

const BLACK = [0, 0, 0, 255];

export const getColors = (data: number[]): number[] => {
  const colorData: number[] = [];
  data.forEach(value => {
    if (value === 0) {
      colorData.push(...BLACK);
    } else {
      // const color = calculateColor(value);
      colorData.push(...calculateColor(value), 255);
    }
  });
  return colorData;
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

const calculateColor = (value: number): number[] => {
  const useThisValue = value * COLORS.length;
  const index = Math.floor(value);
  const valueInRange = useThisValue - index;

  return getColorInfo(valueInRange, index);
};

const getColorInfo = (value: number, index: number): number[] => {
  const color1 = COLORS[index];
  const color2 = COLORS[index + 1];
  const red = (color2.r - color1.r) * value + color1.r;
  const green = (color2.g - color1.g) * value + color1.g;
  const blue = (color2.b - color1.b) * value + color1.b;

  return [red, green, blue];
};
