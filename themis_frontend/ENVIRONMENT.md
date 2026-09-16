# Themis Frontend Environment Variables

This document describes all environment variables required for the Themis frontend application.

## Required Environment Variables

### GraphQL Endpoint Configuration

#### `NEXT_PUBLIC_GRAPHQL_HTTP_URL`
- **Purpose**: Primary GraphQL HTTP endpoint URL for the Themis backend
- **Required**: Yes
- **Default**: Falls back to `NEXT_PUBLIC_GRAPHQL_HTTP` or `http://localhost:4000/graphql`
- **Example**: `https://your-backend.example.com/graphql`
- **Used in**: [`apollo-provider.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/lib/apollo-provider.tsx)

#### `NEXT_PUBLIC_GRAPHQL_HTTP`
- **Purpose**: Alternative/fallback GraphQL HTTP endpoint URL
- **Required**: No (fallback for `NEXT_PUBLIC_GRAPHQL_HTTP_URL`)
- **Default**: `http://localhost:4000/graphql`
- **Example**: `https://api.example.com/graphql`
- **Used in**: [`apollo-provider.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/lib/apollo-provider.tsx)

### Authentication Service Configuration

#### `NEXT_PUBLIC_CERBEROS_URL`
- **Purpose**: URL for the Cerberos authentication service
- **Required**: Yes
- **Default**: `http://localhost:3001` or `http://10.1.163.75:3001` (depending on context)
- **Example**: `https://auth.example.com`
- **Used in**: 
  - [`apollo-provider.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/lib/apollo-provider.tsx)
  - [`useAuth.ts`](file:///home/fabrica/themisFront/themis_frontend/src/hooks/useAuth.ts)
  - [`ClientLayoutWrapper.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/components/ClientLayoutWrapper.tsx)
  - [`page.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/app/auth/callback/page.tsx)
  - [`page.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/app/auth/login/page.tsx)

### Application Configuration

#### `NEXT_PUBLIC_THEMIS_URL`
- **Purpose**: URL for the Themis frontend application (used for redirects and callbacks)
- **Required**: Yes
- **Default**: `http://localhost:3000`
- **Example**: `https://themis.example.com`
- **Used in**:
  - [`ClientLayoutWrapper.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/components/ClientLayoutWrapper.tsx)
  - [`useAuth.ts`](file:///home/fabrica/themisFront/themis_frontend/src/hooks/useAuth.ts)

#### `NEXT_PUBLIC_APP_URL`
- **Purpose**: Application URL (alternative to `NEXT_PUBLIC_THEMIS_URL`)
- **Required**: No
- **Default**: None
- **Example**: `https://app.example.com`
- **Used in**: [`page.tsx`](file:///home/fabrica/themisFront/themis_frontend/src/app/auth/login/page.tsx)

#### `NEXT_PUBLIC_API_URL`
- **Purpose**: Alternative API URL (legacy/fallback)
- **Required**: No
- **Default**: `http://localhost:4000/graphql`
- **Example**: `https://legacy-api.example.com/graphql`

---

## Environment Setup

### Development

For local development, create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your local values
NEXT_PUBLIC_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
NEXT_PUBLIC_CERBEROS_URL=http://localhost:3001
NEXT_PUBLIC_THEMIS_URL=http://localhost:3000
```

### Production

For production deployment, ensure all required environment variables are set in your hosting platform:

1. **Vercel/Netlify**: Add environment variables in your project settings
2. **Docker**: Use environment variables in your `docker-compose.yml` or `.env` file
3. **Traditional hosting**: Set environment variables in your server configuration

> [!IMPORTANT]
> All environment variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser. Be careful not to expose sensitive information through these variables.

### Example Production Configuration

```bash
NEXT_PUBLIC_GRAPHQL_HTTP_URL=https://api.yourcompany.com/graphql
NEXT_PUBLIC_GRAPHQL_HTTP=https://api.yourcompany.com/graphql
NEXT_PUBLIC_CERBEROS_URL=https://auth.yourcompany.com
NEXT_PUBLIC_THEMIS_URL=https://themis.yourcompany.com
NEXT_PUBLIC_API_URL=https://api.yourcompany.com/graphql
```

---

## Verification

To verify your environment variables are loaded correctly:

1. Start the development server: `npm run dev`
2. Open the browser console
3. The Apollo provider will log which URLs it's using
4. Look for messages like: `🔑 [Apollo] Inyectando token en: [operation]`

---

## Troubleshooting

### GraphQL Errors
- **Symptom**: "Network error" or "Failed to fetch"
- **Solution**: Verify `NEXT_PUBLIC_GRAPHQL_HTTP_URL` is correct and the backend is running

### Authentication Errors
- **Symptom**: Redirected to login repeatedly
- **Solution**: Verify `NEXT_PUBLIC_CERBEROS_URL` points to a running Cerberos instance

### CORS Errors
- **Symptom**: CORS policy errors in browser console
- **Solution**: Ensure your backend allows requests from `NEXT_PUBLIC_THEMIS_URL`
