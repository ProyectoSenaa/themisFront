import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { CommitteeStats } from '../types';

interface DashboardProps {
  stats: CommitteeStats;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  isProcessing: boolean;
  uploadStatus: "idle" | "success" | "error";
  errorMessages: string[];
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onFileUpload,
  onDownloadTemplate,
  isProcessing,
  uploadStatus,
  errorMessages,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-[#232b3b] dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Eventos</h3>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEventos}</div>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#232b3b] dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pendientes</h3>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#398f0d] dark:text-blue-300">{stats.pendientes}</div>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#232b3b] dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Finalizados</h3>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.finalizados}</div>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#232b3b] dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Coordinaciones</h3>
            <Users className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coordinaciones}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Upload Section */}
      <Card className="dark:bg-[#232b3b] dark:border-gray-700">
        <CardHeader>
          <h3 className="text-lg font-medium">Carga Masiva de Eventos</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            Sube un archivo Excel con los eventos de comité
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 hover:border-gray-400'
              }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="text-lg font-medium">
                {isDragging
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra y suelta tu archivo Excel aquí'
                }
              </div>

              <div className="space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isProcessing ? 'Procesando...' : 'Seleccionar archivo'}
                </button>

                <button
                  onClick={onDownloadTemplate}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Descargar plantilla
                </button>
              </div>

              {uploadStatus === 'success' && (
                <div className="text-[#398f0d] dark:text-blue-300 font-medium">
                  ✓ Archivo procesado exitosamente
                </div>
              )}

              {uploadStatus === 'error' && errorMessages.length > 0 && (
                <div className="text-red-600">
                  <div className="font-medium mb-2">Errores encontrados:</div>
                  <ul className="text-sm space-y-1">
                    {errorMessages.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
