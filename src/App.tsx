import React from 'react';
import './App.css';
import useWebRTC from './hooks/useWebRTC';
import VideoPlayer from './components/VideoPlayer';
import CallControls from './components/CallControls';

const App: React.FC = () => {
  const { localStream, remoteStream, call, answerCall, incomingCall, isCaller } = useWebRTC();

  return (
    <div className="container">
      <div id="user-name">Uniclass-{Math.floor(Math.random() * 100000)}</div>
      <CallControls call={call} answerCall={answerCall} incomingCall={incomingCall} isCaller={isCaller} />
      <VideoPlayer localStream={localStream} remoteStream={remoteStream} />
      {!isCaller && incomingCall && <p>Incoming call...</p>}
    </div>
  );
};

export default App;
