import { gql } from "@apollo/client";

// Consulta paginada y filtrada
export const GET_DOCUMENT_TYPES = gql`
  query AllDocumentTypes($DocumentTypeName: String, $page: Int, $size: Int) {
    allDocumentTypes(DocumentTypeName: $DocumentTypeName, page: $page, size: $size) {
      data {
        id
        name
        acronym
        state
      }
      code
      message
      currentPage
      totalItems
      totalPages
    }
  }
`;

// Consulta lista simple
export const GET_DOCUMENT_TYPES_LIST = gql`
  query AllDocumentTypesList {
    allDocumentTypesList {
      data {
        id
        name
        acronym
        state
      }
      code
      message
      totalItems
    }
  }
`;