import React from 'react';
import AuthService from "../service/AuthService";
import { useRouter } from "next/navigation";

interface LogoutProps {
  darkMode?: boolean;
  onLogout?: () => void;
  isSidebarOpen?: boolean;
}

const Logout = ({ darkMode, onLogout, isSidebarOpen }: LogoutProps) => {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    } else {
      AuthService.logout();
      router.push('/auth/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`group flex items-center justify-center w-full bg-gradient-to-r p-3 rounded-lg cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg
        ${darkMode ? "border-gray-700 from-[#00304D] to-[#005386]" : "border-gray-200 from-[#398f0d] to-lime-500"}
        hover:rounded-lg active:translate-x-1 active:translate-y-1
        ${isSidebarOpen ? '' : 'w-12 h-11 p-0'}
      `}
      title="Cerrar Sesión"
    >
      <div className={`flex items-center justify-center transition-all duration-300 
        ${isSidebarOpen ? 'w-full group-hover:-translate-x-20' : ''}
      `}>
        <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
      </div>
      
      {isSidebarOpen && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 transform translate-x-full opacity-0 text-white text-sm font-semibold transition-all duration-300 group-hover:-translate-x-10 group-hover:opacity-100">
          Cerrar Sesión
        </div>
      )}
    </button>
  );
}

export default Logout;
