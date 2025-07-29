export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const getFileIcon = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return '🖼️';
  if (mimetype === 'application/pdf') return '📄';
  if (mimetype.includes('word')) return '📝';
  return '📎';
};

export const getStatusColor = (status: string, result?: string | null): string => {
  if (status === 'pending') return 'text-warning-600 bg-warning-50 border-warning-200';
  if (status === 'scanned') {
    if (result === 'clean') return 'text-success-600 bg-success-50 border-success-200';
    if (result === 'infected') return 'text-danger-600 bg-danger-50 border-danger-200';
  }
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getStatusText = (status: string, result?: string | null): string => {
  if (status === 'pending') return 'Scanning...';
  if (status === 'scanned') {
    if (result === 'clean') return 'Clean';
    if (result === 'infected') return 'Infected';
  }
  return 'Unknown';
};

export const isValidFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  return allowedTypes.includes(file.type);
};

export const getFileTypeError = (file: File): string | null => {
  if (!isValidFileType(file)) {
    return `File type "${file.type}" is not allowed. Please upload PDF, DOCX, JPG, or PNG files.`;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return `File "${file.name}" is too large. Maximum size is 5MB.`;
  }
  
  return null;
};