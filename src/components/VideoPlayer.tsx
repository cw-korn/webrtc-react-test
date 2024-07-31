import React, { useRef, useEffect } from 'react';

// Interface for the props expected by the VideoPlayer component
interface VideoPlayerProps {
  localStream: MediaStream | null;  // Media stream for local video
  remoteStream: MediaStream | null; // Media stream for remote video
}

// Functional component for displaying local and remote video streams
const VideoPlayer: React.FC<VideoPlayerProps> = ({ localStream, remoteStream }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);   // Reference for local video element
  const remoteVideoRef = useRef<HTMLVideoElement>(null);  // Reference for remote video element

  // Effect to set the local video stream source
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Effect to set the remote video stream source
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline />   
      <video ref={remoteVideoRef} autoPlay playsInline />  
    </div>
  );
};

export default VideoPlayer;
