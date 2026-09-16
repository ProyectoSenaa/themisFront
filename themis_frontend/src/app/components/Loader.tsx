"use client";

import React from 'react';
import Image from 'next/image';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md">

            {/* Main content container */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Minimal logo container */}
                <div className="relative mb-8">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>

                    {/* Logo */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <Image
                            src="/img/logoThemis.svg"
                            alt="Themis Logo"
                            width={96}
                            height={96}
                            className="w-full h-full opacity-90 animate-pulse"
                        />
                    </div>
                </div>

                {/* Minimal title section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-light text-black mb-4 tracking-wide">
                        Themis
                    </h2>

                    {/* Simple loading dots */}
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                </div>

                {/* Minimal progress indicator */}
                <div className="w-48 h-px bg-black/20 mb-6 overflow-hidden">
                    <div className="h-full bg-black/40 animate-progress"></div>
                </div>

                {/* Minimal inspirational message */}
                <div className="text-center">
                    <p className="text-black/70 text-sm font-light tracking-wide">
                        &quot;Justicia y Eficiencia para todos&quot;
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); width: 0%; }
                    50% { width: 100%; }
                    100% { transform: translateX(100%); width: 100%; }
                }
                
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
            `}</style>
        </div >
    );
};

export default Loader;