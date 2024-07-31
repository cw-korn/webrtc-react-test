import { useState, useRef } from 'react';
import { io } from 'socket.io-client';

// Custom hook to manage WebRTC functionality and state
const useWebRTC = () => {
  // State for storing local and remote media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Refs for managing the peer connection and socket connection
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef(io('https://localhost:8080/')).current;

  // Function to start the local media stream
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  // Function to initiate a call
  const call = async () => {
    const localStream = await startLocalStream();
    if (!localStream) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendIceCandidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('newOffer', offer);
  };

  // Function to answer an incoming call
  const answerCall = async () => {
    const localStream = await startLocalStream();
    if (!localStream) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendIceCandidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    socket.on('newOffer', async (offer: RTCSessionDescriptionInit) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer);
      socket.emit('newAnswer', answer);
    });

    socket.on('sendIceCandidate', async (candidate: RTCIceCandidate) => {
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  // Return local and remote streams along with call and answer functions
  return { localStream, remoteStream, call, answerCall };
};

export default useWebRTC;
