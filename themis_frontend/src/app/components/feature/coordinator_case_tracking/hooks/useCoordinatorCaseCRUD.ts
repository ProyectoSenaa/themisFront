import { useMutation } from "@apollo/client"
import { 
  ADD_FOLLOW_UP, 
  UPDATE_FOLLOW_UP, 
  DELETE_FOLLOW_UP 
} from "@/app/graphqlServices/followUpGraphql"
import { FollowUpInput, FollowUpUpdateInput } from "@/app/interfaces/followUp"
import AuthService from "@/app/service/AuthService"

export const useCoordinatorCaseCRUD = (refetchFollowUps: () => void) => {
  const [addFollowUp] = useMutation(ADD_FOLLOW_UP)
  const [updateFollowUp] = useMutation(UPDATE_FOLLOW_UP)
  const [deleteFollowUp] = useMutation(DELETE_FOLLOW_UP)

  const getCurrentCoordinatorId = (): string => {
    const user = AuthService.getUser()
    return user?.fk_id_person?.id?.toString() || "1"
  }

  const createCase = async (
    followUpInput: FollowUpInput
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await addFollowUp({
        variables: { input: followUpInput }
      })

      if (result.data?.addFollowUp?.code === "200") {
        refetchFollowUps()
        return { success: true, message: "Caso creado exitosamente" }
      } else {
        return { 
          success: false, 
          message: result.data?.addFollowUp?.message || "Error desconocido" 
        }
      }
    } catch (error: any) {
      console.error("Error creating case:", error)
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  const updateCase = async (
    caseId: string,
    followUpInput: FollowUpInput | FollowUpUpdateInput
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await updateFollowUp({
        variables: { id: caseId, input: followUpInput }
      })

      const updated = result.data?.updateFollowUp
      if (updated && (updated.id || updated.code === "200")) {
        refetchFollowUps()
        return { success: true, message: "Caso actualizado exitosamente" }
      } else {
        return { 
          success: false, 
          message: (updated && (updated.message || updated.code)) || "Error desconocido" 
        }
      }
    } catch (error: any) {
      console.error("Error updating case:", error)
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  const deleteCase = async (
    caseId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await deleteFollowUp({
        variables: { id: caseId }
      })

      if (result.data?.deleteFollowUp?.code === "200") {
        refetchFollowUps()
        return { success: true, message: "Caso eliminado exitosamente" }
      } else {
        return { 
          success: false, 
          message: result.data?.deleteFollowUp?.message || "Error desconocido" 
        }
      }
    } catch (error: any) {
      console.error("Error deleting case:", error)
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  const assignCaseToInstructor = async (
    caseItem: any,
    instructorId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const followUpInput: FollowUpUpdateInput = {
        teacherId: instructorId
      }

      const result = await updateFollowUp({
        variables: { id: caseItem.id, input: followUpInput }
      })

      const updated = result.data?.updateFollowUp
      if (updated && (updated.id || updated.code === "200")) {
        refetchFollowUps()
        return { success: true, message: "Caso asignado al instructor exitosamente" }
      } else {
        return { 
          success: false, 
          message: (updated && (updated.message || updated.code)) || "Error desconocido" 
        }
      }
    } catch (error: any) {
      console.error("Error assigning case:", error)
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  const changeStatus = async (
    caseItem: any,
    newStatusId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const followUpInput: FollowUpUpdateInput = {
        followUpStatusId: newStatusId
      }

      const result = await updateFollowUp({
        variables: { id: caseItem.id, input: followUpInput }
      })

      const updated = result.data?.updateFollowUp
      if (updated && (updated.id || updated.code === "200")) {
        refetchFollowUps()
        return { success: true, message: "Estado del caso actualizado exitosamente" }
      } else {
        return { 
          success: false, 
          message: (updated && (updated.message || updated.code)) || "Error desconocido" 
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  const changeFlowStatus = async (
    caseItem: any,
    newFlowStatusId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const followUpInput: FollowUpUpdateInput = {
        followUpFlowStatusId: newFlowStatusId
      }

      const result = await updateFollowUp({
        variables: { id: caseItem.id, input: followUpInput }
      })

      const updated = result.data?.updateFollowUp
      if (updated && (updated.id || updated.code === "200")) {
        refetchFollowUps()
        return { success: true, message: "Estado de flujo actualizado exitosamente" }
      } else {
        return { 
          success: false, 
          message: (updated && (updated.message || updated.code)) || "Error desconocido" 
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  const approveCaseResolution = async (
    caseItem: any,
    approvedStatusId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const followUpInput: FollowUpUpdateInput = {
        followUpStatusId: approvedStatusId
      }

      const result = await updateFollowUp({
        variables: { id: caseItem.id, input: followUpInput }
      })

      const updated = result.data?.updateFollowUp
      if (updated && (updated.id || updated.code === "200")) {
        refetchFollowUps()
        return { success: true, message: "Resolución del caso aprobada exitosamente" }
      } else {
        return { 
          success: false, 
          message: (updated && (updated.message || updated.code)) || "Error desconocido" 
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "Error de conexión" 
      }
    }
  }

  return {
    createCase,
    updateCase,
    deleteCase,
    assignCaseToInstructor,
    changeStatus,
    changeFlowStatus,
    approveCaseResolution,
    getCurrentCoordinatorId
  }
}
