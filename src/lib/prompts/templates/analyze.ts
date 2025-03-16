// src/lib/prompts/templates/analyze.ts
import { AnalyzePromptData } from '../types';
import { 
  getLicenseAnalysisPrompt, 
  getFeaturesAnalysisPrompt, 
  getBasicDependenciesPrompt,
  getFileSpecificInstructions 
} from '../modules';

export function generateAnalyzePrompt(data: AnalyzePromptData) {
  const { fileContent, fileName } = data;
  
  // 각 분석 항목별 프롬프트 모듈 가져오기
  const licensePrompt = getLicenseAnalysisPrompt();
  const featuresPrompt = getFeaturesAnalysisPrompt();
  const dependenciesPrompt = getBasicDependenciesPrompt();
  
  // 파일 유형별 특화 지시사항 가져오기
  const specificInstructions = getFileSpecificInstructions(fileName);
  
  return `You are a project file analyzer. Extract key functionality and features from the following ${fileName} file.

File content:
\`\`\`
${fileContent}
\`\`\`

Respond ONLY with a valid JSON object in this format:

{
  "projectName": "string (project name if found)",
  "description": "string (project description if found)",
  "techStack": [
    "string (technology name)"
  ],
  "analyzedFeatures": [
    "string (core functionality in 2-3 words)"
  ],
  "dependencies": [
    {
      "name": "string (dependency name)",
      "version": "string (version number)"
    }
  ],
  "installation": [
    "string (installation command)"
  ],
  "usage": [
    "string (usage command)"
  ],
  "license": {
    "type": "string (one of: MIT, Apache-2.0, GPL-3.0, BSD-3-Clause, ISC, or Custom)",
    "author": "string (copyright holder)",
    "year": "string (copyright year)"
  }
}

Analysis rules:

${licensePrompt}

${featuresPrompt}

${dependenciesPrompt}

${specificInstructions}

IMPORTANT: 
- License type must be exactly one of the specified values
- Keep features extremely concise
- Strip unnecessary words
- Maintain JSON format
- No additional text
- ONLY extract dependencies that are EXPLICITLY defined in the file
- DO NOT infer or guess dependencies that aren't clearly specified`;
}