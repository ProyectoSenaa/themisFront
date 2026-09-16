import { gql } from '@apollo/client';

export const GET_NOVELTY = gql`
  query AllNovelties($page: Int = 0, $size: Int = 10) {
    allNovelties(page: $page, size: $size) {
      data {
        id
        date
        observation
        justification
        isActive
        noveltyFiles
        noveltyType {
          id
          nameNovelty
        }
        noveltyStatus {
          id
          name
          description
        }
        processFlowStatus {
          id
          name
          description
        }
        student {
          id
          person {
            id
            name
            lastname
          }
          studentStudySheets {
            studySheet {
              number
              trainingProject {
                program {
                  id
                  name
                }
              }
            }
          }
        }
        teacher {
          id
        }
        administrative {
          id
        }
      }
      code
      message
      currentPage
      totalItems
      totalPages
    }
  }
`;

export const ADD_NOVELTY = gql`
  mutation AddNovelty($input: NoveltyDto) {
    addNovelty(input: $input) {
      id
      code
      message
    }
  }
`;

export const DELETE_NOVELTY = gql`
  mutation DeleteNovelty($id: ID!) {
    deleteNovelty(id: $id) {
      id
      code
      message
    }
  }
`;

export const UPDATE_NOVELTY = gql`
  mutation UpdateNovelty($id: ID!, $input: NoveltyDto) {
    updateNovelty(id: $id, input: $input) {
      id
      code
      message
    }
  }
`;

export const NOVELTY_SUBSCRIPTION = gql`
  subscription OnNoveltyCreated {
    noveltyCreated {
      id
      date
      observation
      noveltyStatus {
        id
        name
        description
      }
      noveltyType {
        id
        nameNovelty
      }
    }
  }
`;

export const GET_NOVELTY_BY_ID = gql`
  query GetNoveltyById($id: ID!) {
    noveltyById(id: $id) {
      id
      date
      observation
      justification
      noveltyFiles
      noveltyType {
        id
        nameNovelty
      }
      noveltyStatus {
        id
        name
        description
      }
      processFlowStatus {
        id
        name
        description
      }
      student {
        id
        person {
          id
          name
          lastname
          document
        }
        studentStudySheets {
          studySheet {
            trainingProject {
              program {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_NOVELTIES_BY_TEACHER = gql`
  query GetNoveltiesByTeacher($teacherId: ID!, $page: Int = 0, $size: Int = 50) {
    allNovelties(page: $page, size: $size) {
      data {
        id
        date
        observation
        justification
        isActive
        noveltyFiles
        noveltyType {
          id
          nameNovelty
        }
        noveltyStatus {
          id
          name
          description
        }
        processFlowStatus {
          id
          name
          description
        }
        student {
          id
          person {
            id
            name
            lastname
            document
          }
          studentStudySheets {
            studySheet {
              number
              trainingProject {
                program {
                  id
                  name
                }
              }
            }
          }
        }
        teacher {
          id
          person {
            id
            name
            lastname
          }
        }
        administrative {
          id
          person {
            id
            name
            lastname
          }
        }
      }
      code
      message
      currentPage
      totalItems
      totalPages
    }
  }
`;
