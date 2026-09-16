"use client";

import NovelReport from "../../components/feature/novelties/report/NovelReport";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <NovelReport />
    </ProtectedRoute>
  );
}
