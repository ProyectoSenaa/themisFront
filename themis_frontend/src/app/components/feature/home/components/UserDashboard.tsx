'use client'

import React from "react";
import RoleHeader from "./RoleHeader";
import MainContent from "./MainContent";

interface DashboardProps {
  user: any;
}

const UserDashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RoleHeader title="Panel del Aprendiz" />
      <MainContent />
    </div>
  );
};

export default UserDashboard;
