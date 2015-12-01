---
title: Beautiful Android Login and Signup Screens with Material Design
date: 2015-06-18
tags: Android, Material, Demo
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

Everyone loves a beautiful login screen, and since it's usually the very first impression people have about your app it's super important to get it right.

This article shows you how to create beautiful login and signup screens the right way using [Material design spec](https://www.google.com/design/spec/material-design/introduction.html) with the assistance of Google's new [design support library](https://developer.android.com/tools/support-library/index.html). The design support library implements a growing subset of the Material spec, and also includes a bunch of sexy UI widgets that can be used to give your Android apps that polished feel. 

On the design and layout side of things, the focus here is on balancing the screen elements in a way that's pleasing to the eye. To add the finishing touches we will also be styling the top status bar on newer devices <!-- an extra level of stylability -->, and utilising [floating labels](http://www.google.com/design/spec/components/text-fields.html#text-fields-floating-labels) from the design library (implemented via the `TextInputLayout` tag).

Pretty much everything has been taken care of for you:

* Full demo and code examples on Github.
* Interface locking to prevent back button when the Login Activity is displayed.
* Custom `ProgressDialog` to signify loading state.
* Conforms to the Material design spec.
* Floating labels from the design library.
* Form user input validation.
* Custom status bar style.
* Faux authentication methods for testing each Activity. 

All that remains is to implement your own authentication logic - weather it be via HTTP, SQL or some other method.

<center>
<p><a class="action-button button radius" target="_blank" href="https://github.com/sourcey/materiallogindemo" title="Get the Code on Github">Get the Code</a></p>
</center>

## Login Activity

Let's start by setting up the Login Activity, which is usually the first Activity you'll display to a user when they start your app. 

![Login Screen](/beautiful-android-logn-and-signup-screens-with-material-design/screenshot-login.png "Login Screen") 
{:.width-75 .center}

If you want to add social signin buttons then please go ahead, but they're outside the scope of this document for now. At minimum this code will give you a solid starting point for building your authentication workflow.

Notice also that the `onBackPressed` method has been overriden, which prevents the user from closing the Login Activity.

#### LoginActivity.java

~~~ java
package com.sourcey.materiallogindemo;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import android.content.Intent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import butterknife.ButterKnife;
import butterknife.InjectView;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = "LoginActivity";
    private static final int REQUEST_SIGNUP = 0;

    @InjectView(R.id.input_email) EditText _emailText;
    @InjectView(R.id.input_password) EditText _passwordText;
    @InjectView(R.id.btn_login) Button _loginButton;
    @InjectView(R.id.link_signup) TextView _signupLink;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.inject(this);
        
        _loginButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                login();
            }
        });

        _signupLink.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                // Start the Signup activity
                Intent intent = new Intent(getApplicationContext(), SignupActivity.class);
                startActivityForResult(intent, REQUEST_SIGNUP);
            }
        });
    }

    public void login() {
        Log.d(TAG, "Login");
        
        if (!validate()) {
            onLoginFailed();
            return;
        }

        _loginButton.setEnabled(false);

        final ProgressDialog progressDialog = new ProgressDialog(LoginActivity.this,
                R.style.AppTheme_Dark_Dialog);
        progressDialog.setIndeterminate(true);
        progressDialog.setMessage("Authenticating...");
        progressDialog.show();

        String email = _emailText.getText().toString();
        String password = _passwordText.getText().toString();

        // TODO: Implement your own authentication logic here.

        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        // On complete call either onLoginSuccess or onLoginFailed
                        onLoginSuccess();
                        // onLoginFailed();
                        progressDialog.dismiss();
                    }
                }, 3000);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_SIGNUP) {
            if (resultCode == RESULT_OK) {

                // TODO: Implement successful signup logic here
                // By default we just finish the Activity and log them in automatically
                this.finish();
            }
        }
    }

    @Override
    public void onBackPressed() {
        // disable going back to the MainActivity
        moveTaskToBack(true);
    }

    public void onLoginSuccess() {
        _loginButton.setEnabled(true);
        finish();
    }

    public void onLoginFailed() {
        Toast.makeText(getBaseContext(), "Login failed", Toast.LENGTH_LONG).show();

        _loginButton.setEnabled(true);
    }

    public boolean validate() {
        boolean valid = true;

        String email = _emailText.getText().toString();
        String password = _passwordText.getText().toString();

        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            _emailText.setError("enter a valid email address");
            valid = false;
        } else {
            _emailText.setError(null);
        }

        if (password.isEmpty() || password.length() < 4 || password.length() > 10) {
            _passwordText.setError("between 4 and 10 alphanumeric characters");
            valid = false;
        } else {
            _passwordText.setError(null);
        }

        return valid;
    }
}
~~~

