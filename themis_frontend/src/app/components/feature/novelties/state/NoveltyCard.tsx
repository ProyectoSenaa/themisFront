'use client'

import React, { useMemo } from 'react';
import Image from 'next/image';
import INovelty from '@/app/interfaces/routes_interfaces/Novelty_State/INovelty';
import StepperModal from '../../../Stepper';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface NoveltyCardProps {
    novelty: INovelty;
    onInfoClick: (novelty: INovelty) => void;
    onStatusClick: (novelty: INovelty) => void;
    isStepperModalOpen: boolean;
    closeStepperModal: () => void;
    selectedNovelty: INovelty | null;
}

const NoveltyCard: React.FC<NoveltyCardProps> = ({ novelty, onInfoClick, onStatusClick, isStepperModalOpen, closeStepperModal, selectedNovelty }) => {
    const isDarkMode = useSelector((state: RootState) => state.theme.darkMode);
    
    // Usar useMemo para recalcular estilos cuando cambie isDarkMode
    const styles = useMemo(() => ({
        card: {
            background: isDarkMode 
                ? 'linear-gradient(to bottom right, #00304D, #005386)'
                : '#ffffff',
            border: isDarkMode ? 'none' : '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            color: isDarkMode ? '#ffffff' : '#111827'
        },
        title: {
            color: isDarkMode ? '#ffffff' : '#111827',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            marginBottom: '1rem'
        },
        text: {
            color: isDarkMode ? '#ffffff' : '#1f2937',
            fontSize: '1.125rem'
        },
        smallText: {
            color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#6b7280',
            fontSize: '0.875rem',
            opacity: 0.8
        },
        divider: {
            borderTop: isDarkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid #d1d5db',
            margin: '1rem 0'
        },
        button: isDarkMode 
            ? {
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.4)',
                color: '#ffffff',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                transition: 'all 0.2s',
                flex: 1,
                cursor: 'pointer'
            }
            : {
                background: '#398f0d',
                border: '1px solid #398f0d',
                color: '#ffffff',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                transition: 'all 0.2s',
                flex: 1,
                cursor: 'pointer'
            }
    }), [isDarkMode]);

    return (
        <div style={styles.card} className="hover:shadow-xl">
            <div className="flex justify-between items-start">
                <div>
                    <h2 style={styles.title}>
                        {novelty.fk_id_novelty_type?.nameNovelty ?? 'Tipo de novedad no disponible'}
                    </h2>
                </div>
                <Image
                    src="/icons/postponement.svg"
                    width={50}
                    height={50}
                    alt="Novedad"
                    className="ml-4"
                    style={{ filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}
                />
            </div>
            <div>
                <hr style={styles.divider} />
                <div className="mb-4">
                    <p style={styles.text}>
                        <b>Fecha: </b>
                        {novelty.novelty_date
                            ? new Date(novelty.novelty_date).toLocaleDateString()
                            : ''}
                    </p>
                </div>
                <p style={styles.smallText}>Para conocer más detalles haga clic en &quot;Información&quot;</p>
            </div>
            <div className="flex justify-between mt-6 space-x-4">
                <button
                    style={styles.button}
                    onClick={() => onInfoClick(novelty)}
                    onMouseEnter={(e) => {
                        if (!isDarkMode) {
                            e.currentTarget.style.opacity = '0.9';
                        } else {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isDarkMode) {
                            e.currentTarget.style.opacity = '1';
                        } else {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }
                    }}
                >
                    Información
                </button>
                <button
                    style={styles.button}
                    onClick={() => onStatusClick(novelty)}
                    onMouseEnter={(e) => {
                        if (!isDarkMode) {
                            e.currentTarget.style.opacity = '0.9';
                        } else {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isDarkMode) {
                            e.currentTarget.style.opacity = '1';
                        } else {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }
                    }}
                >
                    Ver Estado
                </button>
                <StepperModal
                    open={isStepperModalOpen}
                    onClose={closeStepperModal}
                    currentState={selectedNovelty?.status || 'Revisar'}
                />
            </div>
        </div>
    );
};

export default NoveltyCard;
