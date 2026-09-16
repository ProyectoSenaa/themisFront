"use client";

import React, { Suspense } from "react";
import LoadingBar from "../../components/LoadingBar";
import FeatureCardSA from "../../components/feature/NoveltyType/CardSA/CardSA";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                    Novedades
                </h1>
                <Suspense fallback={<LoadingBar />}>
                    <FeatureCardSA />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
} 