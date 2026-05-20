package com.ishant.mobile_app;

import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * React Native NativeModule that starts the Chaquopy Python server.
 * Copy this file to android/app/src/main/java/com/ishant/mobile_app/
 * after running expo prebuild.
 */
public class PythonServerModule extends ReactContextBaseJavaModule {

    public PythonServerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PythonServer";
    }

    @ReactMethod
    public void start() {
        ReactApplicationContext ctx = getReactApplicationContext();
        if (!Python.isStarted()) {
            Python.start(new AndroidPlatform(ctx));
        }
        Python.getInstance().getModule("server").callAttr("start");
    }
}
