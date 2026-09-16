"use client";

import RespondNovelties from "../../components/feature/novelties/respond/RespondNovelties";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <RespondNovelties />
    </ProtectedRoute>
  );
}
