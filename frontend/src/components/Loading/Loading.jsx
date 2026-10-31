import React from 'react';
import './Loading.css';
import { Sprout } from 'lucide-react';

export const Loading = ({ fullScreen = false, message = "Loading agricultural data..." }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'loading-fullscreen' : ''}`}>
      <div className="relative flex items-center justify-center">
        <div className="leaf-spinner"></div>
        <Sprout className="absolute text-[#1E4D2B] animate-pulse" size={22} />
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
