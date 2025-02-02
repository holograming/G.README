// src/components/readme-generator.tsx
"use client"

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X } from 'lucide-react';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_PROJECT_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

interface GeneratorData {
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
  license: {
    type: string;
    author: string;
  };
}

interface ReadmeGeneratorProps {
  onGenerate: (data: GeneratorData) => Promise<void>;
}

export default function ReadmeGenerator({ onGenerate }: ReadmeGeneratorProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      if (!response.ok) throw new Error('파일 분석에 실패했습니다');

      const analysis = await response.json();
      
      if (file.name.endsWith('.json')) {
        const packageJson = JSON.parse(content);
        setProjectName((packageJson.name || '').slice(0, MAX_PROJECT_NAME_LENGTH));
        setDescription((packageJson.description || '').slice(0, MAX_DESCRIPTION_LENGTH));
      }

      if (analysis.techStack) {
        setTechStack(analysis.techStack);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : '파일 분석 중 오류가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!projectName || !description) {
      setError('프로젝트 이름과 설명은 필수입니다');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await onGenerate({
        projectName,
        description,
        features,
        techStack,
        license,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '생성 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  }, [newFeature]);

  const addTech = useCallback(() => {
    if (newTech.trim()) {
      setTechStack(prev => [...prev, newTech.trim()]);
      setNewTech('');
    }
  }, [newTech]);

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const removeTech = (index: number) => {
    setTechStack(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 w-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">파일 분석 중</h3>
              <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
            </div>
          </Card>
        </div>
      )}

      {/* 파일 업로드 */}
      <Card className="mb-6 p-4">
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            accept=".json,.xml,.yaml,.yml,.gradle,.properties,.env,.txt,.kts"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isAnalyzing}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              프로젝트 파일 업로드 (최대 1MB)
            </p>
            <p className="text-xs text-gray-500">
              (package.json, build.gradle, pom.xml etc)
            </p>
          </label>
        </div>
      </Card>

      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">프로젝트 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              프로젝트 이름 ({projectName.length}/{MAX_PROJECT_NAME_LENGTH})
            </label>
            <Input
              value={projectName}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_PROJECT_NAME_LENGTH) {
                  setProjectName(newValue);
                }
              }}
              placeholder="프로젝트 이름을 입력하세요"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              설명 ({description.length}/{MAX_DESCRIPTION_LENGTH})
            </label>
            <Textarea
              value={description}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(newValue);
                }
              }}
              placeholder="프로젝트에 대한 설명을 입력하세요"
              className="h-32"
            />
          </div>
        </div>
      </Card>

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
                  onClick={() => removeFeature(index)}
                  className="hover:text-blue-600"
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
            />
            <Button 
              size="sm" 
              onClick={addFeature}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
      </Card>

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
                  onClick={() => removeTech(index)}
                  className="hover:text-green-600"
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
            />
            <Button 
              size="sm" 
              onClick={addTech}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">라이선스</h2>
        <div className="space-y-4">
          <Select
            value={license.type}
            onValueChange={(type) => setLicense({ ...license, type })}
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
          />
        </div>
      </Card>

      <Button 
        className="w-full"
        onClick={handleGenerate}
        disabled={isSubmitting || isAnalyzing}
      >
        {isSubmitting ? '생성 중...' : 'README 생성하기'}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}