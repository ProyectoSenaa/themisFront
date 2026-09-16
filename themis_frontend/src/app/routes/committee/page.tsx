"use client"

export const dynamic = 'force-dynamic';

import CommitteeManagement from "@/app/components/committee-management-new";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <CommitteeManagement />
    </ProtectedRoute>
  );
}

