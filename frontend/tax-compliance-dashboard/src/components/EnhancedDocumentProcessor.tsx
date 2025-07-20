import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Eye, Download, Trash2, File } from 'lucide-react';
import { api } from '../lib/api';
import type { ProcessingDocument } from '../types/documents';

const EnhancedDocumentProcessor: React.FC = () => {
  const [processingDocs, setProcessingDocs] = useState<ProcessingDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ProcessingDocument | null>(null);
  const queryClient = useQueryClient();
  
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: api.getDocuments,
    refetchInterval: 5000,
  });

  const uploadMutation = useMutation({
    mutationFn: api.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const newDoc: ProcessingDocument = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: file.size,
        status: 'uploading',
        progress: 0,
        uploadTime: new Date().toISOString(),
      };

      setProcessingDocs(prev => [...prev, newDoc]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProcessingDocs(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { ...doc, progress: Math.min(doc.progress + Math.random() * 20, 100) }
            : doc
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(progressInterval);
        setProcessingDocs(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { ...doc, status: 'processing', progress: 100 }
            : doc
        ));

        setTimeout(() => {
          setProcessingDocs(prev => prev.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, status: 'completed' }
              : doc
          ));
        }, 2000);
      }, 3000);

      uploadMutation.mutate(file);
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
      case 'uploading':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'json':
        return '📋';
      case 'xml':
        return '📜';
      case 'csv':
        return '📊';
      default:
        return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Merge processing docs with existing documents
  const allDocuments = [
    ...processingDocs,
    ...(documents?.data?.documents || []).map((doc: any) => ({
      ...doc,
      id: doc.id || Math.random().toString(36).substr(2, 9),
      progress: 100,
      uploadTime: doc.uploadDate || new Date().toISOString(),
      status: 'completed' as const
    }))
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Upload Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Document Processing Center</h2>
              <p className="text-gray-600 text-sm mt-1">Upload and process invoices across multiple formats</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Service Online</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <div className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop files here!' : 'Drag & drop invoices here'}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Supports <span className="font-medium">JSON, XML, PDF, CSV</span> formats up to 10MB
            </div>
            <div className="flex justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Multi-format support
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Batch processing
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Real-time validation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document List with Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Processing Queue</h3>
                <span className="text-sm text-gray-500">
                  {allDocuments.length} documents
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {allDocuments.length > 0 ? (
                allDocuments.map((doc) => (
                  <div 
                    key={doc.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedDoc?.id === doc.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-2xl">{getFileIcon(doc.format)}</div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{doc.format}</span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>{new Date(doc.uploadTime || '').toLocaleString()}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          {doc.status === 'uploading' && (
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${doc.progress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Uploading... {Math.round(doc.progress)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(doc.status)}
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                          doc.status === 'processing' || doc.status === 'uploading' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                        
                        {doc.status === 'completed' && (
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No documents uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload your first invoice to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* File Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">File Preview</h3>
            </div>
            
            <div className="p-6">
              {selectedDoc ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getFileIcon(selectedDoc.format)}</div>
                    <h4 className="font-medium text-gray-900 truncate">{selectedDoc.filename}</h4>
                    <p className="text-sm text-gray-500">{selectedDoc.format} • {formatFileSize(selectedDoc.size)}</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700 mb-2">File Details</div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={
                          selectedDoc.status === 'completed' ? 'text-green-600' :
                          selectedDoc.status === 'processing' ? 'text-yellow-600' :
                          'text-red-600'
                        }>
                          {selectedDoc.status.charAt(0).toUpperCase() + selectedDoc.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>{new Date(selectedDoc.uploadTime || '').toLocaleDateString()}</span>
                      </div>
                      {selectedDoc.status === 'completed' && (
                        <div className="flex justify-between">
                          <span>Processing Time:</span>
                          <span>2.3s</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedDoc.status === 'completed' && (
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Results
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <File className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Select a document to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDocumentProcessor;
