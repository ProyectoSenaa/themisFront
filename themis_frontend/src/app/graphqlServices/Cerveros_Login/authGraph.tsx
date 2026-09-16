import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($input: LoginRequestDTO!) {
    login(input: $input) {
      token
      code
      message
      refreshToken
      user {
        id
        roles {
          name
        }
        person {
          document
          name
          photo
          lastname
        }
        processDetails {
          process {
            functionName
          }
        }
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($idUser: Long, $token: String) {
    logout(idUser: $idUser, token: $token){
      code
      message
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation refreshToken($token: String!) {
    refreshToken(refreshTokenInput: $token) {
      refreshToken
      code
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($document: Long!) {
    forgotPassword(document: $document) {
      code
      message
    }
  }
`;

export const GET_AUTH_TOKEN = gql`
    mutation GetAuthToken($token: String!) {
    getAuthToken(token: $token) {
      code
      message
      token
      user {
        id
        roles {
          name
        }
        person {
          name
          photo
          lastname
        }
        processDetails {
          project {
            name
          }
          process {
            functionName
          }
        }
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInputDTO!) {
    updatePassword(input: $input) {
      code
      message
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Long!) {
    userById(id: $id) {
      data {
        id
        person {
          id
          name
          lastname
          document
          dateBirth
          bloodType
          phone
          email
          address
          documentType {
            id
            name
          }
        }
      }
      code
      message
    }
  }
`;