/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;

import com.tencent.connect.share.QQShare;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

// For JS and JAVA reflection test, you can delete it if it's your own project
// -------------------------------------

public class AppActivity extends Cocos2dxActivity {

    private static AppActivity app = null;
    private static PackageManager packageManager=null;
    private static IUiListener listener = new IUiListener() {
        @Override
        public void onComplete(Object o) {
            System.out.println("onComplete");
        }

        @Override
        public void onError(UiError uiError) {
            System.out.println("onError");
        }

        @Override
        public void onCancel() {
            System.out.println("onCancel");
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        app = this;
        packageManager=getPackageManager();

        // Tencent类是SDK的主要实现类，开发者可通过Tencent类访问腾讯开放的OpenAPI。
        // 其中APP_ID是分配给第三方应用的appid，类型为String。
        System.out.println("onCreate");
    }

    public static String getChannelName(){
        try {
            System.out.println("getChannelName");
            //ApplicationInfo ai = app.getApplicationInfo();
            ApplicationInfo ai = packageManager.getApplicationInfo(app.getPackageName(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            String channelName = bundle.getString("CHANNEL");
            System.out.println("getChannelName "+channelName);
            if (channelName.length() > 0)
                return channelName;
            else
                return "xxxxx";
        }catch (Exception e){
            return "xxxxx";
        }
    }
    public static void login(){
        System.out.println("login");
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Tencent mTencent = Tencent.createInstance("1105464601", app);
                // 1.4版本:此处需新增参数，传入应用程序的全局context，可通过activity的getApplicationContext方法获取
                if (!mTencent.isSessionValid())
                {
                    System.out.println("session is not valid");
                    mTencent.login(app, "all", new IUiListener() {
                        @Override
                        public void onComplete(Object o) {
                            System.out.println("onComplete"+o.toString());
                            //Cocos2dxJavascriptJavaBridge.evalString("");
                        }

                        @Override
                        public void onError(UiError uiError) {
                            System.out.println("onError");
                        }

                        @Override
                        public void onCancel() {
                            System.out.println("onCancel");
                        }
                    });
                }else{
                    System.out.println("session is valid");
                }
            }
        });
    }

    public static void logout(){
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Tencent mTencent = Tencent.createInstance("1105464601", app);
                mTencent.logout(app);
            }
        });
    }

    public static void share()
    {
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Bundle params = new Bundle();
                params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
                params.putString(QQShare.SHARE_TO_QQ_TITLE, "俯卧撑决斗");
                params.putString(QQShare.SHARE_TO_QQ_SUMMARY, "玩游戏玩出完美胸肌");
                params.putString(QQShare.SHARE_TO_QQ_TARGET_URL, "http://www.pushup.gandafu.com");
                //params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, "http://imgcache.qq.com/qzone/space_item/pre/0/66768.gif");
                params.putString(QQShare.SHARE_TO_QQ_APP_NAME, "天天俯卧撑");
                params.putInt(QQShare.SHARE_TO_QQ_EXT_INT, QQShare.SHARE_TO_QQ_FLAG_QZONE_ITEM_HIDE);
                Tencent mTencent = Tencent.createInstance("1105464601", app);
                mTencent.shareToQQ(app, params, new IUiListener() {
                    @Override
                    public void onComplete(Object o) {
                        System.out.println("share complete");
                    }

                    @Override
                    public void onError(UiError uiError) {
                        System.out.println("share error");
                    }

                    @Override
                    public void onCancel() {
                        System.out.println("share cancel");
                    }
                });

            }
        });

    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        return glSurfaceView;
    }

    // For JS and JAVA reflection test, you can delete it if it's your own project
    public static void showAlertDialog(final String title,final String message) {
        // Here be sure to use runOnUiThread
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog alertDialog = new AlertDialog.Builder(app).create();
                alertDialog.setTitle(title);
                alertDialog.setMessage(message);
                alertDialog.show();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Tencent.onActivityResultData(requestCode, resultCode, data, listener);
    }
}
