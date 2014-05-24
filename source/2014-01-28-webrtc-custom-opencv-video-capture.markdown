---
title: WebRTC Custom OpenCV Video Capture
date: 2014-01-28 08:32:11
tags: c++, opencv, webrtc, video
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# WebRTC Custom OpenCV Video Capture

![WebRTC](logos/webrtc-250x250.png "WebRTC"){: .align-left}
WebRTC comes with an video device capture implementations for most platforms including Linux, Mac, Windows, iOS and Android, but what if we want to use our own video capture source such as a frame-grabber, or OpenCV or FFmpeg? The good news is that it's quite easy, all you need to do is override the `cricket::VideoCapturer` class and create a custom `cricket::VideoCapturerFactory` for attaching to the `cricket::DeviceManagerInterface`. The code below can be used as a replacement for the default `cricket::VideoCapturer` that's used by the `peerconnection_client` example that's distributed with the WebRTC source.

Bear in mind that these classes are just for testing, and are by no means 100% complete. For example pixel format handling and conversion is fixed to I420, but this can be easily implemented as the logic is already in place.

#### videocapturerocv.h

~~~ cpp
#ifndef SCY_VideoCaturerOCV_H
#define SCY_VideoCaturerOCV_H


#include "scy/media/videocapture.h"
#include "talk/media/base/videocapturer.h"


namespace scy { 


class VideoCapturerOCV : 
    public av::VideoCapture, 
    // Extend the LibSourcey av::VideoCapture class, which is a this wrapper  
    // around the OpenCV VideoCapture
    public cricket::VideoCapturer
    // VideoCapturerOCV implements a simple cricket::VideoCapturer which
    // gets decoded remote video frames from media channel.
    // It's used as the remote video source's VideoCapturer so that the remote 
    // video can be used as a cricket::VideoCapturer and in that way a remote
    // video stream can implement the MediaStreamSourceInterface.
{
public:
    VideoCapturerOCV(int deviceId);
    virtual ~VideoCapturerOCV();

    // Overrides from VideoCapture.
    void onFrameCaptured(void* sender, av::MatrixPacket& packet);

    // cricket::VideoCapturer implementation.
    virtual cricket::CaptureState Start(
      const cricket::VideoFormat& capture_format) OVERRIDE;
    virtual void Stop() OVERRIDE;
    virtual bool IsRunning() OVERRIDE;
    virtual bool GetPreferredFourccs(std::vector<uint32>* fourccs) OVERRIDE;
    virtual bool GetBestCaptureFormat(const cricket::VideoFormat& desired,
      cricket::VideoFormat* best_format) OVERRIDE;
    virtual bool IsScreencast() const OVERRIDE;

private:
    DISALLOW_COPY_AND_ASSIGN(VideoCapturerOCV);
};


class VideoCapturerFactoryOCV : public cricket::VideoCapturerFactory 
{
public:
    VideoCapturerFactoryOCV() {}
    virtual ~VideoCapturerFactoryOCV() {}

    virtual cricket::VideoCapturer* Create(const cricket::Device& device) {

        // XXX: WebRTC uses device name to instantiate the capture, which is always 0.
        return new VideoCapturerOCV(util::strtoi<int>(device.id));
    }
};


} // namespace scy


#endif
~~~ 

#### videocapturerocv.cpp

~~~ cpp
#include "videocapturerocv.h"


using std::endl;


