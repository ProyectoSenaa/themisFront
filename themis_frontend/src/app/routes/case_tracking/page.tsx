"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense } from "react";
import LoadingBar from "../../components/LoadingBar";
import CaseTracking from "../../components/feature/case_tracking/CaseTracking";
import ProtectedRoute from "@/app/components/ProtectedRoute";
export default function Page() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center">

                <Suspense fallback={<LoadingBar />}>
                    <CaseTracking />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
}
