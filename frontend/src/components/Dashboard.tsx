import React from 'react';
import { UploadZone } from './UploadZone';
import { FileList } from './FileList';
import { useFiles } from '../hooks/useFiles';

export const Dashboard: React.FC = () => {
  const { files, loading, refreshFiles } = useFiles(true, 10000);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Malware Scanner Dashboard
        </h1>
        <p className="text-gray-600">
          Upload files to scan for malware and view scan results in real-time.
        </p>
      </div>

      <UploadZone onUploadComplete={refreshFiles} />
      
      <FileList 
        files={files}
        loading={loading}
        onRefresh={refreshFiles}
      />
    </div>
  );
};