import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query allRoles($roleName: String, $page: Int, $size: Int) {
      allRoles(roleName: $roleName, page: $page, size: $size) {
        data {
          id
          name
          state
        }
        totalItems
        currentPage
        totalPages
        message
        code
      }
    }
  `;
