package com.fractal;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

public class FractalModule extends ReactContextBaseJavaModule {

  FractalModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "FractalModule";
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
    Promise promise
  ) {
    Range range = new Range(rangeXUpper, rangeXLower, rangeYUpper, rangeYLower);
    Color[] colorMap = this.getColorMap(maxIterations);

    Complex juliaSetValue = new Complex(
      juliaSetValueReal,
      juliaSetValueImaginary
    );

    promise.resolve("hello" + colorMap[0].r);
  }
}
