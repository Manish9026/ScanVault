import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadAPI } from '../services/api';
import { getFileTypeError, formatFileSize } from '../utils/fileUtils';
import toast from 'react-hot-toast';

interface UploadZoneProps {
  onUploadComplete: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newUploads: UploadFile[] = files.map(file => {
      const error = getFileTypeError(file);
      return {
        file,
        id: Math.random().toString(36).substring(2),
        progress: 0,
        status: error ? 'error' : 'pending',
        error
      };
    });

    setUploads(prev => [...prev, ...newUploads]);

    // Start uploading valid files
    const validUploads = newUploads.filter(upload => !upload.error);
    if (validUploads.length > 0) {
      uploadFiles(validUploads);
    }

    // Show errors for invalid files
    newUploads.forEach(upload => {
      if (upload.error) {
        toast.error(upload.error);
      }
    });
  }, []);

  const uploadFiles = useCallback(async (uploadsToProcess: UploadFile[]) => {
    // const fileList = new FileList();
    const dataTransfer = new DataTransfer();
    
    uploadsToProcess.forEach(upload => {
      dataTransfer.items.add(upload.file);
    });
    
    // Update status to uploading
    setUploads(prev => prev.map(upload => 
      uploadsToProcess.find(u => u.id === upload.id)
        ? { ...upload, status: 'uploading' as const }
        : upload
    ));

    try {
      await uploadAPI.uploadFiles(dataTransfer.files, (progress) => {
        setUploads(prev => prev.map(upload => 
          uploadsToProcess.find(u => u.id === upload.id)
            ? { ...upload, progress }
            : upload
        ));
      });

      // Mark as completed
      setUploads(prev => prev.map(upload => 
        uploadsToProcess.find(u => u.id === upload.id)
          ? { ...upload, status: 'completed' as const, progress: 100 }
          : upload
      ));

      toast.success(`Successfully uploaded ${uploadsToProcess.length} file(s)`);
      onUploadComplete();

      // Clear completed uploads after 3 seconds
      setTimeout(() => {
        setUploads(prev => prev.filter(upload => 
          !uploadsToProcess.find(u => u.id === upload.id)
        ));
      }, 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploads(prev => prev.map(upload => 
        uploadsToProcess.find(u => u.id === upload.id)
          ? { ...upload, status: 'error' as const, error: errorMessage }
          : upload
      ));

      toast.error(errorMessage);
    }
  }, [onUploadComplete]);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className={`
            mx-auto w-12 h-12 flex items-center justify-center rounded-lg transition-colors
            ${isDragOver ? 'bg-primary-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-6 h-6 ${isDragOver ? 'text-primary-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF, DOCX, JPG, PNG files up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Upload Progress</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploads.map(upload => (
              <UploadItem
                key={upload.id}
                upload={upload}
                onRemove={removeUpload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface UploadItemProps {
  upload: UploadFile;
  onRemove: (id: string) => void;
}

const UploadItem: React.FC<UploadItemProps> = ({ upload, onRemove }) => {
  const getStatusIcon = () => {
    switch (upload.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-danger-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (upload.status) {
      case 'completed':
        return 'border-success-200 bg-success-50';
      case 'error':
        return 'border-danger-200 bg-danger-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border ${getStatusColor()}`}>
      {getStatusIcon()}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {upload.file.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(upload.file.size)}
          </p>
        </div>
        
        {upload.status === 'error' && upload.error && (
          <p className="text-xs text-danger-600 mt-1">{upload.error}</p>
        )}
        
        {(upload.status === 'uploading' || upload.status === 'pending') && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </div>
        )}
        
        {upload.status === 'completed' && (
          <p className="text-xs text-success-600 mt-1">
            Upload completed • Scan in progress...
          </p>
        )}
      </div>
      
      <button
        onClick={() => onRemove(upload.id)}
        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};