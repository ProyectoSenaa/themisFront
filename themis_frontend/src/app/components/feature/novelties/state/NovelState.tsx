'use client'
import React, { useState, useEffect, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Paginator from '@/components/ui/Paginator';
import Alert from '../../../Alert';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchNovelties } from '@/redux/features/noveltySlice';
import NoveltyGrid from "./NoveltyGrid";
import NoveltyInfoModal from "./NoveltyInfoModal";
import NoveltyStatusGuide from "../../student_case_tracking/components/novelty_status_guide";
import Button from "@/components/ui/button";
import { Info } from "lucide-react";
import AuthService from "@/app/service/AuthService";

export default function NovelState() {
  const dispatch = useDispatch<AppDispatch>();
  const { novelties, loading, error } = useSelector((state: RootState) => state.selectedNovelty);
  const isDarkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [isStepperModalOpen, setIsStepperModalOpen] = useState(false);
  const [isStatusGuideModalOpen, setIsStatusGuideModalOpen] = useState(false);
  const [selectedNovelty, setSelectedNovelty] = useState<any | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mensajeTipo, setMensajeTipo] = useState<"success" | "error" | "info" | "warning">("info");
  const [userRole, setUserRole] = useState<string | null>(null);

  // Paginación frontend para mostrar 6 cards por página
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Mapeo de Novelty[] a INovelty[]
  const mappedNovelties = useMemo(() => {
    return novelties.map((novelty: any) => {
      // Extraer ficha y programa del primer studySheet si existe
      let fk_id_journey = null;
      if (novelty.student?.studentStudySheets?.length > 0) {
        const sheet = novelty.student.studentStudySheets[0].studySheet;
        fk_id_journey = {
          id: sheet.id || null,
          numberSheet: sheet.number || null,
          fk_id_program: sheet.trainingProject?.program
            ? {
              id: sheet.trainingProject.program.id || null,
              programName: sheet.trainingProject.program.name || null,
            }
            : null,
        };
      }
      return {
        id: novelty.id,
        fk_id_novelty_type: novelty.noveltyType || null,
        fk_id_person:
          novelty.student?.person ||
          novelty.teacher?.person ||
          novelty.administrative?.person ||
          null,
        fk_id_apprentice: novelty.student
          ? {
            ...novelty.student,
            fk_id_journey: fk_id_journey,
          }
          : null,
        novelty_date: novelty.date ? new Date(novelty.date) : new Date(),
        observation: novelty.observation || '',
        status: novelty.noveltyStatus?.name || '',
        novelty_files: novelty.noveltyFiles || '',
        novelty_type_name: novelty.noveltyTypeName || '',
        document:
          novelty.student?.person?.document ||
          novelty.teacher?.person?.document ||
          novelty.administrative?.person?.document ||
          '',
      };
    });
  }, [novelties]);

  // Calcular paginación
  const totalItems = mappedNovelties.length;
  const totalPages = Math.ceil(totalItems / cardsPerPage);

  // Obtener las cards para la página actual
  const paginatedNovelties = useMemo(() => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return mappedNovelties.slice(startIndex, endIndex);
  }, [mappedNovelties, currentPage, cardsPerPage]);

  // Cargar todas las novedades al montar el componente
  useEffect(() => {
    // Cargar un número grande de novedades para tener datos suficientes para paginar
    // Puedes ajustar este número según tus necesidades
    dispatch(fetchNovelties({ page: 0, size: 100 }));
  }, [dispatch]);

  // Obtener el rol del usuario
  useEffect(() => {
    const role = AuthService.getUserRole();
    setUserRole(role);
  }, []);

  // Resetear página cuando cambian las novedades
  useEffect(() => {
    setCurrentPage(1);
  }, [novelties]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openStepperModal = (novelty: any) => {
    setSelectedNovelty(novelty);
    setIsStepperModalOpen(true);
  };

  const closeStepperModal = () => {
    setIsStepperModalOpen(false);
  };

  const openInfoModal = (novelty: any) => {
    setSelectedNovelty(novelty);
    setInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setInfoModalOpen(false);
  };

  const openStatusGuideModal = () => {
    setIsStatusGuideModalOpen(true);
  };

  const closeStatusGuideModal = () => {
    setIsStatusGuideModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 md:flex-wrap sm:flex-col">
        {mensaje && (
          <Alert
            message={mensaje}
            type={mensajeTipo}
          />
        )}
        <div className="flex-grow">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent text-center mt-5 mb-4">
            Estado Novedad
          </h1>

          {/* Botón de Estado de Novedades - Solo visible para aprendices */}
          {userRole === 'aprendiz' && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={openStatusGuideModal}
                className={`flex items-center gap-2 bg-gradient-to-br ${isDarkMode ? 'from-[#00304D] to-[#005386]' : 'from-[#398f0d] to-lime-500'} text-white shadow-lg rounded-xl px-6 py-3 border-0 hover:shadow-xl transition-all duration-300`}
                aria-label="Abrir guía de estados de novedades"
              >
                <Info className="w-5 h-5" aria-hidden="true" />
                <span className="font-semibold">Guía de Estados de Novedades</span>
              </Button>
            </div>
          )}

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NoveltyGrid
              novelties={paginatedNovelties}
              loading={loading}
              onInfoClick={openInfoModal}
              onStatusClick={openStepperModal}
              isStepperModalOpen={isStepperModalOpen}
              closeStepperModal={closeStepperModal}
              selectedNovelty={selectedNovelty}
            />
          </div>

          {/* Mostrar información de paginación */}
          {!loading && totalItems > 0 && (
            <div className="text-center mt-4 mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Mostrando {paginatedNovelties.length} de {totalItems} novedades
              </p>
            </div>
          )}

          {/* Paginador - solo mostrar si hay más de una página */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Paginator
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      </div>
      {infoModalOpen && (
        <NoveltyInfoModal
          novelty={selectedNovelty}
          onClose={closeInfoModal}
        />
      )}

      {/* Modal de Guía de Estados de Novedades */}
      <NoveltyStatusGuide
        isOpen={isStatusGuideModalOpen}
        onClose={closeStatusGuideModal}
      />
    </div>
  );
}