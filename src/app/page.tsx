// src/app/page.tsx
"use client"

import { useState, useCallback, useRef } from 'react';
import ReadmeGenerator from '@/components/readme-generator';
import { GenerationProgress } from '@/components/generation-progress';
import { ReadmeResult } from '@/components/readme-result';
import { useEffect } from 'react';

type PageState = 'input' | 'generating' | 'success' | 'error';

interface GeneratedData {
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
  license: {
    type: string;
    author: string;
  };
}

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('input');
  const [generationStep, setGenerationStep] = useState<GenerationStep>('analyzing');
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (data: GeneratedData) => {
    // 이미 생성 중이면 중복 요청 방지
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setError(null);
      setLastGenerationData(data);
      setPageState('generating');
      setError(null);
      
      setGenerationStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      setGenerationStep('generating');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: abortController.current.signal
      });

      if (!response.ok) {
        throw new Error('README 생성에 실패했습니다.');
      }

      const result = await response.json();
      if (!result || typeof result.markdown !== 'string') {
        throw new Error('잘못된 응답 형식입니다');
      }
      
      setGenerationStep('formatting');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGeneratedMarkdown(markdown);
      setPageState('success');

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // 의도적인 중단은 에러처리 하지 않음
      }
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'README 생성 중 오류가 발생했습니다.');
      setPageState('error');
    }
  }, [lastGenerationData, isGenerating, handleGenerate]);

  return (
    <main className="min-h-screen bg-gray-50">
      {pageState === 'input' && (
        <ReadmeGenerator 
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}
      
      {pageState === 'generating' && (
        <GenerationProgress 
          step={generationStep} 
          error={error}
          onRetry={handleRetry}
          isGenerating={isGenerating}
        />
      )}
      
      {(pageState === 'success' || pageState === 'error') && (
        <ReadmeResult 
          data={{
            projectName: lastGenerationData.projectName,
            description: lastGenerationData.description,
            features: lastGenerationData.features,
            techStack: lastGenerationData.techStack,
            markdown: generatedMarkdown
          }}
          error={error}
          onBack={() => {
            setPageState('input');
            setError(null);
          }}
          onRetry={() => {
            setError(null);
            setPageState('input');
          }}
        />
      )}
    </main>
  );
}