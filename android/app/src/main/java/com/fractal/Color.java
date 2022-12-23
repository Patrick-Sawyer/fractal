package com.fractal;

import com.facebook.react.bridge.ReadableArray;
import java.lang.Integer;

public class Color {

  int red, green, blue;

  Color(int a, int b, int c) {
    red = a;
    green = b;
    blue = c;
  }

  private static int calcColor(int color1, int color2, double value) {
    return (int) Math.round(
      (double) (color2 - color1) * value + (double) color1
    );
  }

  public static Color[] getColorMap(
    int maxIterations,
    ReadableArray colorStrings
  ) {
    Color[] colors = new Color[colorStrings.size()];
    String comma = String.valueOf(',');

    for (int i = 0; i < colors.length; i++) {
      String rgbData = colorStrings.getString(i);
      String[] colorComponents = rgbData.split(comma);

      colors[i] =
        new Color(
          Integer.parseInt(colorComponents[0]),
          Integer.parseInt(colorComponents[1]),
          Integer.parseInt(colorComponents[2])
        );
    }

    Color[] colorMap = new Color[maxIterations];

    for (int index = 0; index < maxIterations; index++) {
      double valueAsFraction = (double) index / (double) maxIterations;
      double positionInColors = valueAsFraction * (double) (colors.length - 1);
      int lowerColorIndex = (int) Math.floor(positionInColors);
      double valueInRange = positionInColors - (double) lowerColorIndex;
      Color color1 = colors[lowerColorIndex];
      Color color2 = colors[lowerColorIndex + 1];
      int red = calcColor(color1.red, color2.red, valueInRange);
      int green = calcColor(color1.green, color2.green, valueInRange);
      int blue = calcColor(color1.blue, color2.blue, valueInRange);
      colorMap[index] = new Color(red, green, blue);
    }

    return colorMap;
  }
}
