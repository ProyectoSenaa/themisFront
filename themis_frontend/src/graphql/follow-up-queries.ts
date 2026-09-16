import { gql } from "@apollo/client"

// Query para obtener todos los follow-ups (casos)
export const GET_ALL_FOLLOW_UPS = gql`
  query GetAllFollowUps($page: Int!, $size: Int!) {
    allFollowUps(page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        isActive
        studySheetId
        followUpType {
          id
          name
        }
        followUpStatus {
          id
          name
        }
        followUpFlowStatus {
          id
          name
        }
        student {
          id
          person {
             id
             document
             name
             lastname
              phone
             email
           address
          }
        }
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }

`

// Query para obtener tipos de seguimiento
export const GET_FOLLOW_UP_TYPES = gql`
  query GetFollowUpTypes($page: Int!, $size: Int!) {
    allFollowUpTypes(page: $page, size: $size) {
      data {
        id
        name
        description
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }
`

// Query para obtener estados de seguimiento
export const GET_FOLLOW_UP_STATUSES = gql`
  query GetFollowUpStatuses($page: Int!, $size: Int!) {
    allFollowUpStatuses(page: $page, size: $size) {
      data {
        id
        name
        description
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }
`

// Query para obtener estados de flujo de seguimiento
export const GET_FOLLOW_UP_FLOW_STATUSES = gql`
  query GetFollowUpFlowStatuses($page: Int!, $size: Int!) {
    allFollowUpFlowStatuses(page: $page, size: $size) {
      data {
        id
        name
        description
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }
`

// Query para obtener un follow-up por ID
export const GET_FOLLOW_UP_BY_ID = gql`
  query GetFollowUpById($id: ID!) {
    followUpById(id: $id) {
      id
      creationDate
      caseDescription
      evidenceFiles
      isActive
      studySheetId
      followUpType {
        id
        name
      }
      followUpStatus {
        id
        name
      }
      followUpFlowStatus {
        id
        name
      }
    }
  }
`

export const ADD_FOLLOW_UP = gql`
  mutation AddFollowUp($input: FollowUpDto!) {
    addFollowUp(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_FOLLOW_UP = gql`
  mutation UpdateFollowUp($id: ID!, $input: FollowUpDto!) {
    updateFollowUp(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_FOLLOW_UP = gql`
  mutation DeleteFollowUp($id: ID!) {
    deleteFollowUp(id: $id) {
      code
      message
    }
  }
`;

// Query para obtener follow-ups por estudiante
export const GET_FOLLOW_UPS_BY_STUDENT = gql`
  query GetFollowUpsByStudent($studentId: ID!, $page: Int!, $size: Int!) {
    followUpsByStudent(studentId: $studentId, page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        improvementPlanFiles
        isActive
        studySheetId
        followUpType {
          id
          name
        }
        followUpStatus {
          id
          name
        }
        followUpFlowStatus {
          id
          name
        }
        student {
          id
          person {
            id
            name
            lastname
          }
        }
        teacher {
          id
        }
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }
`;

// Query para obtener follow-ups por instructor
export const GET_FOLLOW_UPS_BY_TEACHER = gql`
  query GetFollowUpsByTeacher($teacherId: ID!, $page: Int!, $size: Int!) {
    followUpsByTeacher(teacherId: $teacherId, page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        improvementPlanFiles
        isActive
        studySheetId
        followUpType {
          id
          name
        }
        followUpStatus {
          id
          name
        }
        followUpFlowStatus {
          id
          name
        }
        student {
          id
          person {
            id
            name
            lastname
          }
        }
        teacher {
          id
        }
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }
`;

// Query para obtener follow-ups por coordinador
export const GET_FOLLOW_UPS_BY_COORDINATOR = gql`
  query GetFollowUpsByCoordinator($coordinatorId: ID!, $page: Int!, $size: Int!) {
    followUpsByCoordinator(coordinatorId: $coordinatorId, page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        improvementPlanFiles
        isActive
        studySheetId
        followUpType {
          id
          name
        }
        followUpStatus {
          id
          name
        }
        followUpFlowStatus {
          id
          name
        }
        student {
          id
          person {
            id
            name
            lastname
          }
        }
        teacher {
          id
        }
      }
      totalItems
      totalPages
      currentPage
      code
      message
    }
  }
`;

// Query para obtener planes de mejora
export const GET_ALL_PLANS_IMPROVE = gql`
  query GetAllImprovementPlans($page: Int, $size: Int) {
    allImprovementPlans(page: $page, size: $size) {
      code
      message
      date
      totalPages
      totalItems
      currentPage
      data {
        id
        actNumber
        city
        date
        startTime
        endTime
        place
        reason
        objectives
        state
        conclusions
        qualification
        improvementPlanFile
        student {
          id
          person {
            name
            lastname
          }
        }
        teacherCompetence {
          id
          competence {
            id
            name
          }
          teacher {
            id
            collaborator {
              person {
                name
                lastname
              }
            }
          }
        }
        learningOutcome {
          id
        }
        faultType {
          id
          name
        }
      }
    }
  }
`;