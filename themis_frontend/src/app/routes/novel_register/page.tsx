
"use client";

import React, { Suspense } from "react";
import LoadingBar from "../../components/LoadingBar";
import NoveltyForm from "../../components/NoveltyForm";
import ProtectedRoute from "@/app/components/ProtectedRoute";

function NoveltyFormWrapper() {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const noveltyType = searchParams.get("type") || "";
  
  return <NoveltyForm noveltyType={noveltyType} />;
}

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center flex-wrap mt-5">
        <Suspense fallback={<LoadingBar />}>
          <NoveltyFormWrapper />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}