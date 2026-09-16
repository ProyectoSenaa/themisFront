import { useMutation } from "@apollo/client"
import { 
  ADD_FOLLOW_UP, 
  UPDATE_FOLLOW_UP, 
  DELETE_FOLLOW_UP 
} from "@/app/graphqlServices/followUpGraphql"
import { FollowUpInput, FollowUpUpdateInput } from "@/app/interfaces/followUp"
import AuthService from "@/app/service/AuthService"

export const useCaseCRUD = (refetchFollowUps: () => void) => {
  const [addFollowUp] = useMutation(ADD_FOLLOW_UP)
  const [updateFollowUp] = useMutation(UPDATE_FOLLOW_UP)
  const [deleteFollowUp] = useMutation(DELETE_FOLLOW_UP)

  const getCurrentTeacherId = (): string => {
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

      if (result.data?.updateFollowUp?.code === "200") {
        refetchFollowUps()
        return { success: true, message: "Caso actualizado exitosamente" }
      } else {
        return { 
          success: false, 
          message: result.data?.updateFollowUp?.message || "Error desconocido" 
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

  const changeStatusToReview = async (
    caseItem: any,
    reviewStatusId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Solo enviar el campo que realmente necesita ser actualizado
      // Esto evita conflictos de Hibernate al no tocar otros campos
      // Enviar objeto en vez de primitive id: el backend espera FollowUpStatusDto
      const followUpInput: any = {
        followUpStatus: { id: Number(reviewStatusId) }
      }

      console.log('🔄 Sending update request with:', followUpInput)
      console.log('🎯 Case ID:', caseItem.id)
      console.log('🔄 New status ID:', reviewStatusId)

      const result = await updateFollowUp({
        variables: { id: caseItem.id, input: followUpInput }
      })

      if (result.data?.updateFollowUp?.code === "200") {
        refetchFollowUps()
        return { success: true, message: "Caso enviado a revisión exitosamente" }
      } else {
        return { 
          success: false, 
          message: result.data?.updateFollowUp?.message || "Error desconocido" 
        }
      }
    } catch (error: any) {
      console.error("Error changing case status:", error)
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
      const followUpInput: any = {
        followUpStatus: { id: Number(newStatusId) }
      }

      const result = await updateFollowUp({
        variables: { id: caseItem.id, input: followUpInput }
      })

      if (result.data?.updateFollowUp?.code === "200") {
        refetchFollowUps()
        return { success: true, message: "Estado del caso actualizado exitosamente" }
      } else {
        return { 
          success: false, 
          message: result.data?.updateFollowUp?.message || "Error desconocido" 
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
    changeStatusToReview,
    changeStatus,
    getCurrentTeacherId
  }
}