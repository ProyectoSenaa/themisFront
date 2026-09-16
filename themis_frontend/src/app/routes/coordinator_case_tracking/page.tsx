"use client";

export const dynamic = 'force-dynamic';

import CoordinatorCaseTracking from "@/app/components/feature/coordinator_case_tracking/CoordinatorCaseTracking";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function CoordinatorCaseTrackingPage() {
  return (
    <ProtectedRoute>
      <CoordinatorCaseTracking />
    </ProtectedRoute>
  );
}
