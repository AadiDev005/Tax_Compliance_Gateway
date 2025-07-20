import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

const DocumentProcessor: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);

  const { data: documents, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
    refetchInterval: 5000,
  });

  const uploadMutation = useMutation({
    mutationFn: api.uploadDocument,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadMutation.mutate(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-warning-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-danger-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-badge status-success';
      case 'processing':
        return 'status-badge status-warning';
      case 'pending':
        return 'status-badge bg-gray-100 text-gray-600';
      default:
        return 'status-badge status-danger';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Upload & Processing</h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-900 mb-2">
            Drop invoices here or click to upload
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Supports JSON, XML, and PDF formats
          </div>
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".json,.xml,.pdf"
          />
          <label
            htmlFor="file-upload"
            className="btn-primary cursor-pointer inline-block"
          >
            Choose File
          </label>
        </div>

        {uploadMutation.isPending && (
          <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-primary-700 text-sm">Uploading document...</p>
          </div>
        )}

        {uploadMutation.isError && (
          <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger-700 text-sm">Upload failed. Please try again.</p>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
        
        {documents?.data?.documents?.length > 0 ? (
          <div className="space-y-3">
            {documents.data.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.filename}</p>
                    <p className="text-sm text-gray-500">
                      {doc.format.toUpperCase()} • {(doc.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <span className={getStatusBadge(doc.status)}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default DocumentProcessor;
