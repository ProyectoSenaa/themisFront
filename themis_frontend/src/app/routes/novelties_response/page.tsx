"use client";

import NoveltiesResponse from "../../components/feature/novelties/response/NoveltiesResponse";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <NoveltiesResponse />
    </ProtectedRoute>
  );
}
