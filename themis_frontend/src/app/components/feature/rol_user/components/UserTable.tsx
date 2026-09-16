'use client'

import React from "react";
import BaseTable from "@/components/ui/Table/BaseTable";
import { Student } from "@/redux/features/studentSlice";

interface Column {
  key: string;
  header: string;
  render?: (row: Student) => React.ReactNode;
}

interface UserTableProps {
  columns: Column[];
  data: Student[];
  onAddClick: () => void;
  isDarkMode?: boolean;
}


export default function UserTable({ columns, data, onAddClick, isDarkMode }: UserTableProps) {
  // Clases condicionales para el contenedor principal
  const containerClass = `w-[93%] mt-10 rounded-3xl border shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ` +
    (isDarkMode
      ? 'bg-[#181C23] border-[#232A36]'
      : 'bg-white border-gray-200');

  return (
    <div className={containerClass}>
      <BaseTable
        columns={columns}
        data={data}
        onAddClick={onAddClick}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
