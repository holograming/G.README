// src/lib/prompts/templates/analyze.ts
import { AnalyzePromptData } from '../types';
import { 
  getLicenseAnalysisPrompt, 
  getFeaturesAnalysisPrompt, 
  getBasicDependenciesPrompt,
  getFileSpecificInstructions,
  getInstallationAnalysisPrompt,  // 새로 추가
  getInstallationInstructions,    // 새로 추가
  getUsageAnalysisPrompt,         // 새로 추가
  getUsageInstructions            // 새로 추가 
} from '../modules';

export function generateAnalyzePrompt(data: AnalyzePromptData) {
  const { fileContent, fileName } = data;
  
  // 각 분석 항목별 프롬프트 모듈 가져오기
  const licensePrompt = getLicenseAnalysisPrompt();
  const featuresPrompt = getFeaturesAnalysisPrompt();
  const dependenciesPrompt = getBasicDependenciesPrompt();
  const installationPrompt = getInstallationAnalysisPrompt();
  const usagePrompt = getUsageAnalysisPrompt();
  
  // 파일 유형별 특화 지시사항 가져오기
  const specificDependenciesInstructions = getFileSpecificInstructions(fileName);
  const specificInstallationInstructions = getInstallationInstructions(fileName);
  const specificUsageInstructions = getUsageInstructions(fileName);

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
    "string (installation command formatted as markdown code block)"
  ],
  "usage": [
    "string (project integration examples only - do NOT include API usage unless explicitly documented)"
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
${specificDependenciesInstructions}

${installationPrompt}
${specificInstallationInstructions}

${usagePrompt}
${specificUsageInstructions}

IMPORTANT: 
- License type must be exactly one of the specified values
- Keep features extremely concise
- Strip unnecessary words
- Maintain JSON format
- No additional text
- For installation commands:
  - ONLY include commands explicitly defined in the file
  - Format as properly formatted markdown code blocks with language tags
  - Put the opening \`\`\`language and the code on SEPARATE lines
  - Put each code statement/command on its own line
  - Use proper indentation and formatting within code blocks
  - End code blocks with \`\`\` on its own line
- For usage examples:
  - ONLY include project integration/linking information
  - Format ALL code examples as properly formatted markdown code blocks
  - Make sure code blocks have proper spacing, line breaks, and indentation
  - The content of code blocks MUST start on the line AFTER \`\`\`language
  - If no clear usage information is available, return an empty array`; 
}