"use client";

import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getTokenFromStorage } from './tokenPersistencie';

const httpUri = process.env.NEXT_PUBLIC_API_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	'http://localhost:4000/graphql';

// 🔐 Middleware de autenticación - Inyecta token en cada request
const authLink = new ApolloLink((operation, forward) => {
	const token = getTokenFromStorage();

	if (token) {

	} else {

	}

	const existingHeaders = operation.getContext().headers;

	// Si ya viene un header de autorización (ej: validación manual), respetarlo
	if (existingHeaders && existingHeaders.authorization) {
		return forward(operation);
	}

	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : '',
		}
	});

	return forward(operation);
});

// 🚨 Manejo de errores de autenticación
const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message }) => {
			console.error(`🔴 [GraphQL error]: ${message}`);

			// Si es error de autenticación, redirigir a login
			if (message.includes('Unauthorized') ||
				message.includes('Forbidden') ||
				message.includes('No authentication')) {

				// console.error('🔴 Sesión expirada, redirigiendo a login...');
				// localStorage.removeItem('themis_auth');
				// sessionStorage.removeItem('themis_auth');

				// const cerberosUrl = process.env.NEXT_PUBLIC_CERBEROS_URL || 'http://10.1.163.75:3001';
				// window.location.href = `${cerberosUrl}/auth/login?project=Themis`;
			}
		});
	}

	if (networkError) {
		console.error(`🔴 [Network error]: ${networkError}`);
	}
});

const apolloClient = new ApolloClient({
	link: from([errorLink, authLink, new HttpLink({ uri: httpUri })]),
	cache: new InMemoryCache(),
});

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

export default apolloClient;