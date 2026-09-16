'use client';

import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import RoleService from "../service/RoleService";
import Alert from "./Alert";
import IUserFormData from "../interfaces/components_interfaces/FormPerson/IUserFormData";
import IPersonFormData from "../interfaces/components_interfaces/FormPerson/IPersonFormData";

const FormPerson: React.FC = () => {
  // Estados del formulario
  const [personFormData, setPersonFormData] = useState<IPersonFormData>({
    id: 0,
    name: "",
    lastname: "",
    email: "",
    phone: "",
    status: "Activo",
  });

  const [userFormData, setUserFormData] = useState<IUserFormData>({
    document: "",
    password: "",
    typeDocument: "",
    fk_id_person: { id: 0 },
    fk_id_role: [],
  });

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [alert, setAlert] = useState({ 
    message: "", 
    type: "info" as "success" | "error" | "info" | "warning" 
  });
  const [isUserFormEnabled, setIsUserFormEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await RoleService.getAllRoles();
        setRoles(roleResponse.data.data);
      } catch (error: any) {
        setAlert({ 
          message: `Error al obtener los roles: ${error.message || "Error desconocido"}`, 
          type: "error" 
        });
      }
    };
    fetchRoles();
  }, []);

  // Validación del formulario
  const validateForm = (): boolean => {
    if (!personFormData.name || !personFormData.lastname || !personFormData.email) {
      setAlert({ 
        message: "Nombre, apellido y correo electrónico son obligatorios", 
        type: "warning" 
      });
      return false;
    }

    if (isUserFormEnabled) {
      if (!userFormData.document || !userFormData.typeDocument || userFormData.fk_id_role.length === 0) {
        setAlert({ 
          message: "Documento, tipo de documento y al menos un rol son obligatorios", 
          type: "warning" 
        });
        return false;
      }
    }

    return true;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formType: "person" | "user"
  ) => {
    const { name, value } = e.target;
    if (formType === "person") {
      setPersonFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setUserFormData(prev => ({
        ...prev,
        [name]: name === "document" ? value.replace(/\D/g, "") : value,
      }));
    }
  };

  // Manejar cambio de roles
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoles = Array.from(e.target.selectedOptions, (option) => ({
      id: Number(option.value),
      name: option.label,
    }));
    setUserFormData(prev => ({ ...prev, fk_id_role: selectedRoles }));
  };

  // Manejar envío del formulario (Versión mejorada)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setAlert({ message: "Procesando...", type: "info" });

    try {
      // Paso 1: Crear persona
      const personResponse = await UserService.createPerson({ 
        data: personFormData 
      });

      if (!personResponse.data.success) {
        throw new Error("Error al crear la persona");
      }

      // Paso 2: Obtener ID de la persona creada
      const personData = await UserService.getPersonByEmail(personFormData.email);
      const personId = personData.data.data.id;

      // Paso 3: Crear usuario (solo si el formulario de usuario está habilitado)
      if (isUserFormEnabled) {
        const userResponse = await UserService.createUser({
          data: { 
            ...userFormData, 
            fk_id_person: { id: personId },
            roleList: userFormData.fk_id_role 
          }
        });

        if (!userResponse.data.success) {
          // Rollback: Eliminar persona si falla la creación del usuario
          await UserService.deletePerson(personId);
          throw new Error("Error al crear el usuario");
        }
      }

      // Éxito - Resetear formulario
      setAlert({ 
        message: isUserFormEnabled 
          ? "Persona y usuario creados exitosamente" 
          : "Persona creada exitosamente", 
        type: "success" 
      });
      
      resetForm();

    } catch (error: any) {
      setAlert({ 
        message: error.message || "Error en el proceso de creación", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setPersonFormData({
      id: 0,
      name: "",
      lastname: "",
      email: "",
      phone: "",
      status: "Activo",
    });
    setUserFormData({
      document: "",
      password: "",
      typeDocument: "",
      fk_id_person: { id: 0 },
      fk_id_role: [],
    });
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-12 px-4 sm:px-6">
      <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
        {alert.message && <Alert message={alert.message} type={alert.type} />}
      </div>
      
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-darkGreen to-emerald-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">
              {isUserFormEnabled ? "Crear Persona y Usuario" : "Crear Persona"}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-6">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Campos de persona */}
                {[
                  { name: "name", label: "Nombre", required: true, icon: "👤" },
                  { name: "lastname", label: "Apellido", required: true, icon: "👤" },
                  { name: "email", label: "Correo Electrónico", type: "email", required: true, icon: "✉️" },
                  { name: "phone", label: "Teléfono", required: false, icon: "📱" },
                ].map(({ name, label, type = "text", required, icon }) => (
                  <div key={name} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-darkGreen transition-all duration-200 placeholder-gray-400 focus:outline-none"
                        type={type}
                        name={name}
                        placeholder={label}
                        value={personFormData[name as keyof IPersonFormData]?.toString() || ""}
                        onChange={(e) => handleInputChange(e, "person")}
                        required={required}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campos de usuario (solo si está habilitado) */}
            {isUserFormEnabled && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-6">
                  Información de Usuario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de documento <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -5.5 24 24"><path fill="dodgerblue" d="M2 0h16c1.105 0 2 .831 2 1.857v9.286C20 12.169 19.105 13 18 13H2c-1.105 0-2-.831-2-1.857V1.857C0 .831.895 0 2 0m9 3a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2zm0 3a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2zM3 3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"/></svg>
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-darkGreen transition-all duration-200 placeholder-gray-400 focus:outline-none"
                        type="text"
                        name="document"
                        placeholder="Documento"
                        value={userFormData.document}
                        onChange={(e) => handleInputChange(e, "user")}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Documento <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" viewBox="0 0 384 512"><path fill="currentColor" d="M336 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48M144 32h96c8.8 0 16 7.2 16 16s-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16s7.2-16 16-16m48 128c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64m112 236.8c0 10.6-10 19.2-22.4 19.2H102.4C90 416 80 407.4 80 396.8v-19.2c0-31.8 30.1-57.6 67.2-57.6h5c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h5c37.1 0 67.2 25.8 67.2 57.6z"/></svg>
                      </span>
                      <select
                        name="typeDocument"
                        value={userFormData.typeDocument}
                        onChange={(e) => handleInputChange(e, "user")}
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-darkGreen transition-all duration-200 appearance-none focus:outline-none"
                        required
                      >
                        <option value="" disabled>Seleccionar</option>
                        <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                        <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                        <option value="Cédula de extranjería">Cédula de extranjería</option>
                        <option value="Permiso especial de permanencia">Permiso especial de permanencia</option>
                        <option value="Permiso de protección temporal">Permiso de protección temporal</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roles <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">👥</span>
                      <select
                        name="fk_id_role"
                        multiple
                        value={userFormData.fk_id_role.map(role => role.id.toString())}
                        onChange={handleRoleChange}
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-darkGreen transition-all duration-200 focus:outline-none"
                        required
                        size={4}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id} className="py-1">
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 italic">Mantén presionado Ctrl para seleccionar múltiples roles</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsUserFormEnabled(!isUserFormEnabled)}
                className="w-full sm:w-auto order-2 sm:order-1 px-5 py-2.5 bg-white border border-darkGreen text-darkGreen rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen"
                disabled={isSubmitting}
              >
                <span className="mr-2">{isUserFormEnabled ? "🔒" : "🔓"}</span>
                {isUserFormEnabled ? "Ocultar usuario" : "Mostrar usuario"}
              </button>
              
              <button
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-2 px-8 py-3 bg-gradient-to-r from-darkGreen to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-darkGreen shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <>
                    Crear
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPerson;