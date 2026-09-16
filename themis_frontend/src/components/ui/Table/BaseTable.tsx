import React, { useState, useMemo, useEffect } from "react";
import type { DataTableProps } from "./types";
import { Search, Plus, Frown } from "lucide-react";
import Paginator from "../Paginator";
import type { PaginationProps } from "../Paginator/types";

function DataTable<T extends object>({
  columns,
  data,
  isDarkMode = false,
  pageSize = 5,
  filterPlaceholder = "Buscar...",
  filterFunction,
  className = "",
  onAddClick,
  paginator = Paginator,
  onSearchChange,
  onRowClick,
}: DataTableProps<T> & {
  onAddClick?: () => void;
  paginator?: React.FC<PaginationProps>;
  onSearchChange?: (search: string) => void;
  onRowClick?: (row: T) => void;
}) {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Si hay búsqueda remota, no filtrar localmente
  const filteredData = useMemo(() => {
    if (onSearchChange) return data;
    if (!filter) return data;
    if (filterFunction)
      return data.filter((row) => filterFunction(row, filter));
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase()),
      ),
    );
  }, [data, filter, filterFunction, onSearchChange]);

  // Si hay búsqueda remota, paginación la controla el padre
  const totalPages = onSearchChange
    ? Math.ceil(data.length / pageSize) || 1
    : Math.ceil(filteredData.length / pageSize) || 1;

  const paginatedData = useMemo(
    () =>
      onSearchChange
        ? data
        : filteredData.slice((page - 1) * pageSize, page * pageSize),
    [filteredData, page, pageSize, data, onSearchChange],
  );

  // Si se pasa onSearchChange, hacer debounce y llamar al padre
  useEffect(() => {
    if (!onSearchChange) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(filter);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filter, onSearchChange]);

  useEffect(() => setPage(1), [filter, data]);

  // Colores más notorios para dark y light mode
  const containerClasses = isDarkMode
    ? "bg-[#181C23] border-[#232A36]"
    : "bg-white border-gray-200";

  const searchClasses = isDarkMode
    ? "border-slate-600 bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
    : "border-gray-300 bg-white/80 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20";

  const headerClasses = isDarkMode
    ? "bg-[#232A36] text-slate-200 border-[#232A36]"
    : "bg-gray-100 text-gray-700 border-gray-200";

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div
      className={`w-full rounded-3xl border shadow-xl transition-all duration-500 hover:shadow-2xl ${containerClasses} ${className}`}
    >
      {/* Filtro y botón de acción */}
      <div className="border-opacity-20 p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className={`absolute top-1/2 left-3 z-20 h-5 w-5 -translate-y-1/2 transform transition-colors duration-200 ${isDarkMode ? "text-slate-400 hover:text-slate-300" : "text-gray-400 hover:text-gray-500"}`}
            />
            <input
              type="text"
              className={`w-full rounded-xl border py-3 pr-4 pl-11 backdrop-blur-sm transition-all duration-300 outline-none focus:ring-2 ${searchClasses}`}
              placeholder={filterPlaceholder}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          {/* Botón para agregar, visible si se pasa prop onAddClick */}
          {typeof onAddClick === "function" && (
            <div>
              <button
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={onAddClick}
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className={`border-y ${headerClasses}`}>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`px-8 py-4 text-center text-sm font-bold tracking-wider uppercase transition-colors duration-200 ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-opacity-10 divide-y">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={`px-6 py-12 text-center ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Frown
                        className={`h-12 w-12 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
                      />
                      <span className="text-sm font-medium">
                        No se encontraron resultados
                      </span>
                      <span className="text-xs opacity-60">
                        Intenta con otros términos de búsqueda
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-all duration-200 hover:scale-[1.01] hover:transform ${isDarkMode ? "border-slate-700/30 hover:bg-slate-700/30" : "border-gray-100 hover:bg-blue-50/50"} ${typeof onRowClick === "function" ? "cursor-pointer" : ""}`}
                    onClick={
                      typeof onRowClick === "function"
                        ? () => onRowClick(row)
                        : undefined
                    }
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={`px-6 py-4 text-center ${isDarkMode ? "text-slate-200" : "text-gray-700"} ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.key as keyof T])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 0 &&
        paginator &&
        React.createElement(paginator, {
          page,
          totalPages,
          onPageChange: handlePageChange,
          isDarkMode,
        })}
    </div>
  );
}

export default DataTable;