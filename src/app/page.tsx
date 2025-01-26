"use client"

import { useState } from 'react';
import ReadmeGenerator from '@/components/readme-generator';
import ReadmeResult from '@/components/readme-result';

interface GeneratedData {
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
  markdown?: string;
}

export default function Home() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

  const handleGenerate = (data: GeneratedData) => {
    setGeneratedData(data);
    setStep('result');
  };

  const handleBack = () => {
    setStep('input');
  };

  return (
    <main>
      {step === 'input' ? (
        <ReadmeGenerator onGenerate={handleGenerate} />
      ) : (
        <ReadmeResult 
          data={generatedData} 
          onBack={handleBack}
        />
      )}
    </main>
  );
}