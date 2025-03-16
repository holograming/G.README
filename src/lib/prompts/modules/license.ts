// src/lib/prompts/modules/license.ts
// 라이선스 분석 관련 프롬프트 모듈

export function getLicenseAnalysisPrompt(): string {
    return `1. License Analysis:
     Valid license types are strictly limited to:
     - MIT
     - Apache-2.0
     - GPL-3.0
     - BSD-3-Clause
     - ISC
     - Custom
     
     Look for license information in:
     - package.json license field
     - LICENSE or LICENSE.md files
     - README license sections
     - Source file headers
     
     If found, extract:
     - Exact license type (must match one of the above)
     - Copyright holder (author)
     - Copyright year
     - For ambiguous cases, use "Custom"`;
  }