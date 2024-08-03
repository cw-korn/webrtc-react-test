import React, { useEffect, useRef } from 'react';

// Define the props interface for the VideoPlayer component
interface VideoPlayerProps {
  localStream: MediaStream | null;  // The local video stream
  remoteStream: MediaStream | null; // The remote video stream
}

// Functional component for displaying local and remote video streams
const VideoPlayer: React.FC<VideoPlayerProps> = ({ localStream, remoteStream }) => {
  // Refs to access the video elements in the DOM
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Effect to set the local video stream when it changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream; // Set the video source to the local stream
    }
  }, [localStream]);

  // Effect to set the remote video stream when it changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream; // Set the video source to the remote stream
    }
  }, [remoteStream]);

  return (
    <div>
      {/* Video element for displaying the local stream */}
      <video ref={localVideoRef} autoPlay playsInline />

      {/* Video element for displaying the remote stream */}
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoPlayer;
