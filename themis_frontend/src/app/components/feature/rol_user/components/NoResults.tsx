'use client'

import React from "react";

interface NoResultsProps {
  searchQuery: string;
  filterOption: string;
}

export default function NoResults({ searchQuery, filterOption }: NoResultsProps) {
  return (
    <div className="w-[93%] mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
      <p className="text-yellow-700">
        No se encontraron resultados para &quot;{searchQuery}&quot; en {filterOption}
      </p>
    </div>
  );
}
