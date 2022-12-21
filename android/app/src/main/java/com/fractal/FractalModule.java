package com.fractal;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FractalModule extends ReactContextBaseJavaModule {

    FractalModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "FractalModule";
    }

    @ReactMethod
    public String test(String name) {
        return name;
    }
}
