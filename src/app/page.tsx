"use client"

import { useState } from 'react';
import ReadmeGenerator from '@/components/readme-generator';
import { GenerationProgress } from '@/components/generation-progress';
import { ReadmeResult } from '@/components/readme-result';

type PageState = 'input' | 'generating' | 'success';

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
  const [generationStep, setGenerationStep] = useState<'analyzing' | 'generating' | 'formatting'>('analyzing');
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');

  const handleGenerate = async (data: GeneratedData) => {
    try {
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
        throw new Error('Failed to generate README');
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
      setPageState('input');
      // TODO: 에러 처리
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
      
      {pageState === 'success' && (
        <ReadmeResult 
          data={{
            projectName: '',
            description: '',
            features: [],
            techStack: [],
            markdown: generatedMarkdown
          }}
          onBack={() => setPageState('input')}
        />
      )}
    </main>
  );
}