import React from 'react';
import './App.css'; // Import the stylesheet for styling
import useWebRTC from './hooks/useWebRTC'; // Custom hook for WebRTC functionality
import VideoPlayer from './components/VideoPlayer'; // Component for displaying video streams
import CallControls from './components/CallControls'; // Component for call control buttons

const App: React.FC = () => {
  // Destructure the properties returned by the useWebRTC hook
  const { localStream, remoteStream, call, answerCall, incomingCall, isCaller } = useWebRTC();

  return (
    <div className="container">
      {/* Display a random username */}
      <div id="user-name">Uniclass-{Math.floor(Math.random() * 100000)}</div>

      {/* Render call control buttons and pass necessary props */}
      <CallControls 
        call={call} 
        answerCall={answerCall} 
        incomingCall={incomingCall} 
        isCaller={isCaller} 
      />

      {/* Render video player components for local and remote streams */}
      <VideoPlayer 
        localStream={localStream} 
        remoteStream={remoteStream} 
      />

      {/* Display an incoming call message if there's an incoming call and the user is not the caller */}
      {!isCaller && incomingCall && <p>Incoming call...</p>}
    </div>
  );
};

export default App;
