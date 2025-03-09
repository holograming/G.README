// src/components/sections/ProjectInfoSection.tsx
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ProjectInfoSectionProps {
  projectName: string;
  description: string;
  onProjectNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  hasError?: boolean; // 에러 상태를 prop으로 받음
}

export function ProjectInfoSection({
  projectName,
  description,
  onProjectNameChange,
  onDescriptionChange,
  hasError = false // 기본값은 false
}: ProjectInfoSectionProps) {
  const [isNameBlinking, setIsNameBlinking] = useState(false);
  const [isDescBlinking, setIsDescBlinking] = useState(false);

  // 에러 상태가 변경될 때 깜박임 효과 트리거
  useEffect(() => {
    if (hasError) {
      // 프로젝트 이름이 비어있으면 깜박임 효과 시작
      if (!projectName.trim()) {
        setIsNameBlinking(true);
        // 3초 후 깜박임 효과 중지
        const timer = setTimeout(() => setIsNameBlinking(false), 3000);
        return () => clearTimeout(timer);
      }
      
      // 설명이 비어있으면 깜박임 효과 시작
      if (!description.trim()) {
        setIsDescBlinking(true);
        // 3초 후 깜박임 효과 중지
        const timer = setTimeout(() => setIsDescBlinking(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasError, projectName, description]);

  return (
    <Card className="mb-6 p-4">
      <h2 className="text-xl font-bold mb-4">프로젝트 정보</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            프로젝트 이름 <span className="text-red-500">*</span>
          </label>
          <Input
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="프로젝트 이름을 입력하세요"
            className={cn(
              isNameBlinking && "animate-pulse border-2 border-red-500",
              !projectName.trim() && hasError && "border-red-300 bg-red-50"
            )}
          />
          {!projectName.trim() && hasError && (
            <p className="mt-1 text-sm text-red-500">프로젝트 이름은 필수입니다</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            설명 <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="프로젝트에 대한 설명을 입력하세요"
            className={cn(
              "h-32",
              isDescBlinking && "animate-pulse border-2 border-red-500",
              !description.trim() && hasError && "border-red-300 bg-red-50"
            )}
          />
          {!description.trim() && hasError && (
            <p className="mt-1 text-sm text-red-500">프로젝트 설명은 필수입니다</p>
          )}
        </div>
      </div>
    </Card>
  );
}