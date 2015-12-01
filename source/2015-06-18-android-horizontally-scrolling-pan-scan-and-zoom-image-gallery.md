---
title: Android Hotizontally Scrolling Pan Scan and Zoom Image Gallery
date: 2015-06-18
tags: Android, Gallery, Demo
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

Since the depreciation of the Android Gallery module there has been no clear way to implement image galleries on Android, so I'm sharing my own Gallery implementation in order to fill the need. 

![Android Gallery Demo](/android-horizontally-scrolling-pan-scan-and-zoom-image-gallery/screenshot-gallery.jpg "Android Gallery Demo") 
{:.width-75 .center}

The implementation is a horizontal scrolling image gallery that consists of `ViewPager` element, and a `HorizontalScrollView` for displaying selectable thumbnails. Inside the `ViewPager` view there is a modified `ImageView` that allows for panning, scanning and zooming of the main image. 

Horizontal galleries are ideal for displaying smaller amounts of images (<10), although if you need to display lots of images then you might be better served with a `GridView` based implementation. 

<center>
<p><a class="action-button button radius" target="_blank" href="https://github.com/sourcey/imagegallerydemo" title="Get the Code on Github">Get the Code</a></p>
</center>

#### GalleryActivity.java:

~~~ java
package com.sourcey.imagegallerydemo;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.view.PagerAdapter;
import android.support.v7.app.AppCompatActivity;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.davemorrissey.labs.subscaleview.ImageSource;
import com.davemorrissey.labs.subscaleview.SubsamplingScaleImageView;

import junit.framework.Assert;

import java.util.ArrayList;

import butterknife.ButterKnife;
import butterknife.InjectView;

public class GalleryActivity extends AppCompatActivity {
    public static final String TAG = "GalleryActivity";
    public static final String EXTRA_NAME = "images";

    private ArrayList<String> _images;
    private GalleryPagerAdapter _adapter;

    @InjectView(R.id.pager) ViewPager _pager;
    @InjectView(R.id.thumbnails) LinearLayout _thumbnails;
    @InjectView(R.id.btn_close) ImageButton _closeButton;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gallery);
        ButterKnife.inject(this);

        _images = (ArrayList<String>) getIntent().getSerializableExtra(EXTRA_NAME);
        Assert.assertNotNull(_images);

        _adapter = new GalleryPagerAdapter(this);
        _pager.setAdapter(_adapter);
        _pager.setOffscreenPageLimit(6); // how many images to load into memory

        _closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, "Close clicked");
                finish();
            }
        });
    }

    class GalleryPagerAdapter extends PagerAdapter {

        Context _context;
        LayoutInflater _inflater;

        public GalleryPagerAdapter(Context context) {
            _context = context;
            _inflater = (LayoutInflater) _context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public int getCount() {
            return _images.size();
        }

        @Override
        public boolean isViewFromObject(View view, Object object) {
            return view == ((LinearLayout) object);
        }

        @Override
        public Object instantiateItem(ViewGroup container, final int position) {
            View itemView = _inflater.inflate(R.layout.pager_gallery_item, container, false);
            container.addView(itemView);

            // Get the border size to show around each image
            int borderSize = _thumbnails.getPaddingTop();
            
            // Get the size of the actual thumbnail image
            int thumbnailSize = ((FrameLayout.LayoutParams)
                    _pager.getLayoutParams()).bottomMargin - (borderSize*2);
            
            // Set the thumbnail layout parameters. Adjust as required
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(thumbnailSize, thumbnailSize);
            params.setMargins(0, 0, borderSize, 0);

            // You could also set like so to remove borders
            //ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(
            //        ViewGroup.LayoutParams.WRAP_CONTENT,
            //        ViewGroup.LayoutParams.WRAP_CONTENT);
            
            final ImageView thumbView = new ImageView(_context);
            thumbView.setScaleType(ImageView.ScaleType.CENTER_CROP);
            thumbView.setLayoutParams(params);
            thumbView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d(TAG, "Thumbnail clicked");

                    // Set the pager position when thumbnail clicked
                    _pager.setCurrentItem(position);
                }
            });
            _thumbnails.addView(thumbView);

            final SubsamplingScaleImageView imageView =
                    (SubsamplingScaleImageView) itemView.findViewById(R.id.image);

            // Asynchronously load the image and set the thumbnail and pager view
            Glide.with(_context)
                    .load(_images.get(position))
                    .asBitmap()
                    .into(new SimpleTarget<Bitmap>() {
                        @Override
                        public void onResourceReady(Bitmap bitmap, GlideAnimation anim) {
                            imageView.setImage(ImageSource.bitmap(bitmap));
                            thumbView.setImageBitmap(bitmap);
                        }
                    });

            return itemView;
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView((LinearLayout) object);
        }
    }
}
~~~

