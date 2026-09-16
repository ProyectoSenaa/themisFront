import * as XLSX from 'xlsx';
import { CalendarEvent } from '../types';

export const parseExcelFile = (file: File): Promise<{ calendarSlots: CalendarEvent[]; errors: string[] }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const calendarSlots: CalendarEvent[] = [];
        const errors: string[] = [];

        if (jsonData.length < 2) {
          resolve({
            calendarSlots: [],
            errors: ["El archivo debe tener al menos una fila de encabezados y una fila de datos"],
          });
          return;
        }

        const headers = (jsonData[0] as string[]).map((h) => h?.toString().trim().toLowerCase());

        const columnMap = {
          date: ["date", "fecha"],
          hour: ["hour", "hora"],
          session: ["session", "sesion"],
          coordinationName: ["coordination_name", "coordinacion"],
        };

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.every((cell) => !cell)) continue;

          try {
            const slot: Partial<CalendarEvent> = { id: `slot-${Date.now()}-${i}` };

            headers.forEach((header, index) => {
              const cellValue = row[index]?.toString().trim();

              for (const [key, variations] of Object.entries(columnMap)) {
                if (variations.includes(header)) {
                  (slot as any)[key] = cellValue;
                  break;
                }
              }
            });

            // Validate required fields
            if (!slot.date || slot.date === '' ||
                !slot.hour || slot.hour === '' ||
                !slot.session || slot.session === '' ||
                !slot.coordinationName || slot.coordinationName === '') {
              throw new Error(`Fila ${i + 1}: Datos requeridos faltantes o inválidos`);
            }

            slot.title = `${slot.session} - ${slot.coordinationName}`;
            slot.time = slot.hour;
            calendarSlots.push(slot as CalendarEvent);
          } catch (error) {
            errors.push(error instanceof Error ? error.message : `Error en fila ${i + 1}`);
          }
        }

        resolve({ calendarSlots, errors });
      } catch (error) {
        resolve({
          calendarSlots: [],
          errors: ["Error al procesar el archivo Excel. Verifique que sea un archivo válido."],
        });
      }
    };

    reader.readAsArrayBuffer(file);
  });
};

export const downloadTemplate = () => {
  const templateData = [
    ["fecha", "hora", "sesion", "coordinacion"],
    ["2025-10-15", "09:00:00", "Ordinaria", "Coordinación Académica"],
    ["2025-10-16", "14:30:00", "Extraordinaria", "Coordinación de Bienestar"],
    ["2025-10-17", "08:30:00", "Ordinaria", "Coordinación de Sistemas"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla Comités");
  XLSX.writeFile(wb, "plantilla_comites.xlsx");
};

export const generateDefaultHours = (intervalMinutes = 30): string[] => {
  const start = 8 * 60; // minutes
  const end = 17 * 60;
  const result: string[] = [];
  
  for (let m = start; m <= end; m += intervalMinutes) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    result.push(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
  }
  
  return result;
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const normalizeString = (s: string): string => {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const normalizeBase64 = (s: string): string => {
  let b = s.trim();
  const idx = b.indexOf('base64,');
  if (idx >= 0) b = b.substring(idx + 'base64,'.length);
  b = b.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/[^A-Za-z0-9+/=]/g, '');
  const pad = b.length % 4;
  if (pad > 0) b = b + '='.repeat(4 - pad);
  return b;
};
