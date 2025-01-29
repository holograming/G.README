"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';

interface ReadmeResultProps {
  data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
    markdown?: string;
  };
  onBack: () => void;
}

export function ReadmeResult({ data, onBack }: ReadmeResultProps) {
  const handleDownload = () => {
    if (data.markdown) {
      const blob = new Blob([data.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            README 생성 완료!
          </h2>
          <p className="text-gray-500">
            아래 버튼을 클릭하여 README.md 파일을 다운로드하세요
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            README 다운로드
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            새로 만들기
          </Button>
        </div>
      </Card>
    </div>
  );
}