import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNovelties, setSelectedId } from '@/redux/features/noveltySlice';
import BaseTable from '@/components/ui/Table/BaseTable';
import { RootState, AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { MailOpen, FileText, User, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';

const NoveltiesResponse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { novelties, loading, error } = useSelector((state: RootState) => state.selectedNovelty);
  const isDarkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Solo fetch si no hay datos
  useEffect(() => {
    if (!novelties || novelties.length === 0) {
      dispatch(fetchNovelties({ page: 0, size: 10 }));
    }
  }, [dispatch, novelties]);

  const getStudentInfo = (row: any) => {
    // Usar directamente los datos anidados en la novedad
    const student = row.student;
    const name = student?.person?.name || '';
    const lastname = student?.person?.lastname || '';
    const document = student?.person?.document || '';
    return { name, lastname, document, student };
  };

  const getProgramName = (student: any) => {
    if (student && Array.isArray(student.studentStudySheets) && student.studentStudySheets.length > 0) {
      return student.studentStudySheets[0]?.studySheet?.trainingProject?.program?.name || '';
    }
    return '';
  };

  const columns = [
    {
      header: 'Tipo de Novedad',
      key: 'noveltyType',
      render: (row: any) => <span>{row.noveltyType?.nameNovelty}</span>,
    },
    {
      header: 'Estudiante',
      key: 'student',
      render: (row: any) => {
        const { name, lastname, document } = getStudentInfo(row);
        return name || lastname || document ? (
          <span>{name} {lastname} {document && `(${document})`}</span>
        ) : <span>-</span>;
      },
    },
    {
      header: 'Programa',
      key: 'program',
      render: (row: any) => {
        const { student } = getStudentInfo(row);
        const programName = getProgramName(student);
        return programName ? <span>{programName}</span> : <span>-</span>;
      },
    },
    {
      header: 'Respuesta',
      key: 'answer',
      render: (row: any) => (
        <Link href={`/novelties_response/answer/${row.id}`}>
          <button
            className="flex items-center justify-center px-4 py-2 text-black rounded transition-all duration-200"
          >
            <MailOpen className="h-6 w-6 dark:text-white" />
          </button>
        </Link>
      ),
    },
  ];

  const handleRowClick = (row: any) => {
    dispatch(setSelectedId(row.id));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-[#181f2a] px-4 md:px-8">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent text-center mt-7 mb-8 px-4">
          Novedades por Responder
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-200">Cargando...</p>
        ) : error ? (
          <p className="text-red-650 dark:text-red-400">Error: {error}</p>
        ) : (
          <>
            {/* Vista de tabla para desktop */}
            <div className="hidden md:block w-full max-w-[1260px] mt-10 mb-12">
              <div className="w-full min-h-[500px] flex items-center justify-center bg-white dark:bg-[#181f2a] rounded-xl">
                <div className="w-full">
                  <BaseTable
                    columns={columns}
                    data={novelties}
                    pageSize={10}
                    onRowClick={handleRowClick}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>

            {/* Vista de tarjetas para móvil */}
            <div className="md:hidden w-full max-w-2xl space-y-4 mt-6 mb-12">
              {novelties.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No se encontraron novedades por responder
                </div>
              ) : (
                novelties.map((novelty: any) => {
                  const { name, lastname, document, student } = getStudentInfo(novelty);
                  const programName = getProgramName(student);

                  return (
                    <Card
                      key={novelty.id}
                      className="hover:shadow-lg transition-shadow duration-200 overflow-hidden border-slate-200/50 dark:border-slate-700/50"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Tipo de novedad */}
                          <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <FileText className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-base text-foreground dark:text-white block">
                                Tipo de Novedad:
                              </span>
                              <p className="text-sm text-muted-foreground dark:text-gray-300">
                                {novelty.noveltyType?.nameNovelty || '-'}
                              </p>
                            </div>
                          </div>

                          {/* Estudiante */}
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-base text-foreground dark:text-white block">
                                Estudiante:
                              </span>
                              <p className="text-sm text-muted-foreground dark:text-gray-300">
                                {name || lastname || document ? (
                                  `${name} ${lastname} ${document ? `(${document})` : ''}`
                                ) : '-'}
                              </p>
                            </div>
                          </div>

                          {/* Programa */}
                          <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-base text-foreground dark:text-white block">
                                Programa:
                              </span>
                              <p className="text-sm text-muted-foreground dark:text-gray-300">
                                {programName || '-'}
                              </p>
                            </div>
                          </div>

                          {/* Botón de respuesta */}
                          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                            <Link href={`/novelties_response/answer/${novelty.id}`} className="block">
                              <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none dark:bg-green-700 dark:hover:bg-green-800"
                              >
                                <MailOpen className="h-5 w-5" />
                                Responder Novedad
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NoveltiesResponse;