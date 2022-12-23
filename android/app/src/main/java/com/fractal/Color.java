package com.fractal;

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

  public static Color[] getColorMap(int maxIterations) {
    Color[] colors = new Color[] {
      new Color(69, 0, 207), // blue
      new Color(255, 255, 255), // white
      new Color(255, 195, 15), // yellow
      new Color(255, 88, 51), // orange
      new Color(199, 0, 57), // red
      new Color(144, 12, 63), // maroon
      new Color(88, 24, 69), // purple
    };

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
