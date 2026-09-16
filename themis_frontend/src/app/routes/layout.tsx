'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { RootState, AppDispatch } from '@/redux/store';
import { setTitle } from '@/redux/features/metadataSlice';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-provider';
import NavBar from '@/app/components/NavBar';
import SideNav from '@/app/components/Sidenav';
import DisintegrateLogo from '@/app/components/DisintegrateLogo';
import LoadingScreen from '@/app/components/LoadingScreen';

const routeTitles: Record<string, string> = {
  '/routes/dashboard': 'Dashboard - Themis SENA',
  '/routes/profile': 'Mi Perfil - Themis SENA',
  '/routes/users': 'Usuarios - Themis SENA',
  '/routes/home': 'Inicio - Themis SENA',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verificar autenticación usando el guard
  const { isChecking } = useAuthGuard();

  useEffect(() => {
    // El guard ya maneja la redirección si no está autenticado
    if (!loading && isAuthenticated) {

    }
  }, [isAuthenticated, loading, user]);

  // Configurar título
  useEffect(() => {
    const title = routeTitles[pathname] || 'Themis - SENA';
    dispatch(setTitle(title));
  }, [pathname, dispatch]);

  // Mostrar loading mientras se verifica auth
  if (isChecking) {
    return <LoadingScreen />;
  }

  return (
    <ApolloProvider client={client}>
      <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-300'}`}>
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar menú lateral"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Escape') setIsSidebarOpen(false); }}
          />
        )}
        <Suspense fallback={<LoadingScreen />}>
          <aside
            className={`fixed z-40 inset-y-0 left-0 transition-transform duration-300 lg:translate-x-0
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              w-64 lg:w-72`}
            style={{ maxWidth: '90vw' }}
          >
            <SideNav
              currentPath={pathname}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </aside>
          <div className={`flex-1 min-w-0 transition-all duration-500 relative`}>
            <div className="fixed top-0 left-0 right-0 z-20">
              <NavBar
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
            <main className={`px-2 sm:px-4 md:px-6 transition-all duration-500 pt-24 ${isSidebarOpen ? "lg:ml-64" : ""} pb-6 overflow-auto min-h-[calc(100vh-5rem)]`}>
              {children}
            </main>
          </div>
        </Suspense>
      </div>
    </ApolloProvider>
  );
}