The layout consists of two items, one for the activity, and one for the pager items.

#### res/layout/activity_gallery.xml

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/black">

    <android.support.v4.view.ViewPager
        android:id="@+id/pager"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="72dp">
    </android.support.v4.view.ViewPager>

    <ImageButton
        android:id="@+id/btn_close"
        android:layout_width="?attr/actionBarSize"
        android:layout_height="?attr/actionBarSize"
        android:layout_gravity="top|right"
        android:src="@drawable/ic_close_grey600_24dp"
        android:scaleType="fitCenter"
        style="@style/Widget.AppCompat.ActionButton" />

    <HorizontalScrollView
        android:layout_width="match_parent"
        android:layout_height="72dp"
        android:layout_gravity="bottom"
        android:background="@color/black">
        <LinearLayout
            android:id="@+id/thumbnails"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:gravity="center_vertical"
            android:orientation="horizontal"
            android:paddingTop="2dp"/>
    </HorizontalScrollView>
</FrameLayout>
~~~

#### res/layout/pager_gallery_item.xml

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <com.davemorrissey.labs.subscaleview.SubsamplingScaleImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/image" />
</LinearLayout>
~~~

## Configuration

In order to make everything work we need to add a couple of dependencies to the `build.gradle` file in your `app` directory. ButterKnife is optional, but we like to use it to clean up our Java code a bit.

~~~
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:22.2.0'
    compile 'com.github.bumptech.glide:glide:3.6.0'
    compile 'com.davemorrissey.labs:subsampling-scale-image-view:3.1.3'
    compile 'com.jakewharton:butterknife:6.1.0'
}
~~~

Next add the necessary Activity declarations to your AndroidManifest. I have posted the complete AndroidManifest.xml for clarity.

~~~ xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sourcey.imagegallerydemo" >

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
        <activity android:name=".GalleryActivity" />
    </application>

</manifest>
~~~

When everything is setup you can instantiate the Gallery like so:

~~~
public void startGalleryActivity() {
    ArrayList<String> images = new ArrayList<String>();
    images.add("http://sourcey.com/images/stock/salvador-dali-metamorphosis-of-narcissus.jpg");
    images.add("http://sourcey.com/images/stock/salvador-dali-the-dream.jpg");
    images.add("http://sourcey.com/images/stock/salvador-dali-persistance-of-memory.jpg");
    images.add("http://sourcey.com/images/stock/simpsons-persistance-of-memory.jpg");
    images.add("http://sourcey.com/images/stock/salvador-dali-the-great-masturbator.jpg");
    Intent intent = new Intent(MainActivity.this, GalleryActivity.class);
    intent.putStringArrayListExtra(GalleryActivity.EXTRA_NAME, images);
    startActivity(intent);
}
~~~

The current code takes an array of image URLs and renders them asynchronously with `Glide`, but if you want to modify the code to display local resources, or even exchange Glide with another rendering library, then it should be fairly straight forward as the implementation is very simple.

I hope you've found this article useful, so drop me a shout if it's saved you some precious development hours. As usual, the full source code is up on Github:

<center>
<p><a class="action-button button radius" target="_blank" href="https://github.com/sourcey/imagegallerydemo" title="Get the Code on Github">Get the Code on Github</a></p>
</center>
