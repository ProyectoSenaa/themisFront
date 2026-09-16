const { gql } = require("@apollo/client");

export const GET_PERSONS = gql`
  query GetPersons($name: String, $page: Int, $size: Int) {
    allPersons(name: $name, page: $page, size: $size) {
      date
      code
      message
      data {
        id
        document
        name
        lastname
        date_birth
        blood_type
        phone
        email
        address
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;