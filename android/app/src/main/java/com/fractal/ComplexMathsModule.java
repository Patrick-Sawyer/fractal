package com.fractal;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ComplexMathsModule extends ReactContextBaseJavaModule {

    ComplexMathsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ComplexMathsModule";
    }

    @ReactMethod
    public String test(String name) {
        return name;
    }
}
