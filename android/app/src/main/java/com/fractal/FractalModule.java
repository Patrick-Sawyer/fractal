package com.fractal;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import org.json.*;

public class FractalModule extends ReactContextBaseJavaModule {

    FractalModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "FractalModule";
    }

    @ReactMethod
    public static void getFractal(int size, String rangeJSON, String juliaSetValueJSON, int maxIterations, Promise promise) {
        // JSONObject range = new JSONObject(rangeJSON);
        promise.resolve("hello" + Integer.toString(size) + rangeJSON + juliaSetValueJSON + Integer.toString(maxIterations));
    }
}
