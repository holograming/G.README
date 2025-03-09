// src/app/page.tsx
"use client"

import { useState } from 'react';
import ReadmeGenerator from '@/components/readme-generator';
import { ReadmeResult } from '@/components/readme-result';
import { GenerationProgress } from '@/components/generation-progress';

type PageState = 'input' | 'generating' | 'result';

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('input');
  const [generationStep, setGenerationStep] = useState<'analyzing' | 'generating' | 'formatting'>('analyzing');
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<{
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
    markdown?: string;
  } | null>(null);

  const handleGenerate = async (data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
    license: {
      type: string;
      author: string;
      year: string;
    };
  }) => {
    try {
      setPageState('generating');
      setGenerationStep('generating');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('README 생성에 실패했습니다');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedData({
        projectName: data.projectName,
        description: data.description,
        features: data.features,
        techStack: data.techStack,
        markdown: result.markdown,
      });

      setPageState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      setPageState('result');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {pageState === 'input' && (
        <ReadmeGenerator onGenerate={handleGenerate} />
      )}
      {pageState === 'generating' && (
        <GenerationProgress step={generationStep} />
      )}
      {pageState === 'result' && generatedData && (
        <ReadmeResult
          data={generatedData}
          error={error}
          onBack={() => setPageState('input')}
          onRetry={() => {
            setError(null);
            setPageState('input');
          }}
        />
      )}
    </main>
  );
}