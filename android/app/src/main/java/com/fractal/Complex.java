package com.fractal;

public class Complex {

  double real, imaginary;

  Complex(double a, double b) {
    real = a;
    imaginary = b;
  }

  public static Complex add(Complex a, Complex b) {
    double real = a.real + b.real;
    double imaginary = a.imaginary + b.imaginary;
    return new Complex(real, imaginary);
  }

  public static Complex square(Complex a) {
    double real = a.real * a.real - a.imaginary * a.imaginary;
    double imaginary = a.real * a.imaginary * 2;
    return new Complex(real, imaginary);
  }
}
