import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const useWebRTC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false); // New state to track caller status
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef(io('https://localhost:8080/')).current;
  // const socket = useRef(io('https://192.168.1.156:8080')).current;


  useEffect(() => {
    socket.on('newOfferAwaiting', async (offer) => {
      setIncomingCall(true);
      setIsCaller(false); // Mark as receiver when an offer is received
    });

    socket.on('answerResponse', async (answer) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('receivedIceCandidateFromServer', async (candidate) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const call = async () => {
    setIsCaller(true); // Mark as caller
    const stream = await startLocalStream();
    if (!stream) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendIceCandidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('newOffer', offer);
    } catch (error) {
      console.error('Error creating offer.', error);
    }
  };

  const answerOffer = async () => {
    const stream = await startLocalStream();
    if (!stream) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendIceCandidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    try {
      // Replace with actual logic to get and use the incoming offer
      // Example: `const offer = getOfferFromSomewhere();`
      // await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('newAnswer', answer);
      setIncomingCall(false);
    } catch (error) {
      console.error('Error answering call.', error);
    }
  };

  return { localStream, remoteStream, call, answerCall: answerOffer, incomingCall, isCaller };
};

export default useWebRTC;
