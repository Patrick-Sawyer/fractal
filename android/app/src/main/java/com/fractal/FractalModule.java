package com.fractal;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import java.util.Arrays;

public class FractalModule extends ReactContextBaseJavaModule {

  Complex centre = new Complex(0, 0);
  int maxNumber = 3;
  int[] black = { 0, 0, 0 };

  FractalModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "FractalModule";
  }

  private boolean hasHitMax(Complex x) {
    return (
      Math.abs(x.real) > this.maxNumber ||
      Math.abs(x.imaginary) > this.maxNumber
    );
  }

  private double getAxisPosition(AxisRange limits, int max, int position) {
    double fraction = (double) position / (double) max;
    double range = limits.upper - limits.lower;
    return range * fraction + limits.lower;
  }

  private Complex getCoord(
    int size,
    Range range,
    int xPosition,
    int yPosition
  ) {
    double real = this.getAxisPosition(range.x, size, xPosition);
    double imaginary = this.getAxisPosition(range.y, size, yPosition);
    return new Complex(real, imaginary);
  }

  private Color[] getColorMap(int maxIterations) {
    Color[] colors = new Color[] {
      new Color(255, 195, 15),
      new Color(255, 88, 51),
      new Color(199, 0, 57),
      new Color(144, 12, 63),
      new Color(88, 24, 69),
    };

    Color[] colorMap = new Color[maxIterations];

    for (int index = 0; index < maxIterations; index++) {
      double valueAsFraction = (double) index / (double) maxIterations;
      double positionInColors = valueAsFraction * (double) (colors.length - 1);
      int lowerColorIndex = (int) Math.floor(positionInColors);
      double valueInRange = positionInColors - (double) lowerColorIndex;
      Color color1 = colors[lowerColorIndex];
      Color color2 = colors[lowerColorIndex + 1];
      int red = (int) Math.round(
        (double) (color2.r - color1.r) * valueInRange + (double) color1.r
      );
      int green = (int) Math.round(
        (double) (color2.g - color1.g) * valueInRange + (double) color1.g
      );
      int blue = (int) Math.round(
        (double) (color2.b - color1.b) * valueInRange + (double) color1.b
      );
      colorMap[index] = new Color(red, green, blue);
    }

    return colorMap;
  }

  @ReactMethod
  public void getFractal(
    int size,
    double rangeXUpper,
    double rangeXLower,
    double rangeYUpper,
    double rangeYLower,
    double juliaSetValueReal,
    double juliaSetValueImaginary,
    int maxIterations,
    boolean isJuliaSet,
    Promise promise
  ) {
    Range range = new Range(rangeXUpper, rangeXLower, rangeYUpper, rangeYLower);
    Color[] colorMap = this.getColorMap(maxIterations);

    Complex juliaSetValue = new Complex(
      juliaSetValueReal,
      juliaSetValueImaginary
    );

    WritableArray array = Arguments.createArray();

    for (int y = 0; y < size; y++) {
      for (int x = 0; x < size; x++) {
        boolean maxedOut = false;
        int howFast = 0;
        Complex initCoord = getCoord(size, range, x, y);
        Complex iteration = isJuliaSet == true ? centre : initCoord;

        for (int i = 0; i < maxIterations - 1; i++) {
          Complex square = Complex.square(iteration);
          iteration =
            Complex.add(square, isJuliaSet == true ? juliaSetValue : initCoord);
          boolean hasHitMax = this.hasHitMax(iteration);

          if (hasHitMax == true) {
            maxedOut = true;
            break;
          } else {
            howFast++;
          }
        }

        array.pushInt(maxedOut == true ? colorMap[howFast].r : 0);
        array.pushInt(maxedOut == true ? colorMap[howFast].g : 0);
        array.pushInt(maxedOut == true ? colorMap[howFast].b : 0);
        array.pushInt(255);
      }
    }

    promise.resolve(array);
  }
}
