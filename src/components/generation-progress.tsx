"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, FileText, Wand2, FileCheck } from 'lucide-react';

type GenerationStep = 'analyzing' | 'generating' | 'formatting';

interface GenerationProgressProps {
  step: GenerationStep;
}

export function GenerationProgress({ step }: GenerationProgressProps) {
  const steps = [
    { id: 'analyzing', label: '프로젝트 분석 중', icon: FileText },
    { id: 'generating', label: 'README 생성 중', icon: Wand2 },
    { id: 'formatting', label: '문서 변환 중', icon: FileCheck },
  ];

  // 현재 단계의 인덱스
  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">README 생성 중</h2>
          <p className="text-gray-500">잠시만 기다려주세요...</p>
        </div>

        <div className="space-y-6">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isComplete = index < currentStepIndex;

            return (
              <div
                key={s.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50' : 
                  isComplete ? 'bg-green-50' : 
                  'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive ? 'bg-blue-100' : 
                  isComplete ? 'bg-green-100' : 
                  'bg-gray-100'
                }`}>
                  {isActive ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : (
                    <Icon className={`w-6 h-6 ${
                      isComplete ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isActive ? 'text-blue-900' :
                    isComplete ? 'text-green-900' :
                    'text-gray-500'
                  }`}>
                    {s.label}
                  </p>
                  {isActive && (
                    <p className="text-sm text-blue-600 mt-1">
                      {s.id === 'analyzing' && '프로젝트 파일과 입력 정보를 분석하고 있습니다...'}
                      {s.id === 'generating' && 'AI를 통해 README 내용을 생성하고 있습니다...'}
                      {s.id === 'formatting' && '마크다운 문서로 변환하고 있습니다...'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </Card>
    </div>
  );
}