import { gql } from '@apollo/client';

export const FOLLOW_UP_BY_ID = gql`
  query FollowUpById($id: ID!) {
    followUpById(id: $id) {
      id
      creationDate
      caseDescription
      isActive
    }
  }
`;

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

export const ALL_COMMITTEE_EVENTS = gql`
  query AllCommitteeEvents($page: Int, $size: Int) {
    allCommitteeEvents(page: $page, size: $size) {
      data {
        id
        date
        hour
        session
        coordinationName
        finishedAt
        committee {
          id
          coordination {
            id
            name
          }
          students {
            id
            person {
              id
              name
              lastname
            }
          }
          teachers {
            id
            collaborator { person { name lastname } }
          }
        }
        minutes {
          id
          fileContent
        }
      }
      currentPage
      totalItems
      totalPages
    }
  }
`;

export const COMMITTEE_EVENT_BY_ID = gql`
  query CommitteeEventById($id: ID!) {
    committeeEventById(id: $id) {
      id
      date
      hour
      session
      coordinationName
      committee {
        id
        coordination {
          id
          name
        }
      }
      minutes {
        id
        fileContent
      }
    }
  }
`;

export const ADD_COMMITTEE_EVENT = gql`
  mutation AddCommitteeEvent($input: CommitteeEventDto!) {
    addCommitteeEvent(input: $input) {
      code
      message
    }
  }
`;

export const ADD_COMMITTEE_EVENTS_BULK = gql`
  mutation AddCommitteeEventsBulk($input: [CommitteeEventDto!]) {
    addCommitteeEventsBulk(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_COMMITTEE_EVENTS_BULK = gql`
  mutation UpdateCommitteeEventsBulk($input: [CommitteeEventDto!]!) {
    updateCommitteeEventsBulk(input: $input) {
      code
      message
      data
    }
  }
`;

export const UPDATE_COMMITTEE_EVENT = gql`
  mutation UpdateCommitteeEvent($id: ID!, $input: CommitteeEventDto!) {
    updateCommitteeEvent(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_COMMITTEE_EVENT = gql`
  mutation DeleteCommitteeEvent($id: ID!) {
    deleteCommitteeEvent(id: $id) {
      code
      message
    }
  }
`;

export const ALL_MINUTES = gql`
  query AllMinutes($page: Int, $size: Int) {
    allMinutes(page: $page, size: $size) {
      data {
        id
        fileContent
        committeeEventId
      }
      currentPage
      totalItems
      totalPages
    }
  }
`;

export const MINUTE_BY_ID = gql`
  query MinuteById($id: ID!) {
    minuteById(id: $id) {
      id
      fileContent
      committeeEventId
    }
  }
`;

export const MINUTE_BY_COMMITTEE_EVENT_ID = gql`
  query MinuteByCommitteeEventId($committeeEventId: ID!) {
    minuteByCommitteeEventId(committeeEventId: $committeeEventId) {
      id
      fileContent
      committeeEventId
    }
  }
`;

export const ADD_MINUTE = gql`
  mutation AddMinute($input: MinuteDto!) {
    addMinute(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_MINUTE = gql`
  mutation UpdateMinute($id: ID!, $input: MinuteDto!) {
    updateMinute(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_MINUTE = gql`
  mutation DeleteMinute($id: ID!) {
    deleteMinute(id: $id) {
      code
      message
    }
  }
`;

export const UPLOAD_FINAL_MINUTE = gql`
  mutation SaveFinalMinute($committeeEventId: ID!, $fileContent: String!) {
    saveFinalMinute(committeeEventId: $committeeEventId, fileContent: $fileContent) {
      id
      fileContent
      committeeEventId
    }
  }
`;

export const GENERATE_MINUTE_DOCX = gql`
  query GenerateMinuteDocx($committeeEventId: ID!) {
    generateMinuteDocx(committeeEventId: $committeeEventId)
  }
`;

export const GENERATE_MINUTE_DOCX_URL = gql`
  query GenerateMinuteDocxUrl($committeeEventId: ID!) {
    generateMinuteDocxUrl(committeeEventId: $committeeEventId)
  }
`;

export const MINUTE_FILE_BASE64 = gql`
  query MinuteFileBase64($filename: String!) {
    minuteFileBase64(filename: $filename)
  }
`;

export const ASSIGN_COMMITTEE_TO_EVENTS = gql`
  mutation AssignCommitteeToEvents($committeeId: ID!, $eventIds: [ID!]!) {
    assignCommitteeToEvents(committeeId: $committeeId, eventIds: $eventIds) {
      code
      message
    }
  }
`;


export const RESPOND_NOVELTIES_FROM_COMMITTEE = gql`
  mutation RespondNoveltiesFromCommittee($committeeId: Long!, $responses: [CommitteeNoveltyResponseInput!]!) {
    respondNoveltiesFromCommittee(committeeId: $committeeId, responses: $responses) {
      code
      message
    }
  }
`;

export const RESPOND_NOVELTIES_FROM_COMMITTEE_OBS = gql`
  mutation RespondNoveltiesFromCommitteeObs($committeeId: Long!, $responses: [CommitteeNoveltyObservationInput!]!) {
    respondNoveltiesFromCommittee(committeeId: $committeeId, responses: $responses) {
      code
      message
    }
  }
`;


export const FINALIZE_COMMITTEE_EVENT = gql`
  mutation FinalizeCommitteeEvent($eventId: ID!, $responses: [CommitteeNoveltyObservationInput!]!) {
    finalizeCommitteeEvent(eventId: $eventId, responses: $responses) {
      code
      message
    }
  }
`;

export const FINALIZE_COMMITTEE_EVENT_ONLY = gql`
  mutation FinalizeCommitteeEventOnly($eventId: ID!) {
    finalizeCommitteeEventOnly(eventId: $eventId) {
      code
      message
    
    }
  }
`;


export const ALL_COMMITTEES = gql`
  query AllCommittees($page: Int, $size: Int) {
    allCommittees(page: $page, size: $size) {
      data {
        id
        isCurrent
        isActive
        committeeEvents {
          id
          date
          hour
          session
        }
      }
      currentPage
      totalItems
      totalPages
    }
  }
`;

export const COMMITTEES_BY_STUDENT_ID = gql`
  query CommitteesByStudentId($studentId: Long!) {
    committeesByStudentId(studentId: $studentId) {
      data {
        id
        coordination {
          id
          name
        }
        isCurrent
        isActive
        committeeEvents {
          id
          date
          hour
          session
          coordinationName
          finishedAt
          minutes {
            id
            fileContent
          }
        }
        teachers {
          id
          collaborator {
            person {
              name
              lastname
            }
          }
        }
      }
      code
      message
    }
  }
`;




export const ALL_COORDINATION = gql`
  query AllCoordination($page: Int, $size: Int, $state: Boolean) {
    allCoordination(page: $page, size: $size, state: $state) {
      data {
        id
        name
        state
        createdAt
        updatedAt
        trainingCenter {
          id
          name
        }
        teachers {
          id
          collaborator {
            person {
              name
              lastname
            }
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


export const ALL_ADMINISTRATIVES = gql`
  query AllAdministratives($page: Int, $size: Int) {
    allAdministratives(page: $page, size: $size) {
      data {
        id
        person {
          id
          name
          lastname
        }
        state
        createdAt
        updatedAt
      }
      code
      message
      currentPage
      totalItems
      totalPages
    }
  }
`;

export const ALL_NOVELTIES = gql`
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
