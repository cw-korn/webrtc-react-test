import React from 'react';

// Component props interface defining expected functions for call controls
interface CallControlsProps {
  call: () => void;       // Function to initiate a call
  answerCall: () => void; // Function to answer a call
}

// Functional component for rendering call control buttons
const CallControls: React.FC<CallControlsProps> = ({ call, answerCall }) => {
  return (
    <div>
      <button onClick={call}>Call</button>       {/* Button to initiate a call */}
      <button onClick={answerCall}>Answer</button> {/* Button to answer a call */}
    </div>
  );
};

export default CallControls;
