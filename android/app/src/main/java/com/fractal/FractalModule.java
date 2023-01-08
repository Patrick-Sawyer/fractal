package com.fractal;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import java.util.Arrays;
import java.util.concurrent.*;

public class FractalModule extends ReactContextBaseJavaModule {

  FractalModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "FractalModule";
  }

  private static double calculateDistanceBetweenCoordinates(
    Complex coord1,
    Complex coord2
  ) {
    double real = coord1.real - coord2.real;
    double imaginary = coord1.imaginary - coord2.imaginary;

    return Math.sqrt(real * real + imaginary * imaginary);
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

  private static Complex iterate(Complex zValue, Complex cValue) {
    Complex square = Complex.square(zValue);
    return Complex.add(square, cValue);
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
    ReadableArray colors,
    Promise promise
  ) {
    Range range = new Range(rangeXUpper, rangeXLower, rangeYUpper, rangeYLower);
    Color[] colorMap = Color.getColorMap(maxIterations, colors);
    Complex centre = new Complex(0, 0);

    Complex juliaSetValue = new Complex(
      juliaSetValueReal,
      juliaSetValueImaginary
    );

    int data[] = new int[size * size * 4];
    Arrays.fill(data, 255);
    ExecutorService es = Executors.newFixedThreadPool(8);

    for (int y = 0; y < size; y++) {
      int yValue = y;
      es.execute(
        new Runnable() {
          public void run() {
            for (int x = 0; x < size; x++) {
              boolean isApproachingInfinity = false;
              int howFast = 0;
              Complex thisCoord = getCoord(size, range, x, yValue);
              Complex initZValue = isJuliaSet ? thisCoord : centre;
              Complex zValue = initZValue;
              Complex cValue = isJuliaSet ? juliaSetValue : thisCoord;

              for (int i = 0; i < maxIterations - 1; i++) {
                zValue = iterate(zValue, cValue);

                if (
                  calculateDistanceBetweenCoordinates(initZValue, zValue) > 3
                ) {
                  isApproachingInfinity = true;
                  break;
                }

                if (
                  isApproachingInfinity == false &&
                  calculateDistanceBetweenCoordinates(centre, zValue) > 2
                ) {
                  isApproachingInfinity = true;
                }

                howFast++;
              }

              int index = ((size - yValue - 1) * size + x) * 4;
              data[index] = isApproachingInfinity ? colorMap[howFast].red : 0;
              data[index + 1] =
                isApproachingInfinity ? colorMap[howFast].green : 0;
              data[index + 2] =
                isApproachingInfinity ? colorMap[howFast].blue : 0;
            }
          }
        }
      );
    }

    es.shutdown();

    try {
      es.awaitTermination(1, TimeUnit.MINUTES);
    } catch (InterruptedException ignore) {}

    WritableArray array = Arguments.createArray();

    for (int i = 0; i < data.length; i++) {
      array.pushInt(data[i]);
    }

    promise.resolve(array);
  }
}
