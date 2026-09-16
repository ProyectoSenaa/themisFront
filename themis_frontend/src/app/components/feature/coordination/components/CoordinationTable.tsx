'use client'

import React from "react";
import Image from "next/image";

interface Coordination {
  center: string;
  coordination: string;
  coordinator: string;
  email: string;
  rol: string;
}

interface CoordinationTableProps {
  data: Coordination[];
}

export default function CoordinationTable({ data }: CoordinationTableProps) {
  return (
    <div className="flex justify-center font-inter mt-14">
      <div className="overflow-x-auto ">
        <table className="w-[1500px] h-[500px] bg-white border border-gray-300 shadow-lg">
          <thead>
            <tr>
              <th
                className="px-6 py-3 bg-gray-100 text-center text-100px font-semibold uppercase tracking-wider"
                style={{ color: "#00304d" }}
              >
                Centro
              </th>
              <th
                className="px-6 py-3 bg-gray-100 text-center text-100px font-semibold uppercase tracking-wider"
                style={{ color: "#00304d" }}
              >
                Coordinación
              </th>
              <th
                className="px-6 py-3 bg-gray-100 text-center text-100px font-semibold uppercase tracking-wider"
                style={{ color: "#00304d" }}
              >
                Coordinador
              </th>
              <th
                className="px-6 py-3 bg-gray-100 text-center text-100px font-semibold uppercase tracking-wider"
                style={{ color: "#00304d" }}
              >
                Correo Electrónico
              </th>
              <th
                className="px-6 py-3 bg-gray-100 text-center text-100px font-semibold uppercase tracking-wider"
                style={{ color: "#00304d" }}
              >
                Rol
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td
                  className="px-6 py-4 bg-white text-center"
                  style={{ color: "#00304d" }}
                >
                  {user.center}
                </td>
                <td
                  className="px-6 py-4 bg-white text-center"
                  style={{ color: "#00304d" }}
                >
                  {user.coordination}
                </td>
                <td
                  className="px-7 py-4 bg-white text-center"
                  style={{ color: "#00304d" }}
                >
                  {user.coordinator}
                </td>
                <td
                  className="px-7 py-4 bg-white text-center"
                  style={{ color: "#00304d" }}
                >
                  {user.email}
                </td>
                <td
                  className="px-7 py-4 bg-white text-center"
                  style={{ color: "#00304d" }}
                >
                  {user.rol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4 ">
          <button
            className="text-[#00304d] rounded px-5 py-2.5 flex items-center mr-2 transition-colors duration-300 hover:bg-[#e8e8e8]"
          >
            <Image
              src="/icons/left.svg"
              width={18}
              height={30}
              alt="Previous"
            />
            <span className="ml-4">Anterior</span>
          </button>

          <button
            className="text-[#00304d] rounded px-5 py-2.5 flex items-center ml-2 transition-colors duration-300 hover:bg-[#e8e8e8]"
          >
            <span className="mr-4">Siguiente</span>
            <Image
              src="/icons/right.svg"
              width={18}
              height={30}
              alt="next"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