![Login Screen Spinner](/beautiful-android-logn-and-signup-screens-with-material-design/screenshot-login-spinner.png "Login Screen Spinner") 
{:.width-75 .center}

#### res/layout/activity_login.xml

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:fitsSystemWindows="true">

    <LinearLayout
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingTop="56dp"
        android:paddingLeft="24dp"
        android:paddingRight="24dp">

        <ImageView android:src="@drawable/logo"
            android:layout_width="wrap_content"
            android:layout_height="72dp"
            android:layout_marginBottom="24dp"
            android:layout_gravity="center_horizontal" />

        <!-- Email Label -->
        <android.support.design.widget.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:layout_marginBottom="8dp">
            <EditText android:id="@+id/input_email"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textEmailAddress"
                android:hint="Email" />
        </android.support.design.widget.TextInputLayout>

        <!-- Password Label -->
        <android.support.design.widget.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:layout_marginBottom="8dp">
            <EditText android:id="@+id/input_password"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textPassword"
                android:hint="Password"/>
        </android.support.design.widget.TextInputLayout>

        <android.support.v7.widget.AppCompatButton
            android:id="@+id/btn_login"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:layout_marginBottom="24dp"
            android:padding="12dp"
            android:text="Login"/>

        <TextView android:id="@+id/link_signup"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            android:text="No account yet? Create one"
            android:gravity="center"
            android:textSize="16dip"/>

    </LinearLayout>
</ScrollView>
~~~

## Signup Activity

The Signup Activity enables the user to create an account on your app, and is generally displayed via the link on the Login Activity. 

![Signup Screen](/beautiful-android-logn-and-signup-screens-with-material-design/screenshot-signup.png "Signup Screen") 
{:.width-75 .center}

Note that we set a `RESULT_OK` result when the user signs up successfully. This result can be handled via the `onActivityResult` method of the Login Activity to determine how a successfull signup is handled. The current logic is simply to log the user in straight away after a successfull signup, but if you want some kind of email verification then you will need to implement that yourself.

#### SignupActivity.java

~~~ java
package com.sourcey.materiallogindemo;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import butterknife.ButterKnife;
import butterknife.InjectView;

public class SignupActivity extends AppCompatActivity {
    private static final String TAG = "SignupActivity";

    @InjectView(R.id.input_name) EditText _nameText;
    @InjectView(R.id.input_email) EditText _emailText;
    @InjectView(R.id.input_password) EditText _passwordText;
    @InjectView(R.id.btn_signup) Button _signupButton;
    @InjectView(R.id.link_login) TextView _loginLink;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        ButterKnife.inject(this);

