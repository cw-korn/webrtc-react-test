import React from 'react';

// Define the props interface for the CallControls component
interface CallControlsProps {
  call: () => void;       // Function to initiate a call
  answerCall: () => void; // Function to answer a call
  incomingCall: boolean;  // Indicates if there's an incoming call
  isCaller: boolean;      // Indicates if the current user is the caller
}

// Functional component for rendering call controls
const CallControls: React.FC<CallControlsProps> = ({ call, answerCall, incomingCall, isCaller }) => {
  return (
    <div>
      {/* Call button, disabled if the user is the caller */}
      <button onClick={call} disabled={isCaller}>Call</button>

      {/* Answer button, visible only if there's an incoming call and the user is not the caller */}
      {!isCaller && incomingCall && <button onClick={answerCall}>Answer</button>}
    </div>
  );
};

export default CallControls;
