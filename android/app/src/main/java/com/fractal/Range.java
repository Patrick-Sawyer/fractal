package com.fractal;

public class Range {

  AxisRange x, y;

  Range(double xUpper, double xLower, double yUpper, double yLower) {
    x = new AxisRange(xUpper, xLower);
    y = new AxisRange(yUpper, yLower);
  }
}
