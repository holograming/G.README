
// components/common/FileUploader.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { LoadingOverlay } from './LoadingOverlay';
import { type LicenseType } from '@/lib/types';

interface FileUploaderProps {
    onFileAnalyzed: (analysis: {
      projectName?: string;
      description?: string;
      techStack?: string[];
      license?: {
        type: LicenseType;
        author?: string;
        year?: string;
      };
    }) => void;
    onError: (error: string) => void;
  }

export function FileUploader({ onFileAnalyzed, onError }: FileUploaderProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const content = await file.text();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent: content,
          fileName: file.name,
        }),
      });

      if (!response.ok) throw new Error('분석에 실패했습니다');

      const analysis = await response.json();
      
      if (file.name.endsWith('.json')) {
        const packageJson = JSON.parse(content);
        analysis.projectName = packageJson.name || '';
        analysis.description = packageJson.description || '';
      }

      onFileAnalyzed(analysis);
    } catch (error) {
      onError(error instanceof Error ? error.message : '파일 분석 중 오류가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="mb-6 p-4">
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <input
          type="file"
          accept=".json,.xml,.yaml,.yml,.gradle,.properties,.env,.txt,.kts"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">프로젝트 파일 업로드</p>
          <p className="text-xs text-gray-500">
            (package.json, build.gradle, kts, CMakeLists.txt, pom.xml etc)
          </p>
        </label>
      </div>
      {isAnalyzing && <LoadingOverlay />}
    </Card>
  );
}