        _signupButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signup();
            }
        });

        _loginLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Finish the registration screen and return to the Login activity
                finish();
            }
        });
    }

    public void signup() {
        Log.d(TAG, "Signup");

        if (!validate()) {
            onSignupFailed();
            return;
        }

        _signupButton.setEnabled(false);

        final ProgressDialog progressDialog = new ProgressDialog(SignupActivity.this,
                R.style.AppTheme_Dark_Dialog);
        progressDialog.setIndeterminate(true);
        progressDialog.setMessage("Creating Account...");
        progressDialog.show();

        String name = _nameText.getText().toString();
        String email = _emailText.getText().toString();
        String password = _passwordText.getText().toString();

        // TODO: Implement your own signup logic here.

        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        // On complete call either onSignupSuccess or onSignupFailed 
                        // depending on success
                        onSignupSuccess();
                        // onSignupFailed();
                        progressDialog.dismiss();
                    }
                }, 3000);
    }


    public void onSignupSuccess() {
        _signupButton.setEnabled(true);
        setResult(RESULT_OK, null);
        finish();
    }

    public void onSignupFailed() {
        Toast.makeText(getBaseContext(), "Login failed", Toast.LENGTH_LONG).show();

        _signupButton.setEnabled(true);
    }

    public boolean validate() {
        boolean valid = true;

        String name = _nameText.getText().toString();
        String email = _emailText.getText().toString();
        String password = _passwordText.getText().toString();

        if (name.isEmpty() || name.length() < 3) {
            _nameText.setError("at least 3 characters");
            valid = false;
        } else {
            _nameText.setError(null);
        }

        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            _emailText.setError("enter a valid email address");
            valid = false;
        } else {
            _emailText.setError(null);
        }

        if (password.isEmpty() || password.length() < 4 || password.length() > 10) {
            _passwordText.setError("between 4 and 10 alphanumeric characters");
            valid = false;
        } else {
            _passwordText.setError(null);
        }

        return valid;
    }
}
~~~

#### res/layout/activity_signup.xml

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:fitsSystemWindows="true">

    <LinearLayout
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingTop="56dp"
        android:paddingLeft="24dp"
        android:paddingRight="24dp">

        <ImageView android:src="@drawable/logo"
            android:layout_width="wrap_content"
            android:layout_height="72dp"
            android:layout_marginBottom="24dp"
            android:layout_gravity="center_horizontal" />

        <!--  Name Label -->
        <android.support.design.widget.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:layout_marginBottom="8dp">
            <EditText android:id="@+id/input_name"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textCapWords"
                android:hint="Name" />
        </android.support.design.widget.TextInputLayout>

        <!-- Email Label -->
        <android.support.design.widget.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:layout_marginBottom="8dp">
            <EditText android:id="@+id/input_email"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textEmailAddress"
                android:hint="Email" />
        </android.support.design.widget.TextInputLayout>

        <!-- Password Label -->
        <android.support.design.widget.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:layout_marginBottom="8dp">
            <EditText android:id="@+id/input_password"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="textPassword"
                android:hint="Password"/>
        </android.support.design.widget.TextInputLayout>

        <!-- Signup Button -->
        <android.support.v7.widget.AppCompatButton
            android:id="@+id/btn_signup"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:layout_marginBottom="24dp"
            android:padding="12dp"
            android:text="Create Account"/>

        <TextView android:id="@+id/link_login"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="24dp"
            android:text="Already a member? Login"
            android:gravity="center"
            android:textSize="16dip"/>

    </LinearLayout>
</ScrollView>
~~~

## Configuration

In order to make everything work we need to add a couple of dependencies to the `build.gradle` file in your `app` directory. ButterKnife is optional, but we like to use it to clean up our Java code a bit.

~~~
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:22.2.0'
    compile 'com.android.support:design:22.2.0'
    compile 'com.jakewharton:butterknife:6.1.0'
}
~~~

Next add the necessary Activity declarations to your AndroidManifest. I have posted the complete `AndroidManifest.xml` for clarity.

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sourcey.materiallogindemo" >

    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme" >
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name=".LoginActivity" android:theme="@style/AppTheme.Dark" />
        <activity android:name=".SignupActivity" android:theme="@style/AppTheme.Dark" />
    </application>

</manifest>
~~~

I hope you've found this article useful, so drop me a shout if it's saved you some precious development hours.

<center>
<p><a class="action-button button radius" target="_blank" href="https://github.com/sourcey/materiallogindemo" title="Get the Code on Github">Get the Code on Github</a></p>
</center>
