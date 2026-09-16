'use client'

import React, { useRef } from "react";

interface CoordinationFilterProps {
  filterOption: string;
  searchQuery: string;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function CoordinationFilter({
  filterOption,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClear,
}: CoordinationFilterProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-[93%] mt-8 ml-14 p-2.5 border border-gray-300 rounded-lg shadow-lg flex items-center font-inter">
      <select
        ref={selectRef}
        value={filterOption}
        onChange={onFilterChange}
        className="w-[20%] h-10 p-2.5 text-lg border-none rounded-lg shadow-lg mr-4"
      >
        <option value="" disabled>Seleccionar filtro</option>
        <option value="id">Centro</option>
        <option value="date">Coordinación</option>
        <option value="numberSheet">Coordinador</option>
        <option value="nameApprentice">Correo Electrónico</option>
        <option value="numberDocument">Rol</option>
      </select>
      <input
        ref={inputRef}
        type="search"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={onSearchChange}
        className="w-[1290px] h-10 p-2.5 text-lg border-none rounded-lg shadow-lg"
      />
      <button type="submit" className="w-[10%] h-10 p-1.5 text-lg border-none rounded-lg bg-[#00324D] text-white cursor-pointer transition-shadow hover:bg-gray-300 hover:text-black ml-2">
        Buscar
      </button>
      <button
        type="button"
        className="w-[10%] h-10 p-1.5 text-lg border-none rounded-lg bg-gray-300 text-white cursor-pointer transition-shadow hover:bg-[#00324D] hover:text-white ml-2"
        onClick={onClear}
      >
        Limpiar
      </button>
    </div>
  );
}
