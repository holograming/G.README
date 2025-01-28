// src/components/readme-generator.tsx
"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X } from 'lucide-react';

interface ReadmeGeneratorProps {
  onGenerate: (data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
    license: {
      type: string;
      author: string;
    };
    markdown: string;
  }) => void;
}

export function ReadmeGenerator({ onGenerate }: ReadmeGeneratorProps) {
  // State 관리
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [license, setLicense] = useState({
    type: 'MIT',
    author: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const content = await file.text();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent: content,
          fileName: file.name,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const analysis = await response.json();
      
      if (file.name.endsWith('.json')) {
        const packageJson = JSON.parse(content);
        setProjectName(packageJson.name || '');
        setDescription(packageJson.description || '');
      }

      if (analysis.techStack) {
        setTechStack(analysis.techStack);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze file');
    } finally {
      setIsAnalyzing(false);
    }
  };

  
  const handleGenerate = async () => {
    if (!projectName || !description) {
      setError('Project name and description are required');
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          description,
          features,
          techStack,
          license,
          shouldAnalyze: features.length === 0 && techStack.length === 0
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate README');
      }
  
      const { markdown } = await response.json();
      
      // README 다운로드
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
      // 폼 초기화
      setProjectName('');
      setDescription('');
      setFeatures([]);
      setTechStack([]);
      setNewFeature('');
      setNewTech('');
      setLicense({
        type: 'MIT',
        author: ''
      });
  
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Features 관리
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Tech Stack 관리
  const addTech = () => {
    if (newTech.trim()) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      {isAnalyzing ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 w-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Analyzing File</h3>
              <p className="text-sm text-gray-400">Please wait...</p>
            </div>
          </Card>
        </div>
      ) : null}

      {/* 파일 업로드 */}
      <Card className="mb-6 p-4">
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            accept=".json,.gradle,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              Click to upload project file
            </p>
          </label>
        </div>
      </Card>

      {/* 프로젝트 정보 */}
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">Project Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Project Name
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what your project does"
              className="h-32"
            />
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Features</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {features.map((feature, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {feature}
                <button
                  onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add new feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newFeature.trim()) {
                  addFeature();
                }
              }}
            />
            <Button size="sm" onClick={addFeature}>Add</Button>
          </div>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tech Stack</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {techStack.map((tech, index) => (
              <span 
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tech}
                <button
                  onClick={() => setTechStack(techStack.filter((_, i) => i !== index))}
                  className="hover:text-green-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add technology"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTech.trim()) {
                  addTech();
                }
              }}
            />
            <Button size="sm" onClick={addTech}>Add</Button>
          </div>
        </div>
      </Card>

      {/* License */}
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">License</h2>
        <div className="space-y-4">
          <Select
            value={license.type}
            onValueChange={(type) => setLicense({ ...license, type })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select license" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MIT">MIT License</SelectItem>
              <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
              <SelectItem value="GPL-3.0">GNU GPL v3</SelectItem>
              <SelectItem value="BSD-3-Clause">BSD 3-Clause</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Author name"
            value={license.author}
            onChange={(e) => setLicense({ ...license, author: e.target.value })}
          />
        </div>
      </Card>

      {/* Generate Button */}
      <Button 
        className="w-full"
        onClick={handleGenerate}
        disabled={isLoading || isAnalyzing}
      >
        {isLoading ? 'Generating...' : 'Generate README'}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}