import React, { useState, useMemo } from 'react';
import IconForNovelty from '../../IconForNovelties';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import INoveltyType from '../../../interfaces/components_interfaces/CardA_&_CardSA/INoveltyType';
import { addNoveltie } from '@/redux/features/noveltieTypeSlice';
import { useAppDispatch } from '@/redux/hooks';
import Modal from '@/app/components/Modal';

interface NoveltyCardProps {
  item: INoveltyType;
  darkMode: boolean;
  onUpdateClick: (id: number) => void;
  onInfoClick: (item: INoveltyType) => void;
  onRegisterClick: (item: INoveltyType) => void;
}

const NoveltyCard: React.FC<NoveltyCardProps> = ({ item, darkMode, onUpdateClick, onInfoClick, onRegisterClick }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRegister, setPendingRegister] = useState<INoveltyType | null>(null);

  const needsConfirmation = (name: string) => {
    const normalized = name?.toLowerCase?.() ?? '';
    return ['retiro voluntario', 'aplazamiento', 'deserción', 'desercion'].includes(normalized);
  };

  // Usar useMemo para que los estilos se recalculen cuando cambie darkMode
  const styles = useMemo(() => ({
    card: {
      background: darkMode 
        ? 'linear-gradient(to bottom right, #00304D, #005386)' 
        : '#ffffff',
      border: darkMode ? 'none' : '1px solid #e5e7eb',
      color: darkMode ? '#ffffff' : '#111827',
      maxWidth: '450px',
      height: '250px',
      position: 'relative' as const,
      padding: '1.5rem',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease-in-out',
      overflow: 'hidden' as const
    },
    title: {
      color: darkMode ? '#ffffff' : '#111827'
    },
    subtitle: {
      color: darkMode ? 'rgba(255,255,255,0.8)' : '#374151'
    },
    description: {
      color: darkMode ? 'rgba(255,255,255,0.9)' : '#1f2937'
    },
    buttonClose: {
      color: darkMode ? '#ffffff' : '#111827',
      borderColor: darkMode ? 'rgba(255,255,255,0.6)' : '#9ca3af'
    },
    buttonRegister: darkMode
      ? {
          color: '#ffffff',
          background: 'rgba(255,255,255,0.1)',
          borderColor: 'rgba(255,255,255,0.4)'
        }
      : {
          color: '#ffffff',
          background: '#398f0d',
          borderColor: '#398f0d'
        },
    buttonInfo: {
      background: darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6'
    },
    border: {
      borderTopColor: darkMode ? 'rgba(255,255,255,0.2)' : '#d1d5db'
    }
  }), [darkMode]);

  const iconClass = darkMode ? 'text-white' : 'text-[#398f0d]';
  const iconFilterClass = darkMode ? 'invert-[1]' : 'brightness-0';

  return (
    <>
      <div style={styles.card} className="lg:max-w-[390px]">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
          <IconForNovelty nameNovelty={item.nameNovelty} className={iconClass} />
        </div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <h1 className="font-semibold text-[24px]" style={styles.title}>
              {item.nameNovelty}
            </h1>
            <p className="mt-2 ml-[3px] text-sm" style={styles.subtitle}>
              (12)
            </p>
          </div>
          <button
            onClick={() => onUpdateClick(item.id)}
            style={styles.buttonClose}
            className="w-[26px] h-[26px] text-[12px] font-normal border rounded-full transition-all duration-200 flex items-center justify-center hover:opacity-80"
          >
            ✕
          </button>
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <div className="flex-grow flex justify-center items-center mb-4">
            <p className="font-normal text-[16px] text-center leading-relaxed" style={styles.description}>
              {item.procedureDescription}
            </p>
          </div>
          <div className="flex justify-between items-center w-full mt-2 border-t pt-3" style={styles.border}>
            <div className="hidden sm:block">
              <IconForNovelty nameNovelty={item.nameNovelty} className={iconClass} />
            </div>
            <div className="flex space-x-4 py-2 ml-auto">
              <button
                type="button"
                onClick={() => {
                  if (needsConfirmation(item.nameNovelty)) {
                    setPendingRegister(item);
                    setConfirmOpen(true);
                    return;
                  }

                  dispatch(addNoveltie({
                    id: item.id,
                    date: '',
                    files: null,
                    observations: '',
                    status: item.noveltyState,
                    noveltyType: item.nameNovelty
                  }));
                  onRegisterClick(item);
                  router.push(`/routes/novel_register?type=${encodeURIComponent(item.nameNovelty)}`);
                }}
                style={styles.buttonRegister}
                className="w-[110px] h-[36px] text-[13px] font-medium border rounded-full transition-all duration-200 hover:opacity-80"
              >
                Registrar
              </button>

              <button
                onClick={() => onInfoClick(item)}
                style={styles.buttonInfo}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full transition-all duration-200 hover:opacity-80"
              >
                <Image
                  className={iconFilterClass}
                  src={"/icons/more-info.svg"}
                  width={20}
                  height={20}
                  alt={`Info sobre la novedad de ${item.nameNovelty}`}
                  title={`Info sobre la novedad de ${item.nameNovelty}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingRegister(null);
        }}
        onConfirm={() => {
          if (pendingRegister) {
            dispatch(addNoveltie({
              id: pendingRegister.id,
              date: '',
              files: null,
              observations: '',
              status: pendingRegister.noveltyState,
              noveltyType: pendingRegister.nameNovelty
            }));
            onRegisterClick(pendingRegister);
            router.push(`/routes/novel_register?type=${encodeURIComponent(pendingRegister.nameNovelty)}`);
          }
          setConfirmOpen(false);
          setPendingRegister(null);
        }}
      />
    </>
  );
};

export default NoveltyCard;
