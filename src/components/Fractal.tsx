import Canvas, {ImageData} from 'react-native-canvas';
import React from 'react';
import {Complex, getColors, getFractal, Range} from '../utils/fractalUtils';
import {PixelRatio} from 'react-native';

interface Props {
  range: Range;
  juliaSetValue: Complex | null;
  size: number;
}

function FractalComponent({range, juliaSetValue, size}: Props) {
  const pixels = size * PixelRatio.get();

  const handleCanvas = async (canvas: Canvas) => {
    if (canvas) {
      const context = canvas.getContext('2d');
      canvas.width = pixels;
      canvas.height = pixels;
      const fractalData = getFractal(pixels, range, juliaSetValue);
      const colorData = getColors(fractalData);
      const data = new ImageData(canvas, colorData, pixels, pixels);
      context.putImageData(data, 0, 0);
    }
  };

  return <Canvas ref={handleCanvas} />;
}

export const Fractal = React.memo(FractalComponent);
