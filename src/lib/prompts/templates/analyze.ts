// src/lib/prompts/templates/analyze.ts
import { AnalyzePromptData } from '../types';

export function generateAnalyzePrompt(data: AnalyzePromptData): string {
  const { fileContent, fileName } = data;
  
  return `You are a project analyzer that identifies technologies and features from project files.
    
Analyze the following ${fileName} file and extract:
1. Technologies used (programming languages, frameworks, libraries)
2. Project features or capabilities

File content:
\`\`\`
${fileContent}
\`\`\`

Respond ONLY with a JSON object in this exact format:
{
  "techStack": ["technology1", "technology2", ...],
  "features": ["feature1", "feature2", ...]
}`;
}