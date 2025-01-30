// src/lib/file-analyzer.ts

interface AnalysisResult {
  techStack: string[];
  features: string[];
  projectName?: string;
  description?: string;
}

// 파일 분석 함수
export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const content = await file.text();
  
  // package.json 파일 기본 정보 추출
  if (file.name.endsWith('.json')) {
    try {
      const packageJson = JSON.parse(content);
      // Claude API를 통한 분석
      const analysis = await analyzeByClaude(content, file.name);
      
      return {
        ...analysis,
        projectName: packageJson.name,
        description: packageJson.description,
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
    return {
      techStack: result.techStack || [],
      features: result.features || [],
    };
  } catch (error) {
    console.error('Error in Claude analysis:', error);
    throw new Error('Failed to analyze file');
  }
}