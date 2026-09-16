'use client'

import React from "react";

const NoAccess = () => (
  <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full transform transition-all duration-500 hover:scale-105">
      <div className="text-red-500 text-6xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">No tienes acceso autorizado</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Contacta con un administrador para obtener permisos necesarios para acceder al sistema.</p>
      <button className="bg-darkGreen hover:bg-hoverGreen text-white py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-200/30">
        Regresar
      </button>
    </div>
  </div>
);

export default NoAccess;
