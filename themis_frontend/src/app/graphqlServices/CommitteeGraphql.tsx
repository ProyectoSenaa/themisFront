import { gql } from '@apollo/client';

export const ALLCOMMITTEES_LIST = gql`
	query ALLCOMMITTEES_LIST($page: Int, $size: Int){
		allCommittees(page: $page, size: $size){
			data{
				id
				coordination{
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
				}
				students{
					id
					person{
						id
						name
						lastname
					}
				}
				teachers{
					id
					collaborator{ person{ name lastname } }
				}
			}
		}
	}
`;

// Query puntual para traer un comité por ID con integrantes completos
export const COMMITTEE_BY_ID = gql`
  query CommitteeById($id: ID!) {
    committeeById(id: $id) {
      id
      coordination { id name }
      isCurrent
      isActive
      committeeEvents {
        id
        date
        hour
        session
        coordinationName
      }
      students {
        id
        person { id name lastname }
      }
      teachers {
        id
        collaborator { person { name lastname } }
      }
    }
  }
`;

export const ADD_COMMITTEE = gql`
	mutation ADD_COMMITTEE($input : CommitteeDto) {
		addCommittee(input : $input) {
			code
			message
		}
	}
`;

export const UPDATE_COMMITTEE = gql`
	mutation UpdateCommittee($id: ID!, $input: CommitteeDto) {
		updateCommittee(id: $id, input: $input) {
			code
			message
		}
	}
`;

export const DELETE_COMMITTEE = gql`
	mutation DeleteCommittee($id: ID!) {
		deleteCommittee(id: $id) {
			id
			code
			message
		}
	}
`;

 
