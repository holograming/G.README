// generation-progress.tsx
"use client"

import { useState } from 'react';
import ReadmeGenerator from '@/components/readme-generator';
import { GenerationProgress } from '@/components/generation-progress';
import { ReadmeResult } from '@/components/readme-result';

type PageState = 'input' | 'generating' | 'success';
type GenerationStep = 'analyzing' | 'generating' | 'formatting' | 'failed';

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
  const [lastGenerationData, setLastGenerationData] = useState<GeneratedData | null>(null);

  const handleGenerate = async (data: GeneratedData) => {
    try {
      setError(null);
      setLastGenerationData(data);
      setPageState('generating');
      
      // 분석 단계
      setGenerationStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // README 생성
      setGenerationStep('generating');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'README 생성에 실패했습니다');
      }

      const { markdown } = await response.json();
      
      // 포맷팅
      setGenerationStep('formatting');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 생성된 마크다운 저장 및 상태 변경
      setGeneratedMarkdown(markdown);
      setPageState('success');

    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'README 생성 중 오류가 발생했습니다');
      setGenerationStep('failed');
    }
  };

  const handleRetry = () => {
    if (lastGenerationData) {
      handleGenerate(lastGenerationData);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {pageState === 'input' && (
        <ReadmeGenerator onGenerate={handleGenerate} />
      )}
      
      {pageState === 'generating' && (
        <GenerationProgress 
          step={generationStep} 
          error={error}
          onRetry={handleRetry}
        />
      )}
      
      {pageState === 'success' && (
        <ReadmeResult 
          data={{
            projectName: lastGenerationData?.projectName || '',
            description: lastGenerationData?.description || '',
            features: lastGenerationData?.features || [],
            techStack: lastGenerationData?.techStack || [],
            markdown: generatedMarkdown
          }}
          onBack={() => setPageState('input')}
        />
      )}
    </main>
  );
}