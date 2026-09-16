import React from 'react';
import DisintegrateLogo from './DisintegrateLogo';

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen = ({ message }: LoadingScreenProps) => (
    <div className="flex justify-center items-center h-screen w-full bg-white dark:bg-gray-900">
        <div className="text-center">
            <DisintegrateLogo />
            {message && (
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    </div>
);

export default LoadingScreen;
