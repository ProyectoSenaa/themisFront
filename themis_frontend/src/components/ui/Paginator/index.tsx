import React from "react";
// Import types
import type { PaginationProps } from "./types";

const Paginator: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  isDarkMode,
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 p-6 ${isDarkMode ? "border-slate-600" : "border-gray-200"} border-opacity-20 border-t`}
    >
      <div
        className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
      >
        Página <span className="font-bold text-green-500">{page}</span> de{" "}
        <span className="font-bold text-green-500">{totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
            isDarkMode
              ? "border border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
              : "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          }`}
        >
          <span>Anterior</span>
        </button>
        <div
          className={`rounded-lg px-4 py-2 text-sm font-bold shadow-sm ${
            isDarkMode
              ? "border border-green-500 bg-green-600 text-white"
              : "border border-green-400 bg-green-500 text-white"
          }`}
        >
          {page} / {totalPages}
        </div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
            isDarkMode
              ? "border border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
              : "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          }`}
        >
          <span>Siguiente</span>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
