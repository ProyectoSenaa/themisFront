'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen px-4">
      {/* Contenedor de la barra de carga más larga */}
      <div className="w-[90%] max-w-[800px] h-[30px] rounded-full border border-black mb-2 bg-white relative overflow-hidden dark:bg-gray-800">
        <div
          className="h-full bg-[#3498db] transition-all duration-200 flex items-center justify-center text-white font-bold rounded-full"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
}
