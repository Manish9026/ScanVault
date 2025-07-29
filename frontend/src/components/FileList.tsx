import React, { useState } from 'react';
import { FileText, Shield, AlertTriangle, Clock, Filter, RefreshCw, Eye, X } from 'lucide-react';
import { FileMetadata } from '../types';
import { formatFileSize, formatDate, getFileIcon, getStatusColor, getStatusText } from '../utils/fileUtils';

interface FileListProps {
  files: FileMetadata[];
  loading: boolean;
  onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, loading, onRefresh }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'clean' | 'infected'>('all');
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

  const filteredFiles = files.filter(file => {
    switch (filter) {
      case 'pending':
        return file.status === 'pending';
      case 'clean':
        return file.result === 'clean';
      case 'infected':
        return file.result === 'infected';
      default:
        return true;
    }
  });

  const getFilterCount = (filterType: typeof filter) => {
    switch (filterType) {
      case 'pending':
        return files.filter(f => f.status === 'pending').length;
      case 'clean':
        return files.filter(f => f.result === 'clean').length;
      case 'infected':
        return files.filter(f => f.result === 'infected').length;
      default:
        return files.length;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Scanned Files</h2>
            
            <div className="flex items-center space-x-1">
              {[
                { key: 'all' as const, label: 'All', icon: FileText },
                { key: 'pending' as const, label: 'Pending', icon: Clock },
                { key: 'clean' as const, label: 'Clean', icon: Shield },
                { key: 'infected' as const, label: 'Infected', icon: AlertTriangle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`
                    flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${filter === key
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">
                    {getFilterCount(key)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading files...</span>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === 'all' ? 'No files uploaded yet' : `No ${filter} files found`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onClick={() => setSelectedFile(file)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <FileDetailModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

interface FileItemProps {
  file: FileMetadata;
  onClick: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onClick }) => {
  const statusColor = getStatusColor(file.status, file.result);
  const statusText = getStatusText(file.status, file.result);

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="text-2xl">
            {getFileIcon(file.mimetype)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.originalName}
              </p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                {statusText}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>Uploaded {formatDate(file.uploadedAt)}</span>
              {file.scannedAt && (
                <>
                  <span>•</span>
                  <span>Scanned {formatDate(file.scannedAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {file.status === 'pending' && (
            <div className="flex items-center space-x-1 text-warning-600">
              <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse" />
              <span className="text-xs">Scanning...</span>
            </div>
          )}
          
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface FileDetailModalProps {
  file: FileMetadata;
  onClose: () => void;
}

const FileDetailModal: React.FC<FileDetailModalProps> = ({ file, onClose }) => {
  const statusColor = getStatusColor(file.status, file.result);
  const statusText = getStatusText(file.status, file.result);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">
              {getFileIcon(file.mimetype)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{file.originalName}</p>
              <p className="text-sm text-gray-500">{file.mimetype}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusColor}`}>
              {statusText}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">File Size</p>
              <p className="font-medium">{formatFileSize(file.size)}</p>
            </div>
            
            <div>
              <p className="text-gray-500">File ID</p>
              <p className="font-medium font-mono text-xs">{file.id}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Uploaded At</p>
              <p className="font-medium">{formatDate(file.uploadedAt)}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Scanned At</p>
              <p className="font-medium">
                {file.scannedAt ? formatDate(file.scannedAt) : 'Not scanned'}
              </p>
            </div>
          </div>
          
          {file.result === 'infected' && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-danger-600" />
                <p className="text-sm font-medium text-danger-800">
                  Malware Detected
                </p>
              </div>
              <p className="text-sm text-danger-700 mt-1">
                This file contains potentially malicious content and should not be opened.
              </p>
            </div>
          )}
          
          {file.result === 'clean' && (
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-success-600" />
                <p className="text-sm font-medium text-success-800">
                  File is Clean
                </p>
              </div>
              <p className="text-sm text-success-700 mt-1">
                No threats detected. This file appears to be safe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};