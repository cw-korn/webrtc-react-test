import React from 'react';
import './App.css';
import CallControls from './components/CallControls';
import VideoPlayer from './components/VideoPlayer';
import useWebRTC from './hooks/useWebRTC';

const App: React.FC = () => {
  const { localStream, remoteStream, call, answerCall } = useWebRTC();

  return (
    <div className="container">
      <CallControls call={call} answerCall={answerCall} />
      <VideoPlayer localStream={localStream} remoteStream={remoteStream} />
    </div>
  );
};

export default App;
