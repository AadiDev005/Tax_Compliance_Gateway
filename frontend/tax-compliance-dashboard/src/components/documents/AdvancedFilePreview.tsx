import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, File, X, Eye, Download, CheckCircle, Clock } from 'lucide-react';

interface ProcessedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    taxAmount: number;
    compliance: number;
    jurisdiction: string;
    validationErrors?: string[];
  };
}

const AdvancedFilePreview: React.FC = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate processing for each file
    newFiles.forEach(processFile);
  }, []);

  const processFile = (fileData: ProcessedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, progress: Math.min(progress, 100) } : f
      ));

      if (progress >= 100) {
        clearInterval(interval);
        
        // Move to processing
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'processing', progress: 100 } : f
        ));

        // Complete processing
        setTimeout(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? {
              ...f,
              status: 'completed',
              result: {
                taxAmount: Math.random() * 10000 + 1000,
                compliance: 90 + Math.random() * 10,
                jurisdiction: ['DE', 'IT', 'MX', 'FR'][Math.floor(Math.random() * 4)],
                validationErrors: Math.random() > 0.7 ? ['Missing VAT number', 'Invalid date format'] : undefined
              }
            } : f
          ));
        }, 2000);
      }
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/json': ['.json'],
      'text/xml': ['.xml'],
      'application/xml': ['.xml'],
      'text/csv': ['.csv'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
      case 'uploading':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <X className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-16 w-16 mb-6 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <div className="text-xl font-medium text-gray-900 mb-3">
          {isDragActive ? 'Drop files here!' : 'Drag & drop documents'}
        </div>
        <div className="text-gray-600 mb-6">
          Support for PDF, JSON, XML, CSV, and images up to 10MB each
        </div>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Multi-format support
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Real-time processing
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Batch validation
          </div>
        </div>
      </div>

      {/* File List and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-6">Processing Queue ({files.length} files)</h3>
            
            <div className="space-y-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.file);
                return (
                  <div
                    key={file.id}
                    className={`p-4 border rounded-xl transition-all cursor-pointer hover:shadow-md ${
                      selectedFile?.id === file.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <FileIcon className="w-10 h-10 text-gray-400" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.file.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{file.file.type.split('/')[1]?.toUpperCase()}</span>
                            <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>{new Date().toLocaleString()}</span>
                          </div>
                          
                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <div className="mt-3">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Uploading... {Math.round(file.progress)}%
                              </div>
                            </div>
                          )}

                          {/* Validation Results */}
                          {file.result?.validationErrors && (
                            <div className="mt-2 text-xs text-red-600">
                              Validation issues: {file.result.validationErrors.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(file.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          file.status === 'completed' ? 'bg-green-100 text-green-800' :
                          file.status === 'processing' || file.status === 'uploading' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {files.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm">Upload documents to see processing results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* File Preview Panel */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold mb-4">File Details & Preview</h3>
          
          {selectedFile ? (
            <div className="space-y-6">
              {/* File Info */}
              <div className="text-center">
                {selectedFile.preview ? (
                  <img
                    src={selectedFile.preview}
                    alt={selectedFile.file.name}
                    className="max-w-full h-48 object-contain mx-auto rounded-lg border"
                  />
                ) : (
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border">
                    <FileText className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedFile.file.name}</h4>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Type: {selectedFile.file.type}</div>
                  <div>Size: {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB</div>
                  <div>Status: {selectedFile.status}</div>
                </div>
              </div>

              {/* Processing Results */}
              {selectedFile.result && (
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Processing Results</h5>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tax Amount:</span>
                        <span className="font-semibold">${selectedFile.result.taxAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Compliance Score:</span>
                        <span className="font-semibold">{selectedFile.result.compliance.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Jurisdiction:</span>
                        <span className="font-semibold">{selectedFile.result.jurisdiction}</span>
                      </div>
                    </div>

                    {selectedFile.result.validationErrors && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="text-sm font-medium text-red-800 mb-1">Validation Issues:</div>
                        <ul className="text-sm text-red-600 space-y-1">
                          {selectedFile.result.validationErrors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <File className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a file to preview</p>
              <p className="text-sm">Click on any file in the list to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilePreview;
