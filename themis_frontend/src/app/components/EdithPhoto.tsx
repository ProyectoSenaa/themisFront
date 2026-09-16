'use client';

import React, { useRef, useState } from 'react';
import { TbCameraPlus } from "react-icons/tb";
import { IoTrash } from "react-icons/io5";
import Image from 'next/image';
import '../styles/globals.css'
import IEditPhotoProps from '../interfaces/components_interfaces/EditPhoto/IEditPhotoProps';



/**
 * Componente de edición de foto de perfil.
 *
 * Este componente permite al usuario agregar o eliminar su foto de perfil.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.open - Indica si el modal está abierto o no.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {string} props.profileImage - URL de la imagen de perfil.
 * @returns {JSX.Element | null} El modal de edición de foto de perfil.
 */
const EdithPhoto: React.FC<IEditPhotoProps> = ({ open, onClose, profileImage }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddPhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            console.log('File selected:', files[0]);
            // Aquí puedes manejar el archivo seleccionado
        }
    };

    if (!open) return null; // No renderizar nada si open es false

    return (
        <div className="font-inter fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 border-b-2 ">
            <div className="w-[800px] h-[400px] bg-darkGreen rounded-lg p-4 relative">
                {/* Título del modal */}
                <div className='border-b-2'>
                    <div>
                        <h1 className="text-3xl text-white font-inter my-2 ml-7">Foto de Perfil</h1>
                    </div>
                </div>
                {/* Imagen de perfil */}
                <div className="flex justify-center mt-10 border-b-2">
                    <Image
                        src={profileImage}
                        alt="Foto de Perfil"
                        className="w-[200px] h-[200px] rounded-full border-4 border-white my-3"
                        width={150}
                        height={150}
                    />
                </div>
                {/* Botones para añadir y eliminar foto */}
                <div className="absolute mt-2 left-4 flex space-x-[480px] font-inter">
                    <button
                        className="flex items-center bg-transparent hover:bg-hoverGreen hover:text-black text-white py-2 px-4 rounded"
                        onClick={handleAddPhotoClick}
                    >
                        <TbCameraPlus className="w-8 h-8 text-white mr-2"/>
                        Añadir Foto
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button className="flex items-center bg-transparent hover:bg-hoverGreen hover:text-black text-white py-2 px-4 rounded" onClick={handleOpenModal}>
                        <IoTrash className="w-8 h-8 text-white mr-2"/>
                        Eliminar
                    </button>
                </div>            
                {/* Botón para cerrar el modal */}
                <button
                    className="absolute top-2 right-2 bg-[#D9D9D9] rounded text-black py-2 px-4 mr-5 my-3 hover:bg-gray-400"
                    onClick={onClose}
                >
                    Cerrar
                </button>
                {/* Modal de confirmación para eliminar la foto */}
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-[400px] h-[180px] bg-white rounded-lg p-4">
                            <h1 className="text-xl font-inter my-2 ml-10">Borrar foto de perfil</h1>
                            <p className="text-sm text-black font-inter border-y-2 py-5 p-10">¿Estás seguro que deseas eliminar la foto de perfil?</p>
                            <div className="flex justify-center mt-2 space-x-4">
                                <button className="flex items-center text-black py-2 px-4 bg-[#D9D9D9] hover:bg-gray-400 rounded" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button className="flex items-center text-white py-2 px-4 bg-red-500 hover:bg-red-700 rounded">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EdithPhoto;