namespace scy {


VideoCapturerOCV::VideoCapturerOCV(int deviceId) : av::VideoCapture(deviceId)
{	
    // Default supported formats. Use ResetSupportedFormats to over write.
    std::vector<cricket::VideoFormat> formats;
    formats.push_back(cricket::VideoFormat(1280, 720,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_I420));
    formats.push_back(cricket::VideoFormat(640, 480,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_I420));
    formats.push_back(cricket::VideoFormat(320, 240,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_I420));
    formats.push_back(cricket::VideoFormat(160, 120,
        cricket::VideoFormat::FpsToInterval(30), cricket::FOURCC_I420));
}


VideoCapturerOCV::~VideoCapturerOCV() 
{
}


cricket::CaptureState VideoCapturerOCV::Start(const cricket::VideoFormat& capture_format)
{
    try { 
        TraceL << "Start" << endl;
        if (capture_state() == cricket::CS_RUNNING) {
            WarnL << "Start called when it's already started." << endl;
            return capture_state();
        }

        // TODO: Honour VideoFormat

        av::VideoCapture::start();
        av::VideoCapture::emitter += packetDelegate(this, &VideoCapturerOCV::onFrameCaptured); 

        SetCaptureFormat(&capture_format);
        return cricket::CS_RUNNING;
    } catch (...) {}
    return cricket::CS_FAILED;
}


void VideoCapturerOCV::Stop()
{
    try { 
        TraceL << "Stop" << endl;
        if (capture_state() == cricket::CS_STOPPED) {
          WarnL << "Stop called when it's already stopped." << endl;
          return;
        }
        av::VideoCapture::stop();
        SetCaptureFormat(NULL);
        SetCaptureState(cricket::CS_STOPPED);
        return;
    } catch (...) {}
    return;
}


void VideoCapturerOCV::onFrameCaptured(void* sender, av::MatrixPacket& packet) 
{	
    cv::Mat yuv(packet.width, packet.height, CV_8UC4);
    cv::cvtColor(*packet.mat, yuv, CV_BGR2YUV_I420);

    cricket::CapturedFrame frame;
    frame.width = packet.width;
    frame.height = packet.height;
    frame.fourcc = cricket::FOURCC_I420;
    frame.data_size = yuv.rows * yuv.step;
    frame.data = yuv.data;

    SignalFrameCaptured(this, &frame);
}


bool VideoCapturerOCV::IsRunning()
{
    return capture_state() == cricket::CS_RUNNING;
}


bool VideoCapturerOCV::GetPreferredFourccs(std::vector<uint32>* fourccs)
{
    if (!fourccs)
        return false;
    fourccs->push_back(cricket::FOURCC_I420);
    return true;
}


bool VideoCapturerOCV::GetBestCaptureFormat(const cricket::VideoFormat& desired, cricket::VideoFormat* best_format)
{
    if (!best_format)
        return false;

    // VideoCapturerOCV does not support capability enumeration.
    // Use the desired format as the best format.
    best_format->width = desired.width;
    best_format->height = desired.height;
    best_format->fourcc = cricket::FOURCC_I420;
    best_format->interval = desired.interval;
    return true;
}


bool VideoCapturerOCV::IsScreencast() const 
{
    return false;
}


} // namespace scy
~~~ 

The VideoCapturerOCV class can now be used like so:

~~~ cpp
bool PeerConnectionClient::InitConnection() 
{
    peer_connection_ = peer_connection_factory_->CreatePeerConnection(
      servers_, &constraints_, NULL, this);
      
    talk_base::scoped_refptr<webrtc::AudioTrackInterface> audio_track(
      peer_connection_factory_->CreateAudioTrack(kAudioLabel, 
        peer_connection_factory_->CreateAudioSource(NULL)));

    talk_base::scoped_refptr<webrtc::VideoTrackInterface> video_track(
      peer_connection_factory_->CreateVideoTrack(kVideoLabel, 
        peer_connection_factory_->CreateVideoSource(OpenVideoCaptureDevice(), NULL)));

    stream_ = peer_connection_factory_->CreateLocalMediaStream(kStreamLabel);
    stream_->AddTrack(audio_track);
    stream_->AddTrack(video_track);
    if (!peer_connection_->AddStream(stream_, &constraints_)) {
        ErrorL << "Adding stream to PeerConnection failed" << endl;
    }

    return true;
}


cricket::VideoCapturer* PeerConnectionClient::OpenVideoCaptureDevice() 
{
    talk_base::scoped_ptr<cricket::DeviceManagerInterface> dev_manager(
      cricket::DeviceManagerFactory::Create());	
    if (!dev_manager->Init()) {
        ErrorL << "Can't create device manager" << endl;
        return NULL;
    }

    // Add our OpenCV VideoCapturer factory
    cricket::DeviceManager* device_manager = static_cast<cricket::DeviceManager*>(dev_manager.get());
    device_manager->set_device_video_capturer_factory(new VideoCapturerFactoryOCV());

    std::vector<cricket::Device> devs;
    if (!dev_manager->GetVideoCaptureDevices(&devs)) {
        ErrorL << "Can't enumerate video devices" << endl;
        return NULL;
    }
    std::vector<cricket::Device>::iterator dev_it = devs.begin();
    cricket::VideoCapturer* capturer = NULL;
    for (; dev_it != devs.end(); ++dev_it) {
        capturer = dev_manager->CreateVideoCapturer(*dev_it);
        if (capturer != NULL)
            break;
    }
    return capturer;
}
~~~ 

Happy coding!