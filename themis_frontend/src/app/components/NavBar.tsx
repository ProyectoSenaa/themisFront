'use client';

// Load FontAwesome CSS dynamically on client to avoid blocking initial CSS
if (typeof window !== 'undefined') {
  const loadFa = () => {
    const href = '/node_modules/@fortawesome/fontawesome-free/css/all.min.css';

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  // Defer loading slightly to allow critical rendering to complete
  if (document.readyState === 'complete') loadFa();
  else window.addEventListener('load', loadFa);
}
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/redux/features/themeSlice';
import { RootState } from '@/redux/store';
import AuthService from '../service/AuthService';
import Switch from '@/app/components/Switch';
import NotificationBell from './NotificationBell';
import { HiOutlineMenu, HiChevronDown, HiLogout, HiUser } from 'react-icons/hi';

const useUserData = () => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth.user;
};

interface NavBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}


export default function NavBar({ toggleSidebar, isSidebarOpen }: NavBarProps) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  // selectedRole removed: role selector UI eliminated
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Estados
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Obtener iniciales del nombre
  const getInitials = (name: string, lastname: string): string => {
    return (name.charAt(0) + lastname.charAt(0)).toUpperCase();
  };

  useEffect(() => {
    // Obtener usuario de Redux primero (tiene prioridad)
    let user = reduxUser || AuthService.getUser();



    if (user) {
      // Soportar ambos formatos: fk_id_person (datos locales) y person (Cerberos)
      const personData = user.fk_id_person || user.person;

      if (personData) {
        const name = personData.name || '';
        const lastname = personData.lastname || '';
        const fullName = `${name} ${lastname}`.trim();


        setUserName(fullName);
        setUserInitials(getInitials(name, lastname));
      } else {

      }

      const role = AuthService.getUserRole();

      if (role) {

        setUserRole(role);
      } else if (user.roleList && user.roleList.length > 0) {
        const roleName = user.roleList[0].name;

        setUserRole(roleName);
      } else if (user.roles && user.roles.length > 0) {
        const roleName = user.roles[0].name;

        setUserRole(roleName);
      }
    } else {

    }
  }, [reduxUser]);

  // role dropdown removed: no outside click handler needed

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    AuthService.logout();
    router.push('/auth/login');
  };

  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  // role change handlers removed (selector UI removed)
  return (
    <>
      {/* Navbar principal - versión escritorio */}
      <header
        className={`flex h-20 items-center justify-between w-auto bg-gradient-to-r ${darkMode ? "from-[#00304D] to-[#005386]" : "from-[#398f0d] to-lime-500"
          } px-2 sm:px-4 md:px-6 shadow-lg transition-all duration-500 z-20
          ${isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024 ? "lg:left-72" : "lg:left-20"}
          fixed top-0 left-0 right-0
        `}
      >
        <div className="flex items-center">
          {/* Botón menú solo visible en móvil/tablet */}
          <button
            onClick={toggleSidebar}
            className={`mr-2 sm:mr-4 rounded-lg p-2 lg:hidden ${darkMode ? "text-white hover:bg-gray-800" : "text-white hover:bg-gray-100 hover:text-gray-700"
              } transition-all duration-300`}
            aria-label="Abrir menú lateral"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <h1 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-white"}`}>Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {/* Role selector removed */}

            {/* Switch para modo oscuro/claro */}
            <Switch checked={darkMode} onChange={toggleTheme} />

            {/* Notificaciones */}
            <NotificationBell />
          </div>

          <div className={`h-8 border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>

          {/* Información del usuario */}
          {/* Información del usuario */}
          <div className="relative ml-3">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${darkMode ? "from-blue-500 to-[#005386]" : "from-lime-400 to-lime-500"
                } transition-transform duration-300 hover:scale-105 shadow-md`}>
                {userInitials ? (
                  <span className="text-s font-medium text-white">{userInitials}</span>
                ) : (
                  <Image
                    className="w-full h-full rounded-full object-cover"
                    src="/sena/image_user.png"
                    alt="Usuario"
                    width={40}
                    height={40}
                  />
                )}
                <span className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400"></span>
              </div>

              <div className="ml-3 hidden md:flex flex-col items-start justify-center text-left">
                <p className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-white"}`}>
                  {userName?.toLowerCase() === 'admin' ? 'Coordinador' : (userName || 'Usuario')}
                </p>
                <p className={`text-s font-medium leading-tight ${darkMode ? "text-gray-300" : "text-gray-100"}`}>
                  {userRole?.toLowerCase() === 'admin' ? 'Coordinador' : (userRole || 'Invitado')}
                </p>
              </div>

              <HiChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''} ${darkMode ? "text-white" : "text-white"}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform transition-all duration-200 ease-out ${darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
                }`}>


                <div className="p-2">
                  <button
                    onClick={() => {
                      router.push('/routes/profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className={`group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-lime-50 hover:text-lime-700"
                      }`}
                  >
                    <div className={`mr-3 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${darkMode ? "bg-gray-700 group-hover:bg-gray-600" : "bg-gray-100 group-hover:bg-lime-200/60"
                      }`}>
                      <HiUser className={`h-5 w-5 transition-colors ${darkMode ? "text-gray-300 group-hover:text-white" : "text-gray-500 group-hover:text-lime-700"
                        }`} />
                    </div>
                    Mi Perfil
                  </button>

                  <div className={`my-1 h-px mx-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}></div>

                  <button
                    onClick={(e) => {
                      handleLogout(e);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${darkMode
                      ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                      }`}
                  >
                    <div className={`mr-3 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${darkMode ? "bg-red-900/20 group-hover:bg-red-900/40" : "bg-gray-100 group-hover:bg-red-100"
                      }`}>
                      <HiLogout className={`h-5 w-5 transition-colors ${darkMode ? "text-red-400 group-hover:text-red-300" : "text-gray-500 group-hover:text-red-600"
                        }`} />
                    </div>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navbar móvil - versión compacta */}

    </>
  );
}
