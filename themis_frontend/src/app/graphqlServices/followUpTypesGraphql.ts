import { gql } from '@apollo/client';

// Query para obtener todos los tipos de follow-up
export const GET_ALL_FOLLOW_UP_TYPES = gql`
  query GetAllFollowUpTypes($page: Int, $size: Int) {
    allFollowUpTypes(page: $page, size: $size) {
      data {
        id
        name
        isActive
        description
      }
      currentPage
      totalItems
      totalPages
      code
      message
    }
  }
`;

// Query para obtener un tipo de follow-up por ID
export const GET_FOLLOW_UP_TYPE_BY_ID = gql`
  query GetFollowUpTypeById($id: ID!) {
    followUpTypeById(id: $id) {
      id
      name
      isActive
      description
    }
  }
`;

// Query para obtener todos los estados de follow-up
export const GET_ALL_FOLLOW_UP_STATUSES = gql`
  query GetAllFollowUpStatuses($page: Int, $size: Int) {
    allFollowUpStatuses(page: $page, size: $size) {
      data {
        id
        name
        description
      }
      currentPage
      totalItems
      totalPages
      code
      message
    }
  }
`;

// Query para obtener todos los estados de flujo de follow-up
export const GET_ALL_FOLLOW_UP_FLOW_STATUSES = gql`
  query GetAllFollowUpFlowStatuses($page: Int, $size: Int) {
    allFollowUpFlowStatuses(page: $page, size: $size) {
      data {
        id
        name
        description
      }
      currentPage
      totalItems
      totalPages
      code
      message
    }
  }
`;
