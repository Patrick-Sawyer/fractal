package com.fractal;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import java.util.Arrays;

public class FractalModule extends ReactContextBaseJavaModule {

  int maxNumber = 3;

  FractalModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "FractalModule";
  }

  private boolean hasHitMax(Complex x) {
    return (
      x.real *
      x.real +
      x.imaginary *
      x.imaginary >
      this.maxNumber *
      this.maxNumber
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
    Color[] colorMap = Color.getColorMap(maxIterations);

    Complex juliaSetValue = new Complex(
      juliaSetValueReal,
      juliaSetValueImaginary
    );

    WritableArray array = Arguments.createArray();

    for (int y = size; y > 0; y--) {
      for (int x = 0; x < size; x++) {
        boolean maxedOut = false;
        int howFast = 0;
        Complex initCoord = getCoord(size, range, x, y);
        Complex iteration = initCoord;

        for (int i = 0; i < maxIterations - 1; i++) {
          Complex square = Complex.square(iteration);
          iteration =
            Complex.add(
              square,
              (isJuliaSet == true) ? juliaSetValue : initCoord
            );
          boolean hasHitMax = this.hasHitMax(iteration);

          if (hasHitMax == true) {
            maxedOut = true;
            break;
          } else {
            howFast++;
          }
        }

        array.pushInt(maxedOut == true ? colorMap[howFast].red : 0);
        array.pushInt(maxedOut == true ? colorMap[howFast].green : 0);
        array.pushInt(maxedOut == true ? colorMap[howFast].blue : 0);
        array.pushInt(255);
      }
    }

    promise.resolve(array);
  }
}
