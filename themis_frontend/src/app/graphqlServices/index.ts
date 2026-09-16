import { gql } from '@apollo/client';

export const ADD_BULK_COMMITTEE_EVENTS = gql`
  mutation AddBulk($input: [CommitteeEventDto!]!) {
    addCommitteeEventsBulk(input: $input) {
      code
      message
      data
    }
  }
`;