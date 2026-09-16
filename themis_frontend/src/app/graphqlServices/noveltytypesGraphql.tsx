import { gql } from '@apollo/client';

// Query: Obtener todos los tipos de novedad con paginación por defecto
export const GET_NOVELTYTYPES = gql`
  query getNoveltyTypes($page: Int = 0, $size: Int = 10) {
    allNoveltyTypes(page: $page, size: $size) {
      code
      message
      date
      currentPage
      totalItems
      totalPages
      data {
        id
        nameNovelty
        isActive
        description
        procedureDescription
      }
    }
  }
`;

// Query: Obtener un tipo de novedad por ID (se mantiene)
export const GET_NOVELTYTYPE_BY_ID = gql`
  query getNoveltyTypeById($id: ID) {
    noveltyTypeById(id: $id) {
      code
      message
      date
      currentPage
      totalItems
      totalPages
      data {
        id
        nameNovelty
        noveltyState
        description
        procedureDescription
        role {
          id
        }
      }
    }
  }
`;

// Query: Obtener todos los tipos de novedad (lista)
export const GET_NOVELTYTYPE_LIST = gql`
  query getNoveltyTypeList {
    allNoveltyTypeList {
      code
      message
      date
      currentPage
      totalItems
      totalPages
      data {
        id
        nameNovelty
        isActive
        description
        procedureDescription
      }
    }
  }
`;

// Mutación: Agregar un tipo de novedad
export const ADD_NOVELTYTYPE = gql`
  mutation AddNoveltyType($input: NoveltyTypeDto) {
    addNoveltyType(input: $input) {
      code
      message
      id
    }
  }
`;

// Mutación: Actualizar un tipo de novedad (usa Long para el id según tu esquema)
export const UPDATE_NOVELTYTYPE = gql`
  mutation UpdateNoveltyType($id: Long!, $input: NoveltyTypeDto) {
    updateNoveltyType(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

// Mutación: Eliminar un tipo de novedad (usa Long para el id según tu esquema)
export const DELETE_NOVELTYTYPE = gql`
  mutation DeleteNoveltyType($id: Long!) {
    deleteNoveltyType(id: $id) {
      code
      message
      id
    }
  }
`;
