"use client";

import React, { useEffect } from "react";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "./styles/ui-components.css";
import { Providers } from "@/redux/provider";
import { ApolloProviderWrapper } from "@/lib/apollo-provider";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import DocumentMetadata from "./components/DocumentMetadata";
import { LoaderProvider } from "@/context/LoaderContext";
import { LoaderProviderComponent } from "@/context/LoaderProvider";
import { RoleProvider } from "@/context/RoleContext";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import { loadAuthFromStorage } from "@/redux/features/authSlice";
import InactivityGuard from "@/components/InactivityGuard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/logoThemis.svg" />

        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const d = localStorage.getItem('darkMode'); if (d === 'true') { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } } catch (_) {} })();`,
          }}
        />
      </head>
      <body className={`transition-colors duration-300 ${inter.className}`}>
        <ApolloProviderWrapper>
          <Providers>
            <LoaderProvider>
              <RoleProvider>
                <DocumentMetadata />
                <ThemeWrapper>
                  <LoaderProviderComponent>
                    <AuthInitializer>
                      {children}
                    </AuthInitializer>
                  </LoaderProviderComponent>
                </ThemeWrapper>
              </RoleProvider>
            </LoaderProvider>
          </Providers>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: authLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {

    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  useInitializeAuth();

  return (
    <InactivityGuard>
      {children}
    </InactivityGuard>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', !!darkMode);
    } catch { }
  }, [darkMode]);

  return (
    <div suppressHydrationWarning className={`wrapper ${darkMode ? "dark bg-gray-700" : "light bg-white text-black"}`}>
      {children}
    </div>
  );
}