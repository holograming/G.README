// src/components/form/BasicInfoForm.tsx
'use client'

import { useState } from 'react';

const BasicInfoForm = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [readmeContent, setReadmeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const generateReadme = (name: string, description: string) => {
    return `# ${name}

${description}

## 설치 방법

\`\`\`bash
npm install
npm run dev
\`\`\`

## 라이선스

MIT`;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      setReadmeContent(generateReadme(projectName, projectDescription));
    } catch (error) {
      setError('README 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl mb-8">기본 정보</h1>
      
      <div className="space-y-4">
        <div>
          <div className="mb-2">프로젝트 이름</div>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2">프로젝트 설명</div>
          <textarea
            className="border rounded p-2 w-full"
            rows={4}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="border rounded px-4 py-2 disabled:opacity-50"
        >
          {isLoading ? '생성 중...' : 'README 생성'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {readmeContent && (
        <div className="mt-8 p-6 border rounded-lg">
          <pre className="whitespace-pre-wrap font-sans">{readmeContent}</pre>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-gray-500">
          README를 생성하고 있습니다...
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;