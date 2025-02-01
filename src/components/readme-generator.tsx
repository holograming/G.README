// src/components/readme-generator.tsx
"use client"

import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Plus, X } from 'lucide-react';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

interface ReadmeGeneratorProps {
  onGenerate: (data: GeneratedData) => void;
  isGenerating: boolean;
}

export default function ReadmeGenerator({ onGenerate, isGenerating }: ReadmeGeneratorProps) {
  // 상태 관리
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
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Features 관리
  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  }, [newFeature]);

  // Tech Stack 관리
  const addTech = useCallback(() => {
    if (newTech.trim()) {
      setTechStack(prev => [...prev, newTech.trim()]);
      setNewTech('');
    }
  }, [newTech]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기는 1MB를 초과할 수 없습니다.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const content = await file.text();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent: content,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        throw new Error('분석에 실패했습니다');
      }

      const result = await response.json();
      
      if (!result || typeof result.techStack === 'undefined') {
        throw new Error('잘못된 분석 결과입니다');
      }

      if (file.name.endsWith('.json')) {
        const packageJson = JSON.parse(content);
        setProjectName(packageJson.name || '');
        setDescription(packageJson.description || '');
      }

      if (result.techStack) {
        setTechStack(result.techStack);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : '파일 분석 중 오류가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!projectName || !description) {
      setError('프로젝트 이름과 설명은 필수입니다');
      return;
    }

    setError(null);
    onGenerate({
      projectName,
      description,
      features,
      techStack,
      license,
    });
  }, [projectName, description, features, techStack, license, onGenerate]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* File Upload */}
      <Card className="mb-6 p-4">
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            accept=".json,.xml,.yaml,.yml,.gradle,.properties,.env,.txt,.kts"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isGenerating}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              프로젝트 파일 업로드
            </p>
            <p className="text-xs text-gray-500">
              (package.json, build.gradle, pom.xml etc)
            </p>
          </label>
        </div>
      </Card>

      {/* Project Info */}
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">프로젝트 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              프로젝트 이름
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트 이름을 입력하세요"
              disabled={isGenerating}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              설명
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트에 대한 설명을 입력하세요"
              className="h-32"
              disabled={isGenerating}
            />
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">주요 기능</h2>
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
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="새로운 기능 추가"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newFeature.trim()) {
                  addFeature();
                }
              }}
              disabled={isGenerating}
            />
            <Button 
              size="sm" 
              onClick={addFeature}
              className="shrink-0"
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">기술 스택</h2>
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
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="기술 스택 추가"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTech.trim()) {
                  addTech();
                }
              }}
              disabled={isGenerating}
            />
            <Button 
              size="sm" 
              onClick={addTech}
              className="shrink-0"
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
      </Card>

      {/* License */}
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">라이선스</h2>
        <div className="space-y-4">
          <Select
            value={license.type}
            onValueChange={(type) => setLicense({ ...license, type })}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue placeholder="라이선스 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MIT">MIT License</SelectItem>
              <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
              <SelectItem value="GPL-3.0">GNU GPL v3</SelectItem>
              <SelectItem value="BSD-3-Clause">BSD 3-Clause</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="작성자 이름"
            value={license.author}
            onChange={(e) => setLicense({ ...license, author: e.target.value })}
            disabled={isGenerating}
          />
        </div>
      </Card>

      {/* Generate Button */}
      <Button 
        className="w-full"
        onClick={handleSubmit}
        disabled={isGenerating}
      >
        {isGenerating ? '생성 중...' : 'README 생성하기'}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}