'use client'

import React from 'react';
import Image from 'next/image';
import INovelty from '@/app/interfaces/routes_interfaces/Novelty_State/INovelty';

interface NoveltyInfoModalProps {
    novelty: INovelty | null;
    onClose: () => void;
}

const NoveltyInfoModal: React.FC<NoveltyInfoModalProps> = ({ novelty, onClose }) => {
    if (!novelty) {
        return null;
    }

    return (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-inter dark:bg-transparent-black">
    <div className="max-h-[90vh] w-full max-w-4xl mx-4 overflow-y-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl" style={{ borderTop: "6px solid #39A900" }}>
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-8 text-center text-darkGreen dark:text-green-400">INFORMACIÓN NOVEDAD</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                        <Image
                            src="/icons/people.svg"
                            width={24}
                            height={24}
                            alt="Información Personal"
                            className="mr-2 invert"
                        />
                        <h3 className="text-lg font-semibold text-darkGreen dark:text-green-400">Información Personal</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 min-w-[150px]">Nombre:</span>
                            <span className="font-medium dark:text-white">{novelty.fk_id_person?.name} {novelty.fk_id_person?.lastname}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 min-w-[150px]">Documento:</span>
                            <span className="font-medium dark:text-white">{novelty.fk_id_person?.document}</span>
                        </p>
                    </div>
                </div>

                {/* Información Académica */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                        <Image
                            src="/icons/academic.svg"
                            width={24}
                            height={24}
                            alt="Información Académica"
                            className="mr-2"
                        />
                        <h3 className="text-lg font-semibold text-darkGreen dark:text-green-400">Información Académica</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 min-w-[150px]">Ficha:</span>
                            <span className="font-medium dark:text-white">{novelty.fk_id_apprentice?.fk_id_journey?.numberSheet ?? 'N/A'}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 min-w-[150px]">Programa:</span>
                            <span className="font-medium dark:text-white">{novelty.fk_id_apprentice?.fk_id_journey?.fk_id_program?.programName ?? 'N/A'}</span>
                        </p>
                    </div>
                </div>

                {/* Detalles de la Novedad */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 shadow-sm md:col-span-2">
                    <div className="flex items-center mb-4">
                        <Image
                            src="/icons/novelty.svg"
                            width={24}
                            height={24}
                            alt="Detalles de la Novedad"
                            className="mr-2"
                        />
                        <h3 className="text-lg font-semibold text-darkGreen dark:text-green-400">Detalles de la Novedad</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 min-w-[150px]">Tipo:</span>
                            <span className="font-medium dark:text-white">{novelty.fk_id_novelty_type?.nameNovelty ?? 'Tipo de novedad no disponible'}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 min-w-[150px]">Fecha:</span>
                            <span className="font-medium dark:text-white">{novelty.novelty_date ? new Date(novelty.novelty_date).toLocaleDateString() : ''}</span>
                        </p>
                        <div className="mt-4">
                            <p className="text-gray-600 dark:text-gray-300 mb-2">Fundamentos:</p>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
                                <p className="text-gray-800 dark:text-gray-100">{novelty.observation}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    className="px-6 py-2 bg-darkGreen hover:bg-hoverGreen text-white rounded-lg transition duration-300 flex items-center"
                    onClick={onClose}
                >
                    <Image
                        src="/icons/x-symbol.svg"
                        width={20}
                        height={20}
                        alt="Cerrar"
                        className="mr-2 invert"
                    />
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>
    );
};

export default NoveltyInfoModal;
