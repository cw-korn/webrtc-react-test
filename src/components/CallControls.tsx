import React from 'react';

interface CallControlsProps {
  call: () => void;       // Function to initiate a call
  answerCall: () => void; // Function to answer a call
  incomingCall: boolean;  // Indicates if there's an incoming call
  isCaller: boolean;      // Indicates if the current user is the caller
}

const CallControls: React.FC<CallControlsProps> = ({ call, answerCall, incomingCall, isCaller }) => {
  return (
    <div>
      <button onClick={call} disabled={isCaller}>Call</button>
      {!isCaller && incomingCall && <button onClick={answerCall}>Answer</button>}
    </div>
  );
};

export default CallControls;
