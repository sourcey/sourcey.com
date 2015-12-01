---
title: Android Custom Centered ActionBar with Material Design
date: 2015-07-11
tags: Android, Material
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

The Android ActionBar is now easier to customise than ever, due to the fact that the old `ActionBar` element has been replaced with the more versitile `Toolbar`. Since `Toolbar` inherits directly from `ViewGroup`, you can essentially style or add any element you want to the ActionBar. That is, with the exception of a few gotchas, but you're in luck because this article is here so you don't get got!

Just a foreward to say that this article makes the assumption that you are using the support library - and if you're not then you're only targeting about 10% of devices which is more than a little strange.

OK, let's code.

Below is the completed `Toolbar` layout. Go ahead and add it to your project, and you can make changes from there.

#### /res/layout/toolbar.xml
~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.v7.widget.Toolbar
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/toolbar"
    android:layout_width="match_parent"
    android:layout_height="?attr/actionBarSize"
    android:background="?attr/colorPrimary"
    app:popupTheme="@style/ThemeOverlay.AppCompat.Light"
    app:layout_scrollFlags="scroll|enterAlways"
    app:layout_collapseMode="pin">
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <!-- This is a centered logo -->
        <ImageView
            android:id="@+id/toolbar_logo"
            android:src="@drawable/logo"
            android:layout_width="wrap_content"
            android:layout_height="fill_parent"
            android:layout_marginRight="?attr/actionBarSize"
            android:layout_marginTop="4dp"
            android:layout_marginBottom="4dp"
            android:layout_gravity="center" />

        <!-- This is a centered title -->
        <!--
        <TextView
            android:id="@+id/toolbar_title"
            android:orientation="horizontal"
            android:layout_width="wrap_content"
            android:layout_height="fill_parent"
            android:layout_marginRight="?attr/actionBarSize"
            android:layout_gravity="center"
            android:gravity="center_vertical"
            android:visibility="gone"
            android:text="@string/app_name"
            android:textColor="@color/white"
            style="@style/TextAppearance.AppCompat.Widget.ActionBar.Title.Inverse"
            />
            -->

        <!-- This is a custom left side button -->
        <!--
        <ImageButton
            android:id="@+id/btn_settings"
            android:layout_width="?attr/actionBarSize"
            android:layout_height="?attr/actionBarSize"
            android:layout_marginRight="?attr/actionBarSize"
            android:layout_gravity="start|center_vertical"
            android:visibility="invisible"
            android:src="@drawable/ic_settings_white_24dp"
            style="@style/Widget.AppCompat.ActionButton" />
            -->

        <!-- This is a custom right side button -->
        <!--
        <ImageButton
            android:id="@+id/btn_search"
            android:layout_width="?attr/actionBarSize"
            android:layout_height="?attr/actionBarSize"
            android:layout_gravity="end"
            android:src="@drawable/ic_magnify_white_24dp"
            style="@style/Widget.AppCompat.ActionButton" />
            -->

    </FrameLayout>
</android.support.v7.widget.Toolbar>
~~~

Below is a very minimal `MainActivity.java` class which shows how to override the default ActionBar as simple as possible, and outlines some options that can be used to configure how the ActionBar behaves.

#### MainActivity.java
~~~ java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); // an example activity_main.xml is provided below

        // Always cast your custom Toolbar here, and set it as the ActionBar.
        Toolbar tb = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(tb);

        // Get the ActionBar here to configure the way it behaves.
        final ActionBar ab = getSupportActionBar();
        //ab.setHomeAsUpIndicator(R.drawable.ic_menu); // set a custom icon for the default home button
        ab.setDisplayShowHomeEnabled(true); // show or hide the default home button
        ab.setDisplayHomeAsUpEnabled(true);
        ab.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
        ab.setDisplayShowTitleEnabled(false); // disable the default title element here (for centered title)
    }
}
~~~

## Centering the Title or Logo

Our custom ActionBar layout uses a centered title element by default (or logo depending on your preference of text or image as a title). This deviates from the Android stardard a little, which is to left align the title text and position it just to the right of the home button. Many apps still opt for the centered title design though, probably because it has been made popular on iOS.

