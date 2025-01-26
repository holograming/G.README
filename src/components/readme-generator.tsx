import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Upload } from 'lucide-react';

interface ReadmeGeneratorProps {
  onGenerate: (data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
  }) => void;
}

export const ReadmeGenerator = ({ onGenerate }: ReadmeGeneratorProps) => {
  // State 관리
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newStack, setNewStack] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);

  // 미리 정의된 기능들
  const commonFeatures = [
    'Authentication',
    'REST API',
    'Database Integration',
    'File Upload',
    'Real-time Updates',
    'Search Functionality',
    'User Management',
    'Responsive Design'
  ];

  // 미리 정의된 기술 스택
  const commonStacks = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'TailwindCSS'
  ];

  // 기능 추가 핸들러
  const handleAddFeature = () => {
    if (newFeature.trim() && !selectedFeatures.includes(newFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // 기술 스택 추가 핸들러
  const handleAddStack = () => {
    if (newStack.trim() && !selectedStack.includes(newStack.trim())) {
      setSelectedStack([...selectedStack, newStack.trim()]);
      setNewStack('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">G.README Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 입력 폼 */}
          <Card className="p-4">
            <div className="space-y-6">
              {/* 파일 업로드 영역 */}
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".json,.gradle,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Optional: Upload project file to auto-fill
                  </p>
                  <p className="text-xs text-gray-500">
                    (package.json, build.gradle, CMakeLists.txt)
                  </p>
                </label>
              </div>

              {/* 프로젝트 이름 입력 */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Project Name
                </label>
                <Input 
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              {/* 프로젝트 설명 입력 */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Project Description
                </label>
                <Textarea 
                  placeholder="Describe your project..."
                  className="h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* 기능 선택 영역 */}
              <div>
                <label className="text-sm font-medium mb-2 block">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedFeatures.map((feature) => (
                    <span 
                      key={feature}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => setSelectedFeatures(
                          selectedFeatures.filter(f => f !== feature)
                        )}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add custom feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button onClick={handleAddFeature} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => {
                        if (selectedFeatures.includes(feature)) {
                          setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                        } else {
                          setSelectedFeatures([...selectedFeatures, feature]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        selectedFeatures.includes(feature)
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 기술 스택 선택 영역 */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedStack.map((stack) => (
                    <span 
                      key={stack}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {stack}
                      <button
                        onClick={() => setSelectedStack(
                          selectedStack.filter(s => s !== stack)
                        )}
                        className="hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add custom tech stack"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStack()}
                  />
                  <Button onClick={handleAddStack} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonStacks.map((stack) => (
                    <button
                      key={stack}
                      onClick={() => {
                        if (selectedStack.includes(stack)) {
                          setSelectedStack(selectedStack.filter(s => s !== stack));
                        } else {
                          setSelectedStack([...selectedStack, stack]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        selectedStack.includes(stack)
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {stack}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 생성 버튼 */}
              <Button 
                className="w-full" 
                onClick={() => onGenerate({
                  projectName,
                  description,
                  features: selectedFeatures,
                  techStack: selectedStack
                })}
              >
                Generate README
              </Button>
            </div>
          </Card>

          {/* 프리뷰 영역 */}
          <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview</h3>
              <Button variant="outline" size="sm">Copy Markdown</Button>
            </div>
            <div className="prose max-w-none bg-white rounded-lg p-4 h-[600px] overflow-y-auto">
              <div className="text-gray-500">
                Generated README will appear here...
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReadmeGenerator;