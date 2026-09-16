import { gql } from '@apollo/client';

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

`;

// Query para obtener un follow-up por ID
export const GET_FOLLOW_UP_BY_ID = gql`
  query GetFollowUpById($id: ID!) {
    followUpById(id: $id) {
      id
      creationDate
      caseDescription
      evidenceFiles
      isActive
      studentId
      teacherId
      coordinatorId
      studySheetId
      followUpTypeId
      followUpStatusId
      followUpFlowStatusId
    }
  }
`;


export const GET_FOLLOW_UPS_BY_STUDENT = gql`
  query GetFollowUpsByStudent($studentId: ID!, $page: Int, $size: Int) {
    followUpsByStudent(studentId: $studentId, page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        isActive
        studentId
        teacherId
        coordinatorId
        studySheetId
        followUpTypeId
        followUpStatusId
        followUpFlowStatusId
      }
      currentPage
      totalItems
      totalPages
      code
      message
    }
  }
`;

// Query para obtener follow-ups por teacher (instructor)
export const GET_FOLLOW_UPS_BY_TEACHER = gql`
  query GetFollowUpsByTeacher($teacherId: ID!, $page: Int, $size: Int) {
    followUpsByTeacher(teacherId: $teacherId, page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        isActive
        studentId
        teacherId
        coordinatorId
        studySheetId
        followUpTypeId
        followUpStatusId
        followUpFlowStatusId
      }
      currentPage
      totalItems
      totalPages
      code
      message
    }
  }
`;

// Query para obtener follow-ups por coordinador
export const GET_FOLLOW_UPS_BY_COORDINATOR = gql`
  query GetFollowUpsByCoordinator($coordinatorId: ID!, $page: Int, $size: Int) {
    followUpsByCoordinator(coordinatorId: $coordinatorId, page: $page, size: $size) {
      data {
        id
        creationDate
        caseDescription
        evidenceFiles
        isActive
        studentId
        teacherId
        coordinatorId
        studySheetId
        followUpTypeId
        followUpStatusId
        followUpFlowStatusId
      }
      currentPage
      totalItems
      totalPages
      code
      message
    }
  }
`;

// Query para obtener el estudiante por ID de persona (para usuarios autenticados como estudiantes)
// Query para obtener el estudiante por ID de persona (para usuarios autenticados como estudiantes)
// export const GET_STUDENT_BY_PERSON_ID = gql`
//   query GetStudentByPersonId($personId: ID!) {
//     studentByPersonId(personId: $personId) {
//       id
//       state
//       person {
//         id
//         name
//         lastname
//         document
//         email
//         phone
//       }
//       studentStudySheets {
//         studySheet {
//           id
//           number
//           trainingProject {
//             program {
//               id
//               name
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// Mutation para crear un nuevo follow-up
export const ADD_FOLLOW_UP = gql`
  mutation AddFollowUp($input: FollowUpDto!) {
    addFollowUp(input: $input) {
      code
      message
    }
  }
`;

// Mutation para actualizar un follow-up
export const UPDATE_FOLLOW_UP = gql`
  mutation UpdateFollowUp($id: ID!, $input: FollowUpDto!) {
    updateFollowUp(id: $id, input: $input) {
      code
      message
    }
  }
`;

// Mutation para eliminar un follow-up
export const DELETE_FOLLOW_UP = gql`
  mutation DeleteFollowUp($id: ID!) {
    deleteFollowUp(id: $id) {
      code
      message
    }
  }
`;
export const GET_ALL_PLANS_IMPROVE = gql`
  query GetAllImprovementPlans(
  $page: Int
  $size: Int
) {
  allImprovementPlans(
    page: $page
    size: $size
  ) {
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
      learningOutcome{
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