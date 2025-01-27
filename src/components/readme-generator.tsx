"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { analyzeFile } from '@/lib/file-analyzer';

interface ReadmeGeneratorProps {
  onGenerate: (data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
  }) => void;
}

export default function ReadmeGenerator({ onGenerate }: ReadmeGeneratorProps) {
  // 기본 상태 관리
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newStack, setNewStack] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // 파일 업로드 처리
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      const content = await file.text();

      // package.json 파일 처리
      if (file.name.endsWith('.json')) {
        try {
          const packageJson = JSON.parse(content);
          if (packageJson.name) setProjectName(packageJson.name);
          if (packageJson.description) setDescription(packageJson.description);

          // API를 통한 파일 분석
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileContent: content,
              fileName: file.name,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to analyze file');
          }

          const analysis = await response.json();
          
          // 기술 스택 업데이트
          if (analysis.techStack) {
            setSelectedStack(prev => {
              const newStack = [...prev];
              analysis.techStack.forEach((tech: string) => {
                if (!newStack.includes(tech)) {
                  newStack.push(tech);
                }
              });
              return newStack;
            });
          }

          // 기능 업데이트
          if (analysis.features) {
            setSelectedFeatures(prev => {
              const newFeatures = [...prev];
              analysis.features.forEach((feature: string) => {
                if (!newFeatures.includes(feature)) {
                  newFeatures.push(feature);
                }
              });
              return newFeatures;
            });
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
          setError('Failed to parse package.json file');
          return;
        }
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze file');
    } finally {
      setIsLoading(false);
    }
  };

  // 기능 추가/제거 핸들러
  const handleAddFeature = () => {
    if (newFeature.trim() && !selectedFeatures.includes(newFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // 기술 스택 추가/제거 핸들러
  const handleAddStack = () => {
    if (newStack.trim() && !selectedStack.includes(newStack.trim())) {
      setSelectedStack([...selectedStack, newStack.trim()]);
      setNewStack('');
    }
  };

  // README 생성 처리
  const handleGenerate = async () => {
    if (!projectName.trim() || !description.trim()) {
      setError('Project name and description are required');
      return;
    }

    try {
      setIsLoading(true);
      onGenerate({
        projectName,
        description,
        features: selectedFeatures,
        techStack: selectedStack,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">README Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="space-y-6">
              {/* 파일 업로드 영역 */}
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
                    Optional: Upload project file to auto-fill
                  </p>
                  <p className="text-xs text-gray-500">
                    (package.json, build.gradle, CMakeLists.txt)
                  </p>
                </label>
              </div>

              {/* 프로젝트 정보 입력 */}
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
                  placeholder="Describe your project..."
                  className="h-32"
                />
              </div>

              {/* 기능 입력 영역 */}
              <div>
                <label className="text-sm font-medium mb-2 block">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedFeatures.map((feature) => (
                    <span 
                      key={feature}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => setSelectedFeatures(
                          selectedFeatures.filter(f => f !== feature)
                        )}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add custom feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button onClick={handleAddFeature} size="sm">Add</Button>
                </div>

              </div>
              
              {/* 기술 스택 입력 영역 */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedStack.map((stack) => (
                    <span 
                      key={stack}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {stack}
                      <button
                        onClick={() => setSelectedStack(
                          selectedStack.filter(s => s !== stack)
                        )}
                        className="hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add custom tech stack"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStack()}
                  />
                  <Button onClick={handleAddStack} size="sm">Add</Button>
                </div>

              </div>
              
              {/* 생성 버튼 및 에러 메시지 */}
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate README'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          {/* 프리뷰 영역 */}
          <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview</h3>
            </div>
            <div className="prose max-w-none bg-white rounded-lg p-4 h-[600px] overflow-y-auto">
              <div className="text-gray-500">
                Generated README will appear here...
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}