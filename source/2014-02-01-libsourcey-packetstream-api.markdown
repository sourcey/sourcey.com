---
title: LibSourcey PacketStream API
date: 2014-02-01 11:42:50
tags: c, libsourcey, packetstream, programming
layout: blogs
---
# LibSourcey PacketStream API

Every C++ programmer understands that taming and writing elegant code for complex C++ applications is no easy task. Herb Sutter himself said that C++ gives you just enough rope to hang yourself, which is a great insight into the power and nuances of the language - and if it were true, then C++ would take many lifetimes to master! C++11 brings us a little closer, but of course the real implementation is left to the programmer.

One particular class that is used extensively throughout LibSourcey to simplify data processing is the PacketStream. The PacketStream acts as a delegate chain for any class that handles and emits the IPacket type, allowing any processor to dynamically plug into the stream and preform arbitrary processing on packets as they are passed down the stream.

Take a look at the pseudo code below which takes a video device input, applies a motion filter to it, encodes the filtered video as H.264, and broadcasts the encoded media to delegates listening in on the output PacketSignal:

```cpp  
// create the stream
PacketStream stream;

// init and attach capture
VideoCapture video(0);
AudioCapture audio(0, 2, 44100);	
stream.attach(video, false);
stream.attach(audio, false);

// init and attach raw video processor
MotionDetector* detector = new MotionDetector;
detector->setVideoCapture(video);
attach(detector, 1, true);		

// init and attach encoder							
EncoderParams params;          
params.oformat = Format("MP4", Format::MP4, 
  VideoCodec(Codec::H264, "H264", 400, 300, 25),
  AudioCodec(Codec::AAC, "AAC", 2, 44100));

AVEncoder* encoder = new AVEncoder(params);
encoder->initialize();
stream.attach(encoder, 5, true);

// other processors may be attached here for
// processing media data emitted by the encoder.

// start the stream and encoding
stream.start();
```

Pretty cool huh? PacketStreams can also be forked so each output stream can be processed independently. This might be useful if we want to take a single encoder output, and packetise the data separately for broadcasting to multiple destinations:

```cpp
// root stream
PacketStream stream;

// attach processors to the root stream...

// forked stream 1         
PacketStream fork1;

// attach processors or packetisers to fork1...

// attach root stream to fork1
fork1->attach(&amp;stream, false, false);

// forked stream 2
PacketStream fork2;

// attach processors or packetisers to fork2...

// attach root stream to fork2
fork2->attach(&amp;_stream, false, false);

// start pumping data into the delegate chain
stream.start();
```

As you can see this method of processing data is very flexible. By default the PacketStream doesn't copy any data, unless an internal PacketQueue is employed to buffer and synchronise output packets with different threads, or simply defer processing from the source thread.

Most LibSourcey classes that handle packets have a PacketAdapter implementation which allows them to interface with a PacketStream. We find that using this model helps us adhere to C++ best practices and write better code by keeping classes simple and modular.