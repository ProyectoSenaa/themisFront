'use client'

import React from "react";

interface FilterInfoProps {
  filterOption: string;
  searchQuery: string;
  filteredDataLength: number;
  totalDataLength: number;
}

export default function FilterInfo({
  filterOption,
  searchQuery,
  filteredDataLength,
  totalDataLength,
}: FilterInfoProps) {
  if (!filterOption) {
    return null;
  }

  return (
    <div className="w-[93%] mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-700 font-medium">
            Filtro activo: {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </span>
          {searchQuery && (
            <span className="text-green-700">
              | Búsqueda: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
        <span className="text-green-700 text-sm">
          {filteredDataLength} de {totalDataLength} resultados
        </span>
      </div>
    </div>
  );
}
