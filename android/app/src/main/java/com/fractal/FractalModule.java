package com.fractal;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import java.util.Arrays;

public class FractalModule extends ReactContextBaseJavaModule {

  static int maxNumber = 5;

  FractalModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "FractalModule";
  }

  private static boolean hasHitMax(Complex x) {
    return (
      x.real * x.real + x.imaginary * x.imaginary > maxNumber * maxNumber
    );
  }

  private static double getAxisPosition(
    AxisRange limits,
    int max,
    int position
  ) {
    double fraction = (double) position / (double) max;
    double range = limits.upper - limits.lower;
    return range * fraction + limits.lower;
  }

  private static Complex getCoord(
    int size,
    Range range,
    int xPosition,
    int yPosition
  ) {
    double real = getAxisPosition(range.x, size, xPosition);
    double imaginary = getAxisPosition(range.y, size, yPosition);
    return new Complex(real, imaginary);
  }

  @ReactMethod
  public static void getFractal(
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

    int data[] = new int[size * size * 4];
    Arrays.fill(data, 255);

    for (int y = 0; y < size; y++) {
      for (int x = 0; x < size; x++) {
        int xValue = x;
        int yValue = y;
        boolean maxedOut = false;
        int howFast = 0;
        Complex initCoord = getCoord(size, range, xValue, yValue);
        Complex iteration = initCoord;

        for (int i = 0; i < maxIterations - 1; i++) {
          Complex square = Complex.square(iteration);
          iteration =
            Complex.add(
              square,
              (isJuliaSet == true) ? juliaSetValue : initCoord
            );
          boolean hasHitMax = hasHitMax(iteration);

          if (hasHitMax == true) {
            maxedOut = true;
            break;
          } else {
            howFast++;
          }
        }

        int index = ((size - y - 1) * size + x) * 4;
        data[index] = maxedOut == true ? colorMap[howFast].red : 0;
        data[index + 1] = maxedOut == true ? colorMap[howFast].green : 0;
        data[index + 2] = maxedOut == true ? colorMap[howFast].blue : 0;
      }
    }

    WritableArray array = Arguments.createArray();

    for (int i = 0; i < data.length; i++) {
      array.pushInt(data[i]);
    }

    promise.resolve(array);
  }
}
