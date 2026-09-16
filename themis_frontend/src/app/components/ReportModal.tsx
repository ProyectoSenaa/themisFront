'use client'
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GENERATE_PDF_REPORT = gql`
  query GeneratePdfWithNovelties($filter: GeneratePdfFilterInput) {
    generatePdfWithNovelties(filter: $filter) {
      data
      code
      message
    }
  }
`;

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  // optional filters so exported report matches UI
  filters?: {
    noveltyType?: string | undefined
    status?: string | undefined
    dateRange?: { from?: Date | undefined; to?: Date | undefined } | undefined
  }
  exportToExcel?: (meta?: any) => Promise<void>
  exportToPDF?: (meta?: any) => Promise<void>
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, filters, exportToExcel, exportToPDF }) => {
  const [format, setFormat] = useState('pdf');

  const [generatePdfReport, { loading: loadingPdf }] = useLazyQuery(GENERATE_PDF_REPORT);

  const isLoading = loadingPdf;

  if (!isOpen) {
    return null;
  }

  const downloadPdfFromBase64 = (base64Data: string, filename: string) => {
    try {
     
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
    
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const handleGenerate = async () => {
    try {
      // Build metadata for exports
      const meta = {
        createdBy: (window as any).__USER_NAME__ || document.querySelector('#userName')?.textContent || 'Usuario',
        generatedAt: new Date().toISOString(),
        filters: {
          noveltyType: filters?.noveltyType,
          status: filters?.status,
          from: filters?.dateRange?.from?.toISOString(),
          to: filters?.dateRange?.to?.toISOString(),
        },
      }

      if (format === 'pdf') {
        if (exportToPDF) {
          await exportToPDF(meta)
          onClose()
        } else {
          // fallback to server PDF generation
          const filterInput: any = {}
          if (filters) {
            if (filters.noveltyType) filterInput.noveltyType = filters.noveltyType
            if (filters.status) filterInput.status = filters.status
            if (filters.dateRange?.from) filterInput.from = filters.dateRange.from.toISOString()
            if (filters.dateRange?.to) filterInput.to = filters.dateRange.to.toISOString()
          }
          const result = await generatePdfReport({ variables: { filter: Object.keys(filterInput).length ? filterInput : undefined } });
          if (result.data?.generatePdfWithNovelties?.data) {
            const base64Pdf = result.data.generatePdfWithNovelties.data;
            const filename = `reporte_novedades.pdf`;
            downloadPdfFromBase64(base64Pdf, filename);
            onClose();
          } else {
            alert('Error: No se pudo generar el PDF. Revise la consola para más detalles.');
          }
        }
      } else {
        if (exportToExcel) {
          await exportToExcel(meta)
          onClose()
        } else {
          alert('Formato Excel aún no implementado');
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 font-inter p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-200 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header mejorado */}
        <div className="bg-gradient-to-r from-darkGreen to-emerald-600 dark:from-blue-800 dark:to-blue-900 p-8 rounded-t-2xl relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <Image
                  src="/icons/report.svg"
                  width={28}
                  height={28}
                  alt="Generar Reporte"
                  className="invert"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Generar Reporte de Novedades</h2>
                <p className="text-white/90 text-sm leading-relaxed max-w-md">
                  Configure el período de tiempo y el formato de exportación para su reporte personalizado
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Image
                src="/icons/x-symbol.svg"
                width={20}
                height={20}
                alt="Cerrar"
                className="invert"
              />
            </button>
          </div>
        </div>

        {/* Content area mejorado */}
        <div className="p-8 space-y-8">
          {/* Format Selection Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-darkGreen to-emerald-600 dark:from-blue-800 dark:to-blue-900 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-black">Formato de Exportación</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex items-center p-4 border-2 border-gray-200 dark:border-gray-300 rounded-xl cursor-pointer hover:border-darkGreen hover:bg-gray-50 dark:hover:bg-gray-100 transition-all duration-200 group">
                <input
                  type="radio"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                  format === 'pdf' 
                    ? 'border-darkGreen bg-darkGreen' 
                    : 'border-gray-300 group-hover:border-darkGreen'
                }`}>
                  {format === 'pdf' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <span className="font-medium text-gray-700 dark:text-black">PDF</span>
                </div>
              </label>
              
              <label className="relative flex items-center p-4 border-2 border-gray-200 dark:border-gray-300 rounded-xl cursor-pointer hover:border-darkGreen hover:bg-gray-50 dark:hover:bg-gray-100 transition-all duration-200 group">
                <input
                  type="radio"
                  value="excel"
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                  format === 'excel' ? 'border-darkGreen bg-darkGreen' : 'border-gray-300 group-hover:border-darkGreen'
                }`}>
                  {format === 'excel' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <span className="font-medium text-gray-700 dark:text-black">Excel</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer mejorado */}
        <div className="bg-gray-50 dark:bg-gray-300 px-8 py-6 rounded-b-2xl border-t border-gray-100 dark:border-gray-400">
          <div className="flex justify-end space-x-4">
            <button
              className="px-8 py-3 bg-white dark:bg-white text-gray-700 dark:text-black rounded-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 dark:border-gray-300 shadow-sm hover:shadow-md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              className={`px-8 py-3 bg-darkGreen hover:bg-hoverGreen text-white rounded-xl transition-all duration-200 flex items-center font-medium dark:bg-gray-400 dark:hover:bg-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="mr-3 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Image
                  src="/icons/report.svg"
                  width={20}
                  height={20}
                  alt="Generar"
                  className="mr-3 invert"
                />
              )}
              {isLoading ? 'Generando...' : 'Generar Reporte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
