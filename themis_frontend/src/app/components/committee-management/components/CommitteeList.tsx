import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { RESPOND_NOVELTIES_FROM_COMMITTEE } from '@/graphqlServices/queries';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Search, Download, Eye, Users, GraduationCap, Briefcase, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Badge } from './Badge';

interface CommitteeListProps {
  committees: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewCommittee: (committee: any) => void;
  onDownloadMinute: (committee: any) => void;
  downloadingId: string | null;
  studentDecisions?: Record<
    string,
    { statusId?: number; observation?: string; noveltyId?: string; name?: string }
  >;
  onResponsesSent?: (result: any) => void;
}

export const CommitteeList: React.FC<CommitteeListProps> = ({
  committees,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
  onViewCommittee,
  onDownloadMinute,
  downloadingId,
  studentDecisions,
  onResponsesSent,
}) => {
  const [respondNoveltiesMutation] = useMutation(RESPOND_NOVELTIES_FROM_COMMITTEE);
  const [sendingCommitteeId, setSendingCommitteeId] = useState<number | null>(null);

  const sendResponses = async (committee: any) => {
    if (!studentDecisions) return;

    const entries = Object.entries(studentDecisions || {});

    // Mapeamos las respuestas según el schema CommitteeNoveltyResponseInput
    const responses = entries
      .map(([sid, dec]: any) => {
        const studentId = Number(sid);

        return {
          noveltyId: dec.noveltyId || undefined,
          studentId,
          statusId: dec.statusId, // Backend espera statusId plano, no noveltyStatus
          observation: (dec.observation || '').toString(),
          name: (dec.name || '').toString() || undefined,
        };
      })
      .filter((r) => {
        // Validamos los campos requeridos según el schema
        if (!r.noveltyId || r.statusId == null || !r.name) {
          console.warn('Skipping response due to missing required fields:', r);
          return false;
        }
        return true;
      });

    if (responses.length === 0) return;

    try {
      setSendingCommitteeId(Number(committee.id));
      console.debug('[CommitteeList] Sending responses for committee', {
        committeeId: Number(committee.id),
        responses,
      });

      const { data } = await respondNoveltiesMutation({
        variables: {
          committeeId: Number(committee.id),
          responses,
        },
      });

      console.debug('[CommitteeList] Response result', data);

      // El backend solo devuelve code y message (sin data)
      if (data?.respondNoveltiesFromCommittee?.code === 200) {
        onResponsesSent?.({
          success: true,
          message: data.respondNoveltiesFromCommittee.message
        });
      } else {
        onResponsesSent?.({
          success: false,
          message: data?.respondNoveltiesFromCommittee?.message || 'Error desconocido'
        });
      }
    } catch (err: any) {
      console.error('[CommitteeList] Response error', err);
      onResponsesSent?.({ success: false, error: err });
    } finally {
      setSendingCommitteeId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lista de Comités</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualiza y gestiona los comités programados</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por coordinación..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {committees.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No se encontraron comités
              </div>
            ) : (
              committees.map((committee: any) => (
                <div
                  key={committee.id}
                  className="group flex flex-col md:flex-row items-start gap-6 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Users size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">
                            {committee.coordination?.name || 'Sin coordinación'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {committee.isActive && (
                              <Badge variant="success" className="text-xs px-2 py-0.5">Activo</Badge>
                            )}
                            {committee.isCurrent && (
                              <Badge variant="default" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">Actual</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => onViewCommittee(committee)}
                          className="text-sm h-9 px-4 hover:bg-primary hover:text-white transition-colors"
                        >
                          <Eye size={16} className="mr-2" />
                          Ver detalles
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 dark:border-gray-800/50 my-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200">{committee.students?.length || 0}</p>
                          <p className="text-s">Aprendices</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200">{committee.teachers?.length || 0}</p>
                          <p className="text-s">Instructores</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200">{committee.administratives?.length || 0}</p>
                          <p className="text-s">Administrativos</p>
                        </div>
                      </div>
                    </div>

                    {committee.committeeEvents?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
                          <CalendarIcon size={16} className="text-gray-400" />
                          Próximos eventos
                        </h4>
                        <div className="space-y-2">
                          {committee.committeeEvents.slice(0, 2).map((event: any) => (
                            <div
                              key={event.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <CalendarIcon size={14} />
                                  <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <Clock size={14} />
                                  <span>{event.hour}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-900 dark:text-gray-200 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  {event.session}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  onClick={() => onDownloadMinute(committee)}
                                  disabled={downloadingId === event.id}
                                  className="text-xs h-8 px-3 text-gray-600 hover:text-primary hover:bg-primary/5"
                                >
                                  <Download size={14} className="mr-1.5" />
                                  {downloadingId === event.id ? 'Descargando...' : 'Acta'}
                                </Button>
                                {studentDecisions && (
                                  <Button
                                    variant="ghost"
                                    onClick={() => sendResponses(committee)}
                                    disabled={
                                      sendingCommitteeId === Number(committee.id) ||
                                      Object.keys(studentDecisions).length === 0
                                    }
                                    className="text-xs h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {sendingCommitteeId === Number(committee.id) ? 'Enviando...' : 'Enviar'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          {committee.committeeEvents.length > 2 && (
                            <button
                              onClick={() => onViewCommittee(committee)}
                              className="w-full text-center text-xs text-gray-500 hover:text-primary py-1 transition-colors"
                            >
                              Ver {committee.committeeEvents.length - 2} eventos más...
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
