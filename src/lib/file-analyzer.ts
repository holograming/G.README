// src/lib/file-analyzer.ts
import { type LicenseType } from '@/lib/types';

interface AnalysisResult {
  techStack?: string[];
  features?: string[];
  dependencies?: {
    name: string;
    version: string;
  }[];
  installation?: string[];
  usage?: string[];
  license?: {
    type: LicenseType;
    author?: string;
    year?: string;
  };
  projectName?: string;    // 추가
  description?: string;    // 추가
}

// 파일 분석 함수
export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const content = await file.text();
  
  // package.json 파일 분석
  if (file.name.endsWith('.json')) {
    try {
      const packageJson = JSON.parse(content);
      const dependencies: {
        name: string;
        version: string;
      }[] = [];
      
      // 의존성 정보 추출
      if (packageJson.dependencies) {
        Object.entries(packageJson.dependencies).forEach(([name, version]) => {
          dependencies.push({
            name,
            version: (version as string).replace('^', ''),
          });
        });
      }

      // Claude API를 통한 추가 분석
      const analysis = await analyzeByClaude(content, file.name);
      
      return {
        ...analysis,
        projectName: packageJson.name,
        description: packageJson.description,
        dependencies: dependencies.length > 0 ? dependencies : undefined
      };
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
  
  // 다른 파일들은 Claude로 분석
  return analyzeByClaude(content, file.name);
}

// Claude API를 통한 분석
async function analyzeByClaude(content: string, fileName: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent: content, fileName }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze file');
    }

    const result = await response.json();
    
    // 빈 객체를 기본값으로 설정
    const analysis: AnalysisResult = {};
    
    // 각 정보가 있을 때만 포함
    if (result.techStack?.length > 0) {
      analysis.techStack = result.techStack;
    }
    
    if (result.features?.length > 0) {
      analysis.features = result.features;
    }
    
    if (result.dependencies?.length > 0) {
      analysis.dependencies = result.dependencies;
    }
    
    if (result.installation?.length > 0) {
      analysis.installation = result.installation;
    }
    
    if (result.usage?.length > 0) {
      analysis.usage = result.usage;
    }

    return analysis;
    
  } catch (error) {
    console.error('Error in Claude analysis:', error);
    throw new Error('Failed to analyze file');
  }
}