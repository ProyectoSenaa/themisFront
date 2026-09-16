"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "@/redux/features/themeSlice";
import { RootState } from "@/redux/store";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getMenusBySection } from "@/config/roleMenus";
import AuthService from "../service/AuthService";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Logout from "./Logout";

interface SideNavProps {
  currentPath?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function SideNav({
  currentPath = "",
  isSidebarOpen,
  toggleSidebar
}: SideNavProps) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  // Use normalized role from AuthService instead of selectedRole slice
  const selectedRole = AuthService.getUserRole();
  const dispatch = useDispatch();
  const router = useRouter();
  const [userName, setUserName] = React.useState("");
  const [userRole, setUserRole] = React.useState("");
  const [userInitials, setUserInitials] = React.useState("");

  useEffect(() => {
    // Obtener información del usuario
    const user = AuthService.getUser();
    if (user && user.fk_id_person) {
      const name = user.fk_id_person.name;
      const lastname = user.fk_id_person.lastname;

      setUserName(`${name} ${lastname}`);
      setUserInitials(getInitials(name, lastname));

      // Obtener el rol del usuario
      if (user.roleList && user.roleList.length > 0) {
        setUserRole(user.roleList[0].name);
      }
    }
  }, []);



  // Obtener iniciales del nombre
  const getInitials = (name: string, lastname: string): string => {
    return (name.charAt(0) + lastname.charAt(0)).toUpperCase();
  };

  // Obtener menús dinámicos basados en el rol del usuario
  const principalItems = getMenusBySection(selectedRole as any, 'principal');
  const gestionItems = getMenusBySection(selectedRole as any, 'gestion');

  const isActive = (href: string) => currentPath === href;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 flex flex-col overflow-hidden ${darkMode ? "shadow-gray-600/20 bg-gray-900" : " bg-white"
        } shadow-lg transition-all-all duration-500 ease-in-out ${isSidebarOpen ? "w-75" : "w-20"
        }`}
      style={{ transitionProperty: 'width, background, box-shadow', transitionDuration: '500ms', transitionTimingFunction: 'ease-in-out' }}
    >
      {/* Logo Header */}
      <div className={`flex h-20 items-center ${isSidebarOpen ? "px-6" : "justify-center"
        } transition-all duration-500 ease-in-out`}>
        <div className="flex items-center">
          <div className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br p-2 ${darkMode ? "from-blue-600 to-[#005386]" : "from-[#398f0d] to-lime-500"
            } shadow-md transition-all duration-500 ease-in-out hover:scale-105`}>
            <Image
              src="/icons/logoThemis.svg"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain invert"
            />
            <span className="absolute inset-0 transition-transform duration-1000 bg-white animate-ping-slow rounded-xl opacity-10"></span>
          </div>
          {isSidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <span className={`block text-xl font-bold tracking-wide ${darkMode ? "text-white" : "text-gray-900"
                } transition-all duration-300`}>
                THEMIS
              </span>
              <span className={`text-xs font-bold ${darkMode ? "text-indigo-300" : "text-lime-600"
                } transition-opacity pl-10 duration-500 `} style={{ fontSize: "15px" }}>
                Gestión de novedades
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div className={`mt-4 ${isSidebarOpen ? "px-4" : "px-2"} transition-all duration-500 ease-in-out`}>
        <p className={`mb-2 ${isSidebarOpen ? "pb-4 text-[12px] font-medium" : "text-center text-[10px]"
          } tracking-wider uppercase ${darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          {isSidebarOpen ? "Principal" : "Menu"}
        </p>
        <nav className="flex flex-col gap-y-4 space-y-1">
          {principalItems.map(({ name, href, icon: IconComponent }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center p-3 rounded-xl group transition-all duration-300
                ${isActive(href) ? "shadow-md" : ""}
                ${isActive(href) && !darkMode ? "bg-gradient-to-l from-[#398f0d] to-lime-500" : ""}
                ${isActive(href) && darkMode ? "bg-gradient-to-l from-[#00304D] to-[#005386]" : ""}
                ${!isActive(href) ? "hover:bg-white/10 dark:hover:bg-gray-700/20" : ""}
              `}
            >
              <div className="relative flex items-center justify-center">
                <span className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  <IconComponent />
                </span>
              </div>
              <span className={`ml-3 ${isActive(href) ? "font-semibold text-white" : darkMode ? "text-gray-200" : "text-gray-700"
                } text-sm ${!isSidebarOpen && "hidden"}`}>
                {name}
              </span>
              {isActive(href) && isSidebarOpen && (
                <div className="ml-auto w-2 h-8 bg-lime-500/60 dark:bg-gray-300/60 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Second Navigation Group */}
      <div className={`mt-8 ${isSidebarOpen ? "px-4" : "px-2"} transition-all duration-500 ease-in-out`}>
        <p className={`mb-2 ${isSidebarOpen ? "pb-4 text-[12px] font-medium" : "text-center text-[10px]"
          } tracking-wider uppercase ${darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          {isSidebarOpen ? "Gestión" : "Más"}
        </p>
        <nav className="flex flex-col gap-y-4 space-y-1">
          {gestionItems.map(({ name, href, icon: IconComponent }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center p-3 rounded-xl group transition-all duration-300
                ${isActive(href) ? "shadow-md" : ""}
                ${isActive(href) && !darkMode ? "bg-gradient-to-l from-[#398f0d] to-lime-500" : ""}
                ${isActive(href) && darkMode ? "bg-gradient-to-l from-[#00304D] to-[#005386]" : ""}
                ${!isActive(href) ? "hover:bg-white/10 dark:hover:bg-gray-700/20" : ""}
              `}
            >
              <div className="relative flex items-center justify-center">
                <span className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  <IconComponent />
                </span>
              </div>
              <span className={`ml-3 ${isActive(href) ? "font-semibold text-white" : darkMode ? "text-gray-200" : "text-gray-700"
                } text-sm ${!isSidebarOpen && "hidden"}`}>
                {name}
              </span>
              {isActive(href) && isSidebarOpen && (
                <div className="ml-auto w-2 h-8 bg-lime-500/60 dark:bg-gray-300/60 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Toggle Button */}
      <div className={`${isSidebarOpen ? "px-4" : "px-2"} py-3 transition-all duration-500 ease-in-out`}>
        <button
          onClick={toggleSidebar}
          className={`flex w-full items-center justify-center rounded-lg p-2 ${darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-all duration-300`}
        >
          {isSidebarOpen
            ? <HiChevronLeft className="w-5 h-5" />
            : <HiChevronRight className="w-5 h-5" />
          }
          {isSidebarOpen && <span className="ml-2 text-sm"></span>}
        </button>
      </div>


    </aside>
  );
}
