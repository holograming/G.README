// src/lib/prompts/modules/installation.ts
// 설치 분석 관련 프롬프트 모듈 - 개선 버전

export function getInstallationAnalysisPrompt(): string {
  return `5. Installation Instructions:
   - ONLY extract installation commands that are EXPLICITLY defined in the file
   - DO NOT infer or guess installation steps that aren't clearly specified
   - If no clear installation commands are found, return an empty array
   - Format each command as a markdown code block (e.g., \`npm install\`)
   - Only include concrete commands, not explanatory text
   - Extract commands in the correct execution order`;
}

/**
 * 파일 유형에 따른 설치 지시사항 생성
 */
export function getInstallationInstructions(fileName: string): string {
  const lowercaseName = fileName.toLowerCase();
  
  // 파일 확장자별 특화 프롬프트 반환
  if (lowercaseName === 'cmakelists.txt' || lowercaseName.endsWith('.cmake')) {
    return getCMakeInstallationInstructions();
  } else if (lowercaseName === 'package.json') {
    return getNpmInstallationInstructions();
  } 
  
  return getGenericInstallationInstructions();
}

// 일반적인 설치 지시사항
function getGenericInstallationInstructions(): string {
  return `
INSTALLATION INSTRUCTIONS RULES:
- ONLY extract installation instructions that are EXPLICITLY mentioned in the file
- DO NOT create or infer installation steps that are not clearly described
- Return an empty array if no installation instructions are found
- Installation commands must be formatted as markdown code blocks
- IMPORTANT: DO NOT invent installation steps based on project type
- If README mentions installation but doesn't provide specific commands, DO NOT include them`;
}

// CMake 설치 지시사항
function getCMakeInstallationInstructions(): string {
  return `
INSTALLATION INSTRUCTIONS FOR CMAKE PROJECT:
- ONLY extract installation commands if they are EXPLICITLY defined in:
  - CMakeLists.txt comments
  - install() commands that indicate specific installation steps
  - README sections referenced in the file
- DO NOT automatically include "cmake -B build -S ." unless specifically mentioned
- DO NOT infer installation steps from the mere presence of targets
- If no explicit installation instructions exist, return an empty array
- Format each command as a markdown code block
- IMPORTANT: Only extract installation commands that are EXPLICITLY defined`;
}

// NPM 설치 지시사항
function getNpmInstallationInstructions(): string {
  return `
INSTALLATION INSTRUCTIONS FOR NPM PROJECT:
- ONLY extract installation commands if they are EXPLICITLY defined in:
  - package.json scripts
  - README sections referenced in package.json
  - package.json comments or description
- If "scripts" section contains installation-related scripts, include those commands
- If no explicit installation instructions exist, return an empty array
- DO NOT automatically include "npm install" unless it's mentioned specifically
- Format each command as a markdown code block
- IMPORTANT: Only extract installation commands that are EXPLICITLY defined`;
}

// 다른 파일 유형의 설치 지시사항도 같은 패턴으로 작성...
// (각 함수는 비슷한 형태로 업데이트)