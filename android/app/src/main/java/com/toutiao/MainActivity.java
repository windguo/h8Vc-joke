package com.toutiao;

import android.os.Bundle;

import com.facebook.react.shell.MainReactPackage;

import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;

import org.devio.rn.splashscreen.SplashScreen;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }


    @Override
    protected String getMainComponentName() {
        return "toutiao";
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }



}
