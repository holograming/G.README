// src/lib/prompts/types.ts
export interface GeneratePromptData {
    projectInfo: {
      name: string;
      shortDescription: string;
      detailedDescription: string;
    };
    features: {
      title: string;
      description: string;
      example?: string;
    }[];
    techStack: {
      name: string;
      version: string;
      category: 'Frontend' | 'Backend' | 'DevOps' | 'Other';
      purpose: string;
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