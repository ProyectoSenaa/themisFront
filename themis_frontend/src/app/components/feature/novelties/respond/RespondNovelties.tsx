'use client'
import React, { Suspense } from "react";
import LoadingBar from "../../../LoadingBar";
import FormRespondNovelty from "../../../RespondFormNovelty";
import { useNoveltyResponse } from "./useNoveltyResponse";

export default function RespondNovelties() {
    const { formValues, loading, error } = useNoveltyResponse();

    if (loading) {
        return <LoadingBar />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!formValues || !formValues.id) {
        return null;
    }

    return (
        <div className="flex flex-col items-center pt-20 sm:pt-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mt-5 mb-8 lg:mb-0.5">
                Responder novedad
            </h1>
            <Suspense fallback={<LoadingBar />}>
                <FormRespondNovelty formValues={formValues} />
            </Suspense>
        </div>
    )
}
