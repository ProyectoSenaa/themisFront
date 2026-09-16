'use client';

import React, { Suspense, useState } from "react";
import LoadingBar from "../../LoadingBar";
import ConfigProfile from "../../ConfigProfile";

export default function Profile() {
    const [isConfigProfileOpen, setIsConfigProfileOpen] = useState(false);

    const handleConfigProfileOpen = () => {
        setIsConfigProfileOpen(true);
    };

    const handleConfigProfileClose = () => {
        setIsConfigProfileOpen(false);
    };

    return (
        <div className="flex justify-center items-center flex-wrap pt-20 sm:pt-6">
            <Suspense fallback={<LoadingBar />}>
                <ConfigProfile
                    open={isConfigProfileOpen}
                    onClose={handleConfigProfileClose}
                />
            </Suspense>
        </div>
    );
}
