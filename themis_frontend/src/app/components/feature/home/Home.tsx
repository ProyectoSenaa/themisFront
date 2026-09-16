"use client";

import React, { useEffect, useState } from "react";
import AuthService from "../../../service/AuthService";
import { useDispatch } from "react-redux";
import { setTitle } from "@/redux/features/metadataSlice";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import NoAccess from "./components/NoAccess";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Home - Themis SENA"));
    const user = AuthService.getUser();
    setUserData(user);
  }, [dispatch]);

  const userRole = AuthService.getUserRole();

  return (
    <ProtectedRoute>
      <div className="animate-fadeIn min-h-screen">
        {userRole === "admin" && <AdminDashboard user={userData} />}
        {(userRole === "aprendiz" || userRole === "instructor" || userRole === "coordinador") && <UserDashboard user={userData} />}
        {!userRole && <NoAccess />}
      </div>
    </ProtectedRoute>
  );
}
