'use client'

import React from 'react';
import Image from 'next/image';
import INovelty from '@/app/interfaces/routes_interfaces/Novelty_State/INovelty';
import NoveltyCard from './NoveltyCard';
import LoadingBar from '../../../LoadingBar';

interface NoveltyGridProps {
    novelties: INovelty[];
    loading: boolean;
    onInfoClick: (novelty: INovelty) => void;
    onStatusClick: (novelty: INovelty) => void;
    isStepperModalOpen: boolean;
    closeStepperModal: () => void;
    selectedNovelty: INovelty | null;
}

const NoveltyGrid: React.FC<NoveltyGridProps> = ({ novelties, loading, onInfoClick, onStatusClick, isStepperModalOpen, closeStepperModal, selectedNovelty }) => {
    if (loading) {
        return <div className="col-span-full flex justify-center"><LoadingBar /></div>;
    }

    if (novelties.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Image
                    src="/icons/guide-alt.svg"
                    width={120}
                    height={120}
                    alt="No hay novedades"
                    className="opacity-50 dark:invert"
                />
                <h2 className="text-gray-500 text-2xl font-bold mt-6">Sin Novedades</h2>
                <p className="text-gray-500 text-center mt-4 max-w-md">
                    Aún no se han registrado ninguna novedad.
                </p>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {novelties.map((novelty) => (
                <NoveltyCard
                    key={novelty.id}
                    novelty={novelty}
                    onInfoClick={onInfoClick}
                    onStatusClick={onStatusClick}
                    isStepperModalOpen={isStepperModalOpen}
                    closeStepperModal={closeStepperModal}
                    selectedNovelty={selectedNovelty}
                />
            ))}
        </div>
    );
};

export default NoveltyGrid;
