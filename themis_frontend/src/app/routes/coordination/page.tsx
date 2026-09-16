"use client";

import Coordination from "../../components/feature/coordination/Coordination";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Coordination />
    </ProtectedRoute>
  );
}
