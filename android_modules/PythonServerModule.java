package com.ishant.mobile_app;

import com.chaquo.python.PyException;
import com.chaquo.python.PyObject;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * React Native NativeModule — direct Chaquopy bridge for the Python backend.
 *
 * No HTTP server. Java calls Python functions directly via JNI:
 *   start()  — preloads models + audio, resolves Promise when ready
 *   callApi() — processes one API request in-process, returns JSON string
 */
public class PythonServerModule extends ReactContextBaseJavaModule {

    public PythonServerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PythonServer";
    }

    /**
     * Initialises Chaquopy and preloads all models/audio in a background thread.
     * Resolves the JS Promise when ready so the app can render immediately.
     */
    @ReactMethod
    public void start(Promise promise) {
        new Thread(() -> {
            try {
                ReactApplicationContext ctx = getReactApplicationContext();
                if (!Python.isStarted()) {
                    Python.start(new AndroidPlatform(ctx));
                }
                Python.getInstance().getModule("server").callAttr("start");
                promise.resolve(null);
            } catch (Exception e) {
                promise.reject("PYTHON_START_ERROR", e.getMessage());
            }
        }, "saca-start").start();
    }

    /**
     * Calls server.handle(path, bodyJson) directly in Python — no HTTP.
     * Returns a JSON string which JS parses.
     */
    @ReactMethod
    public void callApi(String path, String bodyJson, Promise promise) {
        new Thread(() -> {
            try {
                PyObject result = Python.getInstance()
                    .getModule("server")
                    .callAttr("handle", path, bodyJson != null ? bodyJson : "{}");
                promise.resolve(result.toString());
            } catch (PyException e) {
                promise.reject("PYTHON_API_ERROR", e.getMessage());
            } catch (Exception e) {
                promise.reject("API_ERROR", e.getMessage());
            }
        }, "saca-api").start();
    }
}
