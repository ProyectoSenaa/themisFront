"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense } from "react";
import LoadingBar from "../../components/LoadingBar";
import StudentCaseTracking from "@/app/components/feature/student_case_tracking/StudentCaseTracking";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                    Mis Casos de Seguimiento
                </h1>
                <Suspense fallback={<LoadingBar />}>
                    <StudentCaseTracking />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
}
