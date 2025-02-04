import Canvas, {ImageData} from 'react-native-canvas';
import React from 'react';
import {Complex, getFractal, Range} from '../utils/fractalUtils';
import {PixelRatio} from 'react-native';

interface Props {
  range: Range;
  juliaSetValue: Complex | null;
  size: number;
  setLoading: (state: boolean) => void;
  sensitivity: number;
  colors: string[];
}

function FractalComponent({
  range,
  juliaSetValue,
  size,
  setLoading,
  sensitivity,
  colors,
}: Props) {
  const pixels = size * PixelRatio.get();

  const handleCanvas = async (canvas: Canvas) => {
    if (canvas) {
      setLoading(true);
      await new Promise((r: any) => setTimeout(r, 0));
      const context = canvas.getContext('2d');
      canvas.width = pixels;
      canvas.height = pixels;
      const colorData = await getFractal(
        pixels,
        range,
        juliaSetValue,
        sensitivity,
        colors,
      );
      const data = new ImageData(canvas, colorData, pixels, pixels);
      context.putImageData(data, 0, 0);
      setLoading(false);
    }
  };

  return <Canvas ref={handleCanvas} />;
}

export const Fractal = React.memo(FractalComponent);
