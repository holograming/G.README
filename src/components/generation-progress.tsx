// generation-progress.tsx
"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Wand2, FileCheck, AlertCircle } from 'lucide-react';

type GenerationStep = 'analyzing' | 'generating' | 'formatting' | 'failed';

interface GenerationProgressProps {
  step: GenerationStep;
  error?: string;
  onRetry?: () => void;
}

export function GenerationProgress({ step, error, onRetry }: GenerationProgressProps) {
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
          <h2 className="text-2xl font-bold">
            {step === 'failed' ? 'README 생성 실패' : 'README 생성 중'}
          </h2>
          <p className="text-gray-500">
            {step === 'failed' ? '생성 과정에서 오류가 발생했습니다' : '잠시만 기다려주세요...'}
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isComplete = index < currentStepIndex;
            const isFailed = step === 'failed' && s.id === steps[currentStepIndex]?.id;

            return (
              <div
                key={s.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  isFailed ? 'bg-red-50' :
                  isActive ? 'bg-blue-50' : 
                  isComplete ? 'bg-green-50' : 
                  'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isFailed ? 'bg-red-100' :
                  isActive ? 'bg-blue-100' : 
                  isComplete ? 'bg-green-100' : 
                  'bg-gray-100'
                }`}>
                  {isFailed ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : (
                    <Icon className={`w-6 h-6 ${
                      isComplete ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isFailed ? 'text-red-900' :
                    isActive ? 'text-blue-900' :
                    isComplete ? 'text-green-900' :
                    'text-gray-500'
                  }`}>
                    {s.label}
                  </p>
                  {(isActive || isFailed) && (
                    <p className={`text-sm mt-1 ${
                      isFailed ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {isFailed ? error || '오류가 발생했습니다' :
                       s.id === 'analyzing' && '프로젝트 파일과 입력 정보를 분석하고 있습니다...' ||
                       s.id === 'generating' && 'AI를 통해 README 내용을 생성하고 있습니다...' ||
                       s.id === 'formatting' && '마크다운 문서로 변환하고 있습니다...'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {step === 'failed' && (
          <div className="text-center">
            <Button 
              onClick={onRetry}
              variant="outline"
              className="mt-4"
            >
              다시 시도하기
            </Button>
          </div>
        )}

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              step === 'failed' ? 'bg-red-600' : 'bg-blue-600'
            }`}
            style={{ 
              width: step === 'failed' ? '100%' : 
                     `${((currentStepIndex + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </Card>
    </div>
  );
}