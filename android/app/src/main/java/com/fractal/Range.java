package com.fractal;

public class Range {

  AxisRange x, y;

  Range(double a, double b, double c, double d) {
    x = new AxisRange(a, b);
    y = new AxisRange(c, d);
  }
}
