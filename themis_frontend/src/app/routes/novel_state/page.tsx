"use client";

import NovelState from "../../components/feature/novelties/state/NovelState";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <NovelState />
    </ProtectedRoute>
  );
}
