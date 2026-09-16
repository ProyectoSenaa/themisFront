import React from 'react';
import { useAppSelector } from "@/redux/hooks";
import IPaginationProps from '../interfaces/components_interfaces/Pagination/IPaginationProps';

const Pagination: React.FC<IPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const pageRange = 2; // Número de páginas visibles a cada lado de la página actual
  const pages = [];
  let hasAddedEllipsis = false;

  // Función para determinar cuándo mostrar puntos suspensivos
  const showEllipsis = (page: number) => page !== 1 && page !== totalPages && (page < currentPage - pageRange || page > currentPage + pageRange);

  for (let i = 1; i <= totalPages; i++) {
    if (showEllipsis(i)) {
      if (!hasAddedEllipsis) {
        pages.push(
          <span key={`ellipsis-${i}`} className={`mx-1 px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ...
          </span>
        );
        hasAddedEllipsis = true;
      }
    } else {
      hasAddedEllipsis = false;
      pages.push(
        <button
          key={i}
          className={`mx-1 px-3 py-2 rounded-md font-medium transition-colors ${
            i === currentPage
              ? 'bg-green-600 text-white shadow-sm'
              : darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
          onClick={() => onPageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }
  }

  return (
    <div className="flex font-inter justify-center items-center mt-4 gap-1">
      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          currentPage === 1
            ? darkMode
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : darkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      {pages}
      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          currentPage === totalPages
            ? darkMode
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : darkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
