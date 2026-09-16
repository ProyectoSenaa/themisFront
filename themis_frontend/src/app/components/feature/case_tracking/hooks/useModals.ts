import { useState, useCallback } from "react"
import type { CaseItem } from "../types"

export const useModals = () => {
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  const openDetailModal = useCallback((caseItem: CaseItem) => {
    setSelectedCase(caseItem)
    setIsDetailModalOpen(true)
  }, [])

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false)
    setSelectedCase(null)
  }, [])

  const openEditModal = useCallback((caseItem: CaseItem) => {
    setSelectedCase(caseItem)
    setIsEditModalOpen(true)
  }, [])

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedCase(null)
  }, [])

  const switchFromDetailToEdit = useCallback((caseItem: CaseItem) => {
    setIsDetailModalOpen(false)
    setSelectedCase(caseItem)
    setIsEditModalOpen(true)
  }, [])

  return {
    // State
    selectedCase,
    isCreateModalOpen,
    isDetailModalOpen,
    isEditModalOpen,
    
    // Actions
    openCreateModal,
    closeCreateModal,
    openDetailModal,
    closeDetailModal,
    openEditModal,
    closeEditModal,
    switchFromDetailToEdit,
    setSelectedCase,
  }
}
