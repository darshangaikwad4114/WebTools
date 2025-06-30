'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  FileType, 
  Upload, 
  Download, 
  ArrowRight, 
  File, 
  Image as ImageIcon, 
  Video, 
  Music,
  Zap,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AuthModal from '@/components/AuthModal';

interface FileItem {
  file: File;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  downloadUrl?: string;
  progress: number;
}

export default function FileConversion() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useAuth();

  const fileTypes = [
    {
      icon: File,
      title: 'Documents',
      formats: ['PDF', 'DOCX', 'TXT', 'RTF', 'ODT'],
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: ImageIcon,
      title: 'Images',
      formats: ['JPG', 'PNG', 'GIF', 'WebP', 'SVG'],
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      icon: Video,
      title: 'Videos',
      formats: ['MP4', 'AVI', 'MOV', 'WebM', 'MKV'],
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      icon: Music,
      title: 'Audio',
      formats: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG'],
      gradient: 'from-orange-600 to-red-600',
    },
  ];

  const features = [
    'Lightning-fast conversion',
    'Batch processing support',
    'High-quality output',
    'Secure file handling',
    'No file size limits',
    'Cloud-based processing',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      file,
      targetFormat: 'PDF', // Default target format
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...fileItems]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateTargetFormat = (index: number, format: string) => {
    setFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, targetFormat: format } : item
    ));
  };

  const convertFile = async (fileItem: FileItem, index: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, status: 'converting', progress: 0 } : item
    ));

    try {
      // Simulate conversion progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((item, i) => {
          if (i === index && item.progress < 90) {
            return { ...item, progress: item.progress + 10 };
          }
          return item;
        }));
      }, 300);

      // Simulate conversion time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);

      // Mock successful conversion
      const mockDownloadUrl = `https://example.com/converted/${fileItem.file.name}.${fileItem.targetFormat.toLowerCase()}`;

      setFiles(prev => prev.map((item, i) => 
        i === index ? { 
          ...item, 
          status: 'completed', 
          progress: 100, 
          downloadUrl: mockDownloadUrl 
        } : item
      ));

      toast.success(`${fileItem.file.name} converted successfully!`);
    } catch (error: any) {
      setFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, status: 'error', progress: 0 } : item
      ));
      toast.error(`Failed to convert ${fileItem.file.name}`);
    }
  };

  const handleConvertAll = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await convertFile(files[i], i);
        // Add a small delay between conversions
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Header */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Ultra-Fast File Conversion</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  File Conversion
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Convert any file format in seconds. Support for documents, images, videos, 
                audio files, and more with enterprise-grade security.
              </p>
            </motion.div>

            {/* Supported File Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {fileTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="h-full border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="text-center">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.gradient} flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-lg font-bold">{type.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {type.formats.join(', ')}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* File Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileType className="w-5 h-5 text-blue-600" />
                    <span>File Converter</span>
                  </CardTitle>
                  <CardDescription>
                    Upload your files and choose the output format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                      isDragging
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                      </p>
                      <p className="text-gray-600">or</p>
                      <label className="inline-block">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button variant="outline" className="cursor-pointer">
                          Browse Files
                        </Button>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Supports all major file formats • Max 100MB per file
                    </p>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
                      <div className="space-y-3">
                        {files.map((fileItem, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <File className="w-5 h-5 text-gray-500" />
                                <div>
                                  <p className="font-medium text-gray-900">{fileItem.file.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <select 
                                  value={fileItem.targetFormat}
                                  onChange={(e) => updateTargetFormat(index, e.target.value)}
                                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                                  disabled={fileItem.status !== 'pending'}
                                >
                                  <option>PDF</option>
                                  <option>JPG</option>
                                  <option>PNG</option>
                                  <option>MP4</option>
                                  <option>MP3</option>
                                  <option>DOCX</option>
                                </select>
                                {fileItem.status === 'pending' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => convertFile(fileItem, index)}
                                  >
                                    Convert
                                  </Button>
                                )}
                                {fileItem.status === 'completed' && fileItem.downloadUrl && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(fileItem.downloadUrl, '_blank')}
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            {fileItem.status === 'converting' && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-gray-600">Converting...</span>
                                  <span className="text-sm text-gray-500">{fileItem.progress}%</span>
                                </div>
                                <Progress value={fileItem.progress} className="w-full" />
                              </div>
                            )}
                            
                            {/* Status Indicators */}
                            {fileItem.status === 'completed' && (
                              <div className="mt-2 flex items-center text-green-600">
                                <Check className="w-4 h-4 mr-1" />
                                <span className="text-sm">Conversion completed</span>
                              </div>
                            )}
                            
                            {fileItem.status === 'error' && (
                              <div className="mt-2 flex items-center text-red-600">
                                <X className="w-4 h-4 mr-1" />
                                <span className="text-sm">Conversion failed</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Convert All Button */}
                      {files.some(f => f.status === 'pending') && (
                        <div className="mt-6">
                          <Button 
                            onClick={handleConvertAll}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            Convert All Files
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16"
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle>Why Choose Our File Converter?</CardTitle>
                  <CardDescription>
                    Built for speed, security, and reliability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}