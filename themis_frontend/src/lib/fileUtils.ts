// Utility functions for handling evidence files in FollowUp cases

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToBlob = (base64: string, mimeType: string = 'application/octet-stream'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const downloadBase64File = (base64: string, filename: string, mimeType: string = 'application/octet-stream') => {
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateFile = (file: File, maxSize: number = 5 * 1024 * 1024): { isValid: boolean; error?: string } => {
  // Validate file size (default 5MB)
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `El archivo "${file.name}" es demasiado grande. Tamaño máximo permitido: ${Math.round(maxSize / 1024 / 1024)}MB. Tamaño actual: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`
    };
  }
  
  // Validate file type
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `El tipo de archivo "${file.type}" no está permitido. Tipos permitidos: JPG, PNG, GIF, PDF, TXT, DOC, DOCX`
    };
  }
  
  return { isValid: true };
};

// New function to get file type icon for notifications
export const getFileTypeIcon = (file: File): string => {
  if (file.type.startsWith('image/')) return '🖼️';
  if (file.type === 'application/pdf') return '📄';
  if (file.type.includes('word') || file.type === 'text/plain') return '📝';
  return '📎';
};

// New function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
