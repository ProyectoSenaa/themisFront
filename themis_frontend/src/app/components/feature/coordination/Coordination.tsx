"use client";

import React, { useState, useMemo } from "react";
import CoordinationFilter from "./components/CoordinationFilter";
import CoordinationTable from "./components/CoordinationTable";

export default function Coordination() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const handleClear = () => {
    setSearchQuery("");
    setFilterOption("");
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
    setSearchQuery("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (filterOption) {
      setSearchQuery(event.target.value);
    }
  };

  const data = [
    {
      center: "Centro De Servicios Financieros",
      coordination: "Coordinación de Formacion Integral",
      coordinator: "María Nancy Azuncena Pérez Lizarazo",
      email: "naperez@example.com",
      rol: "Administrador",
    },
    {
      center: "Centro De Servicios Financieros",
      coordination: "Coordinación Gestión Financiera y Administrativa",
      coordinator: "Soraya Mendoza Tarazona",
      email: "smendozat@example.com",
      rol: "Administrador",
    },
    {
      center: "Centro De Servicios Financieros",
      coordination: "Coordinación de Contabilidad y Finanzas",
      coordinator: "Elvia Zoraida Martin Mora",
      email: "olaveg@example.com",
      rol: "Administrador",
    },
    {
      center: "Centro De Servicios Financieros",
      coordination: "Coordinación de Articulación con la Educación Media",
      coordinator: "Hector Gonzalo Romero Rey",
      email: "hgromero@example.com",
      rol: "Administrador",
    },
    {
      center: "Centro De Servicios Financieros",
      coordination: "Coordinación Académica Formación Virtual",
      coordinator: "Juan Camilo Pulgarín Vanegas",
      email: "jpulgarin@example.com",
      rol: "Administrador",
    },
    {
      center: "Centro De Servicios Financieros",
      coordination: "Coordinación de Tecnología e Innovación",
      coordinator: "Giovanni Agudelo Fique",
      email: "gagudelof@example.com",
      rol: "Administrador",
    },
  ];

  const filteredData = useMemo(() => {
    if (!filterOption || !searchQuery.trim()) {
      return data;
    }
    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      switch (filterOption) {
        case "id":
          return item.center.toLowerCase().includes(query);
        case "date":
          return item.coordination.toLowerCase().includes(query);
        case "numberSheet":
          return item.coordinator.toLowerCase().includes(query);
        case "nameApprentice":
          return item.email.toLowerCase().includes(query);
        case "numberDocument":
          return item.rol.toLowerCase().includes(query);
        default:
          return true;
      }
    });
  }, [searchQuery, filterOption, data]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center flex-wrap mt-12">
        <h1
          className="text-4xl font-inter font-medium text-gray-800 tracking-normal uppercase mb-1"
          style={{ color: "#00304d" }}
        >
          Tabla de Coordinaciones
        </h1>
      </div>
      <CoordinationFilter
        filterOption={filterOption}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onClear={handleClear}
      />
      <CoordinationTable data={filteredData} />
    </div>
  );
}
