import React from "react";
import IModalProps from "../interfaces/components_interfaces/Modal/IModalProps"

const Modal = ({ show, onClose, onConfirm }: IModalProps) => {
    // Si show es false, el modal no se muestra
    if (!show) return null;
    
    // Renderiza el modal si show es true
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm font-inter z-[9999] animate-in fade-in duration-300">
            <div className="w-[450px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300 ease-out">
                {/* Header con gradiente sutil */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        {/* Icono de alerta */}
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800 leading-tight">
                            ¿Desea continuar con el proceso?
                        </h1>
                    </div>
                </div>
                
                {/* Contenido del modal */}
                <div className="px-8 py-6">
                    <p className="text-gray-600 leading-relaxed text-base">
                        ¿Estás seguro que desea continuar con la siguiente novedad? Esta acción no se puede deshacer.
                    </p>
                </div>
                
                {/* Footer con botones */}
                <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3 border-t border-gray-100">
                    {/* Botón Cancelar */}
                    <button 
                        className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow focus:ring-2 focus:ring-gray-200 focus:outline-none"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    
                    {/* Botón Confirmar */}
                    <button 
                        className="px-6 py-2.5 text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-800 hover:to-green-800 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transform hover:scale-[1.02]"
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;