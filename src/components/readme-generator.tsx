// src/components/readme-generator.tsx
"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type LicenseType } from '@/lib/types';

import { FileUploader } from './common/FileUploader';
import { ProjectInfoSection } from './sections/ProjectInfoSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { TechStackSection } from './sections/TechStackSection';
import { LicenseSection } from './sections/LicenseSection';
import { DependenciesSection } from './sections/DependenciesSection';
import { InstallationSection } from './sections/InstallationSection';
import { UsageSection } from './sections/UsageSection';
import { CollapsibleSection } from './sections/CollapsibleSection';
import { AlertCircle } from 'lucide-react';

interface ReadmeGeneratorProps {
  onGenerate: (data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
    license: {
      type: string;
      author: string;
      year: string;
    };
    dependencies?: { name: string; version: string; }[];
    installation?: string[];
    usage?: string[];
  }) => void;
}

export default function ReadmeGenerator({ onGenerate }: ReadmeGeneratorProps) {
  // 기본 상태
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [license, setLicense] = useState({
    type: 'MIT' as LicenseType,
    author: '',
    year: new Date().getFullYear().toString()
  });
  
  // 분석 결과 상태
  const [analyzedFeatures, setAnalyzedFeatures] = useState<string[]>([]);
  const [analyzedData, setAnalyzedData] = useState<{
    dependencies?: { name: string; version: string; }[];
    installation?: string[];
    usage?: string[];
  }>({});
  
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState(false);
  
  // 프로젝트 정보 섹션으로 스크롤하기 위한 ref
  const projectInfoRef = useRef<HTMLDivElement>(null);

  // 검증 오류 발생 시 프로젝트 정보 섹션으로 스크롤
  useEffect(() => {
    if (validationError && projectInfoRef.current) {
      projectInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [validationError]);

  // 파일 분석 결과 처리
  const handleFileAnalyzed = (analysis: {
    projectName?: string;
    description?: string;
    techStack?: string[];
    features?: string[];
    dependencies?: { name: string; version: string; type?: string }[];
    installation?: string[];
    usage?: string[];
  }) => {
    console.log('파일 분석 결과:', analysis);
    
    if (analysis.projectName) setProjectName(analysis.projectName);
    if (analysis.description) setDescription(analysis.description);
    if (analysis.techStack) setTechStack(analysis.techStack);
    if (analysis.features) {
      setAnalyzedFeatures(analysis.features);
    }
    
    // 분석된 데이터 저장
    setAnalyzedData({
      dependencies: analysis.dependencies,
      installation: analysis.installation,
      usage: analysis.usage,
    });
  };

  // 분석된 기능 추가
  const handleAddAnalyzedFeature = (feature: string) => {
    if (!features.includes(feature)) {
      setFeatures([...features, feature]);
      // 추가된 기능은 분석된 목록에서 제거
      setAnalyzedFeatures(analyzedFeatures.filter(f => f !== feature));
    }
  };

  // README 생성 처리
  const handleGenerate = () => {
    // 필수 입력 검증
    if (!projectName.trim() || !description.trim()) {
      setError('프로젝트 이름과 설명은 필수입니다');
      setValidationError(true);
      return;
    }

    setError(null);
    setValidationError(false);
    onGenerate({
      projectName,
      description,
      features,
      techStack,
      license,
      // 분석된 데이터도 포함
      dependencies: analyzedData.dependencies,
      installation: analyzedData.installation,
      usage: analyzedData.usage
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <FileUploader
        onFileAnalyzed={handleFileAnalyzed}
        onError={setError}
      />

      {/* 상단 검증 오류 알림 */}
      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            필수 입력 항목을 작성해주세요
          </AlertDescription>
        </Alert>
      )}

      {/* 프로젝트 정보 섹션은 항상 열려있음 */}
      <div ref={projectInfoRef}>
        <ProjectInfoSection
          projectName={projectName}
          description={description}
          onProjectNameChange={setProjectName}
          onDescriptionChange={setDescription}
          hasError={validationError}
        />
      </div>

      {/* 나머지 섹션은 접을 수 있게 수정 */}
      <CollapsibleSection title="주요 기능" defaultOpen={false}>
        <FeaturesSection
          features={features}
          onAddFeature={(feature) => setFeatures([...features, feature])}
          onRemoveFeature={(index) => setFeatures(features.filter((_, i) => i !== index))}
          analyzedFeatures={analyzedFeatures}
          onAddAnalyzedFeatures={handleAddAnalyzedFeature}
        />
      </CollapsibleSection>

      <CollapsibleSection title="기술 스택" defaultOpen={false}>
        <TechStackSection
          techStack={techStack}
          onAddTech={(tech) => setTechStack([...techStack, tech])}
          onRemoveTech={(index) => setTechStack(techStack.filter((_, i) => i !== index))}
        />
      </CollapsibleSection>

      <CollapsibleSection title="라이선스" defaultOpen={false}>
        <LicenseSection
          license={license}
          onLicenseChange={setLicense}
        />
      </CollapsibleSection>

      {analyzedData.dependencies && analyzedData.dependencies.length > 0 && (
        <CollapsibleSection title="의존성" defaultOpen={false}>
          <DependenciesSection dependencies={analyzedData.dependencies} />
        </CollapsibleSection>
      )}
      
      {analyzedData.installation && analyzedData.installation.length > 0 && (
        <CollapsibleSection title="설치 방법" defaultOpen={false}>
          <InstallationSection installation={analyzedData.installation} />
        </CollapsibleSection>
      )}
      
      {analyzedData.usage && analyzedData.usage.length > 0 && (
        <CollapsibleSection title="사용 방법" defaultOpen={false}>
          <UsageSection usage={analyzedData.usage} />
        </CollapsibleSection>
      )}

      <Button 
        className="w-full mt-6"
        onClick={handleGenerate}
      >
        README 생성하기
      </Button>

      {error && !validationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}