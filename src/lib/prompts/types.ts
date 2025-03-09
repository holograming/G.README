// src/lib/prompts/types.ts
export interface GeneratePromptData {
  projectInfo: {
    name: string;
    detailedDescription: string;
  };
  // features는 선택적으로 변경
  features?: {
    title: string;
    description: string;
    example?: string;
  }[];
  techStack: {
    name: string;
    version: string;
    // purpose 제거
  }[];
  // dependencies 섹션 추가
  dependencies?: {
    name: string;
    version: string;
  }[];
  license: {
    type: string;
    author: string;
    year: string;
    customText?: string;
  };
  installation?: {
    requirements?: string[];
    installation?: string[];
    configuration?: string;
    usage?: string;
  };
}


  export interface AnalyzePromptData {
    fileContent: string;
    fileName: string;
  }