A common gotcha here is that if we are aligning the title element with center gravity, and we are using any of the default toolbar buttons, then our custom toolbar will be pushed to the side of the default buttons, causing our title centering will be off by the width of the default button (unless of course you are using the default buttons on either side, in which case our cusorm toolbar will still be centered). To counter this, just add `android:layout_marginLeft|Right="?attr/actionBarSize"`to the custom `TextView` or `ImageView` that's acting as the centered title. Easy.

If you don't want a centered title and would prefer to use the default left aligned ActionBar title, then just remove the `toolbar_logo` and `toolbar_logo` elements from the `toolbar.xml` file, and remove the call to `ab.setDisplayShowTitleEnabled(false);` from your `MainActivity.java`.

## Material Design Buttons

To make your custom buttons play nicely inside the ActionBar and have transparent ripple effects just add the `Widget.AppCompat.ActionButton` style to each `ImageButton`, like so:

~~~ xml
<ImageButton
    android:id="@+id/btn_search"
    android:layout_width="?attr/actionBarSize"
    android:layout_height="?attr/actionBarSize"
    android:src="@drawable/ic_magnify_white_24dp"
    style="@style/Widget.AppCompat.ActionButton" />
~~~

A m ore complete example has already been provided in the `toolbar.xml` file above.

Obviously, if you wanted to extend the default `Widget.AppCompat.ActionButton` style, you could do so via `styles.xml`:

~~~ xml
    <style name="AppTheme.ActionButton" parent="Widget.AppCompat.ActionButton">
        <!-- Your custom styles here -->
    </style>
~~~

To enable your custom style just replace `style="@style/Widget.AppCompat.ActionButton"` with `style="@style/AppTheme.ActionButton"`.

## Using AppBarLayout with the CoordinatorLayout

If you're going for a real Material Design interface, then you will probably want to utilise the `CoordinatorLayout` class, and wrap your custom toolbar inside an `AppBarLayout`. The `CoordinatorLayout` lets you sprinkle some magic UX powder into your app by intelligently positioning and interacting with elements based on current scroll position. In the context of the `ActionBar`, the `CoordinatorLayout` provides the ability to automaticly expand and collapse the toolbar with parralax background images.

An example layout would look like so:

#### /res/layout/appbar.xml
~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.AppBarLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/appbar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar"
    android:fitsSystemWindows="true">

    <!--
      Make your toolbar expandable with CollapsingToolbarLayout
      Note that a centered ActionBar won't play nicely with the CollapsingToolbarLayout
    -->
    <!--
    <android.support.design.widget.CollapsingToolbarLayout
        android:id="@+id/collapsing_toolbar"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_scrollFlags="scroll|exitUntilCollapsed"
        android:fitsSystemWindows="true"
        app:contentScrim="?attr/colorPrimary"
        app:expandedTitleMarginStart="48dp"
        app:expandedTitleMarginEnd="64dp">
        -->

        <!-- Add a parallax background image if using CollapsingToolbarLayout -->
        <!--
        <ImageView
            android:id="@+id/backdrop"
            android:src="@drawable/backdrop"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:scaleType="centerCrop"
            app:layout_collapseMode="parallax" />
            -->

        <!-- Include our custom Toolbar -->
        <include layout="@layout/toolbar" />

    <!--
    </android.support.design.widget.CollapsingToolbarLayout>
    -->

</android.support.design.widget.AppBarLayout>
~~~

#### /res/layout/main_activity.xml
~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/coordinator"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true">

    <!-- Include the AppBarLayout -->
    <include layout="@layout/appbar" />

    <FrameLayout
        android:id="@+id/main_fragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <!-- Add you content here -->

    </FrameLayout>

</android.support.design.widget.CoordinatorLayout>
~~~

That should get you started. Please drop a line if you have anything to add, or just want to say thanks. Now go fourth and create!

## Watch the Video

The guys and gals over at [Webucator](https://www.webucator.com/programming/android-training.cfm) have created a video tutorial from this post. Check it out:

<iframe width="640" height="360" src="https://www.youtube.com/embed/kUIn8NJTEhk" frameborder="0" allowfullscreen></iframe>
