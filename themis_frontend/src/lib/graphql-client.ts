import apolloClient from "./apollo-provider"
import { DocumentNode, OperationVariables } from "@apollo/client"
import { getMainDefinition } from '@apollo/client/utilities'

export async function graphqlRequest(query: DocumentNode, variables?: OperationVariables) {
  const mainDef: any = getMainDefinition(query as any)
  const operation = mainDef?.operation

  if (operation === 'mutation') {
    try {
      // Log variables (and their JSON) to help debug what is being sent over the network
      // This helps confirm whether nested objects are present or being sent as primitives
      console.debug("[graphqlRequest] operation=mutation, variables:", variables)
      try {
        console.debug("[graphqlRequest] variables JSON:", JSON.stringify(variables))
      } catch (e) {
        console.debug("[graphqlRequest] variables JSON stringify failed:", e)
      }
    } catch (logErr) {
      // ignore logging errors
    }
    const res = await apolloClient.mutate({ mutation: query, variables })
    return res.data
  }


  const res = await apolloClient.query({ query, variables })
  return res.data
}
