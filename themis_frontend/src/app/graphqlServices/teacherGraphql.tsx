const { gql } = require("@apollo/client");

export const GET_TEACHERS = gql`
  query GetTeachers($personName: String, $page: Int, $size: Int) {
    allTeachers(personName: $personName, page: $page, size: $size) {
      date
      code
      message
      data {
        id
        totalHours
        state
        collaborator {
        id
          person {
            name
            lastname
          }
        }
        classTypes {
          id
          name
        }
        coordinations {
          id
          name
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_TEACHER_LIST = gql`
  query GetTeacherList {
    allTeachersList {
      code
      message
      data {
        id
        totalHours
        state
        collaborator {
          person {
            name
            lastname
          }
        }
        classTypes {
          id
          name
        }
        coordinations {
          id
          name
        }
      }
      totalItems
    }
  }
`;