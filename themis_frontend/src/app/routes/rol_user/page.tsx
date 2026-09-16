"use client";
import RolUser from "../../components/feature/rol_user/RolUser";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <RolUser />
    </ProtectedRoute>
  );
}
