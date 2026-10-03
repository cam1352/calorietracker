import React from 'react';

export function Toast({ message, isVisible }: { message: string, isVisible: boolean }) {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity duration-300">
      {message}
    </div>
  );
}
