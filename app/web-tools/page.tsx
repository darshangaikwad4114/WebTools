'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Wrench, 
  Code, 
  Palette, 
  Zap, 
  Globe, 
  Search,
  Shield,
  BarChart3,
  Eye,
  Clock,
  ArrowRight,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AuthModal from '@/components/AuthModal';

export default function WebTools() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('url-analyzer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const { user } = useAuth();

  const toolCategories = [
    {
      title: 'Development Tools',
      icon: Code,
      gradient: 'from-blue-600 to-cyan-600',
      tools: [
        { name: 'Code Formatter', description: 'Format and beautify your code', icon: Code },
        { name: 'JSON Validator', description: 'Validate and format JSON data', icon: Code },
        { name: 'Base64 Encoder', description: 'Encode/decode Base64 strings', icon: Code },
        { name: 'URL Encoder', description: 'Encode/decode URLs safely', icon: Code },
      ],
    },
    {
      title: 'Design Utilities',
      icon: Palette,
      gradient: 'from-purple-600 to-pink-600',
      tools: [
        { name: 'Color Picker', description: 'Pick and convert colors', icon: Palette },
        { name: 'Gradient Generator', description: 'Create beautiful gradients', icon: Palette },
        { name: 'Font Pairing', description: 'Find perfect font combinations', icon: Palette },
        { name: 'Image Optimizer', description: 'Optimize images for web', icon: Palette },
      ],
    },
    {
      title: 'SEO & Analytics',
      icon: BarChart3,
      gradient: 'from-green-600 to-emerald-600',
      tools: [
        { name: 'Keyword Research', description: 'Find the best keywords', icon: Search },
        { name: 'Meta Tag Generator', description: 'Generate SEO meta tags', icon: Globe },
        { name: 'Site Speed Test', description: 'Test website performance', icon: Zap },
        { name: 'Sitemap Generator', description: 'Generate XML sitemaps', icon: Globe },
      ],
    },
    {
      title: 'Security Tools',
      icon: Shield,
      gradient: 'from-red-600 to-orange-600',
      tools: [
        { name: 'Password Generator', description: 'Generate secure passwords', icon: Shield },
        { name: 'SSL Checker', description: 'Check SSL certificate status', icon: Shield },
        { name: 'Hash Generator', description: 'Generate MD5, SHA hashes', icon: Shield },
        { name: 'QR Code Generator', description: 'Create QR codes instantly', icon: Shield },
      ],
    },
  ];

  const featuredTools = [
    {
      id: 'url-analyzer',
      title: 'Website Speed Test',
      description: 'Analyze your website performance and get optimization suggestions',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      id: 'password-generator',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable options',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'color-picker',
      title: 'Color Picker',
      description: 'Pick colors and generate beautiful color palettes',
      icon: Palette,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const [toolInputs, setToolInputs] = useState({
    'url-analyzer': { url: '' },
    'password-generator': { 
      length: 12, 
      includeUppercase: true, 
      includeLowercase: true, 
      includeNumbers: true, 
      includeSymbols: false 
    },
    'color-picker': { hex: '#3B82F6' },
  });

  const handleToolSubmit = async (toolName: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate tool execution with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let mockResult;
      
      switch (toolName) {
        case 'url-analyzer':
          mockResult = {
            seoScore: Math.floor(Math.random() * 40) + 60,
            performance: Math.floor(Math.random() * 30) + 70,
            recommendations: [
              'Optimize images for faster loading',
              'Add meta descriptions to all pages',
              'Improve internal linking structure',
              'Add structured data markup'
            ]
          };
          break;
          
        case 'password-generator':
          const length = toolInputs['password-generator'].length;
          const chars = {
            lower: 'abcdefghijklmnopqrstuvwxyz',
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*'
          };
          
          let availableChars = '';
          if (toolInputs['password-generator'].includeLowercase) availableChars += chars.lower;
          if (toolInputs['password-generator'].includeUppercase) availableChars += chars.upper;
          if (toolInputs['password-generator'].includeNumbers) availableChars += chars.numbers;
          if (toolInputs['password-generator'].includeSymbols) availableChars += chars.symbols;
          
          let password = '';
          for (let i = 0; i < length; i++) {
            password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
          }
          
          mockResult = {
            password,
            strength: length >= 12 ? 'Strong' : length >= 8 ? 'Medium' : 'Weak'
          };
          break;
          
        case 'color-picker':
          const hex = toolInputs['color-picker'].hex;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          
          mockResult = {
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 100)}%, ${Math.floor(Math.random() * 100)}%)`,
            complementary: '#' + (0xFFFFFF - parseInt(hex.slice(1), 16)).toString(16).padStart(6, '0'),
            analogous: ['#FF6B6B', '#4ECDC4']
          };
          break;
          
        default:
          mockResult = { message: 'Tool executed successfully' };
      }

      setResults(mockResult);
      toast.success('Tool executed successfully!');
    } catch (error: any) {
      toast.error('Failed to execute tool');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const renderToolInterface = () => {
    switch (activeTab) {
      case 'url-analyzer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={toolInputs['url-analyzer'].url}
                onChange={(e) => setToolInputs(prev => ({
                  ...prev,
                  'url-analyzer': { url: e.target.value }
                }))}
              />
            </div>
            <Button 
              onClick={() => handleToolSubmit('url-analyzer')}
              disabled={loading || !toolInputs['url-analyzer'].url}
              className="w-full"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              Analyze Website
            </Button>
            
            {results && activeTab === 'url-analyzer' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Analysis Results</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-2xl font-bold text-green-600">{results.seoScore}</div>
                    <div className="text-sm text-gray-600">SEO Score</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-2xl font-bold text-blue-600">{results.performance}</div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations:</h4>
                  {results.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="text-sm text-gray-600">• {rec}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'password-generator':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="length">Password Length</Label>
              <Input
                id="length"
                type="number"
                min="4"
                max="50"
                value={toolInputs['password-generator'].length}
                onChange={(e) => setToolInputs(prev => ({
                  ...prev,
                  'password-generator': { 
                    ...prev['password-generator'], 
                    length: parseInt(e.target.value) 
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {[
                  { key: 'includeUppercase', label: 'Include Uppercase (A-Z)' },
                  { key: 'includeLowercase', label: 'Include Lowercase (a-z)' },
                  { key: 'includeNumbers', label: 'Include Numbers (0-9)' },
                  { key: 'includeSymbols', label: 'Include Symbols (!@#$...)' },
                ].map(option => (
                  <label key={option.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={toolInputs['password-generator'][option.key as keyof typeof toolInputs['password-generator']]}
                      onChange={(e) => setToolInputs(prev => ({
                        ...prev,
                        'password-generator': {
                          ...prev['password-generator'],
                          [option.key]: e.target.checked
                        }
                      }))}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => handleToolSubmit('password-generator')}
              disabled={loading}
              className="w-full"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              Generate Password
            </Button>
            
            {results && activeTab === 'password-generator' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Generated Password</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(results.password)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="font-mono text-lg p-3 bg-white rounded border">
                  {results.password}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Strength: <span className={`font-medium ${
                    results.strength === 'Strong' ? 'text-green-600' : 
                    results.strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{results.strength}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'color-picker':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hex">Hex Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="hex"
                  placeholder="#3B82F6"
                  value={toolInputs['color-picker'].hex}
                  onChange={(e) => setToolInputs(prev => ({
                    ...prev,
                    'color-picker': { hex: e.target.value }
                  }))}
                />
                <input
                  type="color"
                  value={toolInputs['color-picker'].hex}
                  onChange={(e) => setToolInputs(prev => ({
                    ...prev,
                    'color-picker': { hex: e.target.value }
                  }))}
                  className="w-12 h-10 rounded border"
                />
              </div>
            </div>
            
            <Button 
              onClick={() => handleToolSubmit('color-picker')}
              disabled={loading}
              className="w-full"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Palette className="w-4 h-4 mr-2" />}
              Analyze Color
            </Button>
            
            {results && activeTab === 'color-picker' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Color Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>HEX:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{results.hex}</span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(results.hex)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RGB:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{results.rgb}</span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(results.rgb)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HSL:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{results.hsl}</span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(results.hsl)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Color Palette</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div 
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: results.hex }}
                      ></div>
                      <span className="text-xs">Original</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: results.complementary }}
                      ></div>
                      <span className="text-xs">Complementary</span>
                    </div>
                    {results.analogous.map((color: string, index: number) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-full h-12 rounded border"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-xs">Analogous {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Tool</h3>
            <p className="text-gray-600">Choose a tool from the featured tools above to get started.</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" />
                <span>Professional Web Tools</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Web Tools
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A comprehensive suite of web development tools to streamline your workflow, 
                improve your site&apos;s performance, and boost productivity.
              </p>
            </motion.div>

            {/* Featured Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {featuredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card 
                      className={`h-full border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                        activeTab === tool.id ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-green-200'
                      }`}
                      onClick={() => setActiveTab(tool.id)}
                    >
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${tool.color}`} />
                        </div>
                        <CardTitle className="text-lg font-bold">{tool.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Tool Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    <span>Tool Interface</span>
                  </CardTitle>
                  <CardDescription>
                    Use the selected tool with real-time results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderToolInterface()}
                </CardContent>
              </Card>
            </motion.div>

            {/* Tool Categories */}
            <div className="space-y-12">
              {toolCategories.map((category, categoryIndex) => {
                const CategoryIcon = category.icon;
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + categoryIndex * 0.2 }}
                  >
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${category.gradient} text-white px-6 py-3 rounded-full mb-4`}>
                        <CategoryIcon className="w-5 h-5" />
                        <span className="font-semibold">{category.title}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {category.tools.map((tool, toolIndex) => {
                        const ToolIcon = tool.icon;
                        return (
                          <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + categoryIndex * 0.2 + toolIndex * 0.1 }}
                            whileHover={{ y: -5 }}
                          >
                            <Card className="h-full border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg cursor-pointer group">
                              <CardHeader>
                                <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center mb-3 transition-colors">
                                  <ToolIcon className="w-5 h-5 text-gray-600" />
                                </div>
                                <CardTitle className="text-base font-semibold group-hover:text-blue-600 transition-colors">
                                  {tool.name}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                  {tool.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                  <Clock className="w-3 h-3 mr-2" />
                                  Coming Soon
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-20 text-center"
            >
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Need a Custom Tool?</CardTitle>
                  <CardDescription className="text-green-100">
                    Can&apos;t find what you&apos;re looking for? Let us know what tool you need and we&apos;ll build it for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                    Request a Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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