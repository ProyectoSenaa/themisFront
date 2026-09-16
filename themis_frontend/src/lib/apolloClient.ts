"use client";

import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink, from } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getTokenFromStorage } from './tokenPersistencie';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';

const httpUri = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/themis/graphql';
const wsUri = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

console.log('🔧 [Apollo Client] Configuración:', { httpUri, wsUri });

// Error and auth links (local copy so this file is self-contained)
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => console.error(`[GraphQL error]: ${message}`));
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getTokenFromStorage();
  const existingHeaders = operation.getContext().headers;

  if (existingHeaders && existingHeaders.authorization) return forward(operation);

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

// WebSocket client (graphql-ws)
const wsClient = typeof window !== 'undefined' ? createClient({
  url: wsUri,
  connectionParams: () => {
    const token = getTokenFromStorage();
    console.log('🔐 [WS Client] Conectando con token:', token ? 'Token presente' : 'Sin token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  webSocketImpl: typeof window !== 'undefined' ? WebSocket : undefined,
  on: {
    connected: () => console.log('✅ [WS Client] Conectado al WebSocket'),
    closed: () => console.log('❌ [WS Client] Desconectado del WebSocket'),
    error: (error) => console.error('🔴 [WS Client] Error en WebSocket:', error),
  },
}) : null;

const wsLink = wsClient ? new GraphQLWsLink(wsClient) : null;

const httpLink = new HttpLink({ uri: httpUri, fetch });

const splitLink = wsLink
  ? split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === 'OperationDefinition' && def.operation === 'subscription';
      },
      wsLink,
      httpLink
    )
  : httpLink;

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
