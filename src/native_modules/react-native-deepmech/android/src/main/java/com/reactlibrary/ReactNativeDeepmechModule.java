// ReactNativeDeepmechModule.java

package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import android.util.Log;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.pytorch.Module;
import org.pytorch.Tensor;

public class ReactNativeDeepmechModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private Bitmap bitmap;
    private Module symbol_detector;

    public ReactNativeDeepmechModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        try {
            this.bitmap = BitmapFactory.decodeStream(reactContext.getAssets().open("image.png"));
            this.symbol_detector = Module.load(assetFilePath(reactContext, "mobile_model.pt"));
        } catch (IOException e) {
             Log.e("PytorchHelloWorld", "Error reading assets", e);
        }
    }

    @Override
    public String getName() {
        return "ReactNativeDeepmech";
    }

    @ReactMethod
    public void sample(String str, Callback cb) {
        final int Height = this.bitmap.getByteCount();


        // TODO: Implement some actually useful functionality
        cb.invoke(str + "world" + String.valueOf(Height) + this.symbol_detector.toString());
    }

    /**
    * Copies specified asset to the file in /files app directory and  returns this file absolute path.
    *
    * @return absolute file path
    */
    private static String assetFilePath(Context context, String assetName) throws IOException {
        File file = new File(context.getFilesDir(), assetName);
        if (file.exists() && file.length() > 0) {
            return file.getAbsolutePath();
        }

        try (InputStream is = context.getAssets().open(assetName)) {
            try (OutputStream os = new FileOutputStream(file)) {
                byte[] buffer = new byte[4 * 1024];
                int read;
                while ((read = is.read(buffer)) != -1) {
                    os.write(buffer, 0, read);
                }
                os.flush();
            }
            return file.getAbsolutePath();
        }
    }
}
