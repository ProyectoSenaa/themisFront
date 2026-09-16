const { gql } = require("@apollo/client");

export const GET_STUDENTS = gql`
    query GetStudents($name : String, $idStudySheet : Long, $page : Int , $size : Int) {
        allStudents(name : $name, idStudySheet : $idStudySheet, page : $page , size : $size) {
            date
            code
            message
             data {
                id
                state
                person {
                    id
                    document
                    name
                    lastname
                    phone
                    email
                    address
                }
                studentStudySheets {
                studySheet {
                    id
                    number
                    state
                    trainingProject {
                        id
                        name
                        program {
                            id
                            name
                        }
                    }
                }
            }
            }
            currentPage
            totalPages
            totalItems
        }
    }
`;

export const GET_STUDENT_LIST = gql`
    query GetStudentList {
        allStudentList {
            code
            message
            data {
                id
                state
                person {
                    id
                    name
                    lastname
                    
                    document
                    phone
                    email
                    address
                }
                studentStudySheets {
                    studySheet {
                        id
                        number
                        state
                        trainingProject {
                            id
                            name
                            program {
                                id
                                name
                            }
                        }
                    }
                }
            }
            totalItems
        }
    }
`;

export const ADD_STUDENT = gql`
    mutation AddStudent($input: StudentInput!) {
        addStudent(input: $input) {
            code
            message
            id
        }
    }
`;

export const UPDATE_STUDENT = gql`
    mutation UpdateStudent($id: Logn!, $input: StudentInput!) {
        updateStudent(id: $id, input: $input) {
            code
            message
            id
        }
    }
`;

export const DELETE_STUDENT = gql`
    mutation DeleteStudent($id: Long!) {
        deleteStudent(id: $id) {
            code
            message
            id
        }
    }
`;