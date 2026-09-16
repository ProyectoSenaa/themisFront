"use client"

import React, { memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "@/components/ui/button"

interface CasePaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  filteredCasesLength: number
  darkMode: boolean
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export const CasePagination = memo<CasePaginationProps>(({
  currentPage,
  totalPages,
  itemsPerPage,
  filteredCasesLength,
  darkMode,
  onPageChange,
  onPreviousPage,
  onNextPage
}) => {
  if (totalPages <= 1) return null

  return (
    <>
      {/* Items per page info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Mostrando {itemsPerPage} casos por página
          </span>
        </div>
        <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCasesLength)} de {filteredCasesLength} casos
        </div>
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
              className="w-10 h-10 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </>
  )
})

CasePagination.displayName = "CasePagination"
