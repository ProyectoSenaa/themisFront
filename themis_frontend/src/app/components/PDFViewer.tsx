"use client"

import React, { useState, useEffect } from "react"
import { IoCloseOutline, IoDownloadOutline, IoExpandOutline } from 'react-icons/io5'

interface PDFViewerProps {
  pdfUrl?: string
  isOpen: boolean
  onClose: () => void
  title?: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  pdfUrl, 
  isOpen, 
  onClose, 
  title = "Documento PDF" 
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (pdfUrl) {
      setLoading(true)
      setError(null)
      
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [pdfUrl])

  const getPdfSrc = (input?: string) => {
    if (!input) return ''

    let value = input.trim()

    if (value.startsWith('{') && value.endsWith('}')) {
      try {
        const parsed = JSON.parse(value)
        if (parsed && typeof parsed.data === 'string') {
          value = parsed.data
        }
      } catch (e) {
        // ignore
      }
    }

    if (value.startsWith('data:')) return value

    const base64Regex = /^[A-Za-z0-9+/=\n\r]+$/
    const isMaybeBase64 = value.length > 200 && base64Regex.test(value.replace(/\s+/g, ''))
    if (isMaybeBase64) {
      return `data:application/pdf;base64,${value.replace(/\s+/g, '')}`
    }

    return value
  }

  const pdfSrc = getPdfSrc(pdfUrl)

  if (!isOpen) return null

  const handleDownload = () => {
    if (!pdfUrl) return

    const src = getPdfSrc(pdfUrl)
    if (src.startsWith('data:application/pdf;base64,')) {
      try {
        const base64 = src.split('base64,')[1]
        const binary = atob(base64)
        const len = binary.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } catch (e) {
        setError('Error al descargar el PDF')
      }
      return
    }

    try {
      const link = document.createElement('a')
      link.href = src
      link.download = `${title}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      setError('Error al descargar el PDF')
    }
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] max-w-[1400px] max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>
          
          {/* Controles */}
          <div className="flex items-center space-x-2">
            {pdfUrl && (
              <>
                <button
                  onClick={zoomOut}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="Reducir zoom"
                >
                  -
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="Aumentar zoom"
                >
                  +
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="Descargar PDF"
                >
                  <IoDownloadOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="Abrir en nueva pestaña"
                >
                  <IoExpandOutline className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
              title="Cerrar"
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          </div>
        </div>


        <div className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100 p-8 overflow-hidden flex items-center justify-center relative">
          {loading && pdfUrl ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
  
                  <div className="relative flex items-center justify-center mb-6">

                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200">
                      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-transparent border-bg-gradient-to-r from-[#398f0d]animate-spin"></div>
                    </div>
                    
        
                    <div className="absolute animate-spin rounded-full h-10 w-10 border-2 border-gray-100" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}>
                      <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-2 border-transparent border-t-blue-400"></div>
                    </div>
                    
                   
                    <div className="absolute h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  
               
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Cargando documento
                    </h3>
                    
                      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-4 mx-auto">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-lg">
                <div className="text-center text-red-600">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-semibold mb-2">Error al cargar el documento</p>
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              </div>
            </div>
          ) : !pdfUrl ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 shadow-sm">
                <div className="text-center text-gray-500">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xl font-medium mb-3">No hay documento PDF para mostrar</p>
                  <p className="text-sm text-gray-400">Seleccione un archivo para visualizar</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <div
                className="bg-white shadow-xl rounded-lg overflow-hidden flex items-center justify-center border border-gray-200"
                style={{ width: '1100px', maxWidth: '100%', height: '80vh', transform: `scale(${scale})`, transformOrigin: 'center center' }}
              >
                <iframe
                  src={`${pdfSrc}#toolbar=1&navpanes=1&scrollbar=1`}
                  style={{ width: '100%', height: '100%', border: '0' }}
                  title={title}
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setError('No se pudo cargar el documento PDF')
                    setLoading(false)
                  }}
                />
              </div>
            </div>
          )}

          {/* Efectos decorativos para loading */}
          {loading && pdfUrl && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/20 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '0.7s', animationDuration: '2.5s'}}></div>
              <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-200/25 rounded-full animate-bounce" style={{animationDelay: '1.4s', animationDuration: '3s'}}></div>
              <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-500/20 rounded-full animate-bounce" style={{animationDelay: '0.3s', animationDuration: '2.2s'}}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFViewer