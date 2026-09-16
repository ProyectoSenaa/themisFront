"use client";

export const dynamic = 'force-dynamic';

import Profile from "../../components/feature/profile/Profile";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
