---
title: FFmpeg Multiplexing Live Webcam and Microphone Streams
date: 2014-03-28 10:53:27
tags: encoding, ffmpeg, programming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# FFmpeg Multiplexing Live Webcam and Microphone Streams

The other day I had a tough time trying to get multiple FFmpeg codecs to behave consistently with live variable framerate stream sources, such as a microphone and a webcam. It didn't take too long before I realised that the encoder was not multiplexing properly when fed frames at irregular intervals, even when specifying the correct PTS (presentation timestamp). 

Some of the effects were crackly audio and sped up video (when not enough frames, even with correct timestamp) - from memory H.264 was especially touchy.

Anyway, I decided to mirror the behaviour of FFmpeg's output-example.c (which is now <a href="https://github.com/FFmpeg/FFmpeg/blob/master/doc/examples/transcoding.c" target="_blank">transcoding.c</a>), and try buffering and doubling up video frames (video is most unreliable, and often slower than the audio) to ensure consistency, and bam, problem solved!

As with all our C++ media encoding goodies, they end up in [LibSourcey](/libsourcey). The solution looks like this (See `LiveStreamEncoder::process` for the nitty gritty):

#### livestreamencoder.cpp

~~~ cpp
//
// LibSourcey
// Copyright (C) 2005, Sourcey <http://sourcey.com>
//
// LibSourcey is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// LibSourcey is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
//


#include "scy/media/livestreamencoder.h"
#ifdef HAVE_FFMPEG


using std::endl;


namespace scy {
namespace av {


LiveStreamEncoder::LiveStreamEncoder(const EncoderOptions& options, bool muxLiveStreams) :
	AVEncoder(options), 
	PacketProcessor(AVEncoder::emitter), 
	_muxStreams(muxLiveStreams), 
	_lastVideoPacket(nullptr)
{
}


LiveStreamEncoder::LiveStreamEncoder(bool muxLiveStreams) :
	AVEncoder(), 
	PacketProcessor(AVEncoder::emitter), 
	_muxStreams(muxLiveStreams), 
	_lastVideoPacket(nullptr)
{
}


LiveStreamEncoder::~LiveStreamEncoder()
{
}


void LiveStreamEncoder::process(IPacket& packet)
{	
	Mutex::ScopedLock lock(_mutex);

	// We may be receiving either audio or video packets	
	VideoPacket* vPacket = dynamic_cast<VideoPacket*>(&packet);
	AudioPacket* aPacket = vPacket ? nullptr : dynamic_cast<AudioPacket*>(&packet);
	if (!vPacket && !aPacket)
		throw std::invalid_argument("Unknown media packet type.");

	// Do some special synchronizing for muxing live variable framerate streams
	if (_muxStreams) {
		VideoEncoderContext* video = AVEncoder::video();
		AudioEncoderContext* audio = AVEncoder::audio();
		assert(audio && video);
		double audioPts, videoPts;
		int times = 0;
		for (;;) {
			times++;
			assert(times < 10);			
			audioPts = audio ? (double)audio->stream->pts.val * audio->stream->time_base.num / audio->stream->time_base.den : 0.0;
			videoPts = video ? (double)video->stream->pts.val * video->stream->time_base.num / video->stream->time_base.den : 0.0;			
			if (aPacket) {
				// Write the audio packet when the encoder is ready
				if (!video || audioPts < videoPts) {
					encode(*aPacket);
					break;
				}

				// Write dummy video frames until we can encode the audio
				else {
					// May be null if the first packet was audio, skip...
					if (!_lastVideoPacket)
						break;

					encode(*_lastVideoPacket);
				}
			}
			else if (vPacket) {
				// Write the video packet if the encoder is ready
				if (!audio || audioPts > videoPts)
					encode(*vPacket);
				
				if (audio) {
					// Clone and buffer the last video packet it can be used
					// as soon as we need an available frame.
					// used as a filler if the source framerate is inconstant.
					if (_lastVideoPacket)
						delete _lastVideoPacket;
					_lastVideoPacket = reinterpret_cast<scy::av::VideoPacket*>(vPacket->clone());
				}
				break;
			}
		}
	}
	else if (vPacket) {
		encode(*vPacket);
	}
	else if (aPacket) {
		encode(*aPacket);
	}
}


void LiveStreamEncoder::encode(VideoPacket& packet)
{
	encodeVideo((unsigned char*)packet.data(), packet.size(), packet.width, packet.height, (UInt64)packet.time);
}


void LiveStreamEncoder::encode(AudioPacket& packet)
{
	encodeAudio((unsigned char*)packet.data(), packet.size());
}


bool LiveStreamEncoder::accepts(IPacket& packet) 
{ 
	return dynamic_cast<av::MediaPacket*>(&packet) != 0; 
}

					
void LiveStreamEncoder::onStreamStateChange(const PacketStreamState& state) 
{ 
	TraceLS(this) << "On stream state change: " << state << endl;
	
	Mutex::ScopedLock lock(_mutex);

	switch (state.id()) {
	case PacketStreamState::Active:
		if (!isActive()) {
			TraceLS(this) << "Initializing" << endl;
			//if (AVEncoder::options().oformat.video.enabled && 
			//	AVEncoder::options().oformat.audio.enabled)
			//	_muxStreams = true;
			AVEncoder::initialize();
		}
		break;
		
	case PacketStreamState::Resetting:
	case PacketStreamState::Stopping:
		if (isActive()) {
			TraceLS(this) << "Uninitializing" << endl;
			AVEncoder::uninitialize();
		}
		break;
	//case PacketStreamState::Stopped:
	//case PacketStreamState::Error:
	//case PacketStreamState::None:
	//case PacketStreamState::Closed:
	}

	TraceLS(this) << "Stream state change: OK: " << state << endl;
}


} } // namespace scy::av


#endif
~~~ 

#### livestreamencoder.h

~~~ cpp
//
// LibSourcey
// Copyright (C) 2005, Sourcey <http://sourcey.com>
//
// LibSourcey is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// LibSourcey is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
//


#ifndef SCY_AV_LiveStreamEncoder_H
#define SCY_AV_LiveStreamEncoder_H


#include "scy/base.h"
#ifdef HAVE_FFMPEG
#include "scy/packetstream.h"
#include "scy/media/avencoder.h"


namespace scy { 
namespace av {


class LiveStreamEncoder: public AVEncoder, public PacketProcessor
	/// Encodes and multiplexes a realtime video stream form 
	/// audio / video capture sources.
	/// FFmpeg is used for encoding.
{
public:
	LiveStreamEncoder(const EncoderOptions& options, bool muxLiveStreams = false);
	LiveStreamEncoder(bool muxLiveStreams = false);
	virtual ~LiveStreamEncoder();
	
	virtual void encode(VideoPacket& packet);
	virtual void encode(AudioPacket& packet);

protected:		
	virtual bool accepts(IPacket& packet);
	virtual void process(IPacket& packet);	
	virtual void onStreamStateChange(const PacketStreamState& state);

	friend class PacketStream;
			
	mutable Mutex _mutex;
	bool _muxStreams;
	VideoPacket* _lastVideoPacket;
};


} } // namespace scy::av


#endif
#endif
~~~ 