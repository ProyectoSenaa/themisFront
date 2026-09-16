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

export const validateFile = (file: File, maxSize: number = 5 * 1024 * 1024): boolean => {
  // Validate file size (default 5MB)
  if (file.size > maxSize) {
    alert(`El archivo es demasiado grande. Tamaño máximo permitido: ${maxSize / 1024 / 1024}MB`);
    return false;
  }
  
  // Validate file type
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    alert('Tipo de archivo no permitido. Tipos permitidos: imágenes, PDF, documentos de texto');
    return false;
  }
  
  return true;
};
