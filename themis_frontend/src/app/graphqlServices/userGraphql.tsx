import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($userName: String, $page: Int, $size: Int) {
    allUsers(userName: $userName, page: $page, size: $size) {
      data {
        id
        password
        state
        person {
          Personkey{
          id
          document
          }
          name
        }
        roles {
          id
          name
        }
        permissions {
          id
        }
      }
      date
      code
      message
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_USER_LIST = gql`
  query GetUserList {
    allUserList {
      data {
        id
        password
        state
        person {
          id
          name
        }
        roles {
          id
          name
        }
        permissions {
          id
          name
        }
      }
      date
      code
      message
      totalItems
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($input: UserInput!) {
    addUser(input: $input) {
      id
      code
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      code
      message
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      code
      message
    }
  }
`;