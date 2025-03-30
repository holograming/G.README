// src/lib/prompts/modules/features.ts
// 기능 분석 관련 프롬프트 모듈

export function getFeaturesAnalysisPrompt(): string {
    return `2. Feature analysis rules:
     Extract key functionality as brief phrases:
     GOOD:
     - "markdown rendering"
     - "file upload"
     - "user auth"
     - "data visualization"
     - "i18n support"
     
     BAD:
     - "implements markdown rendering functionality"
     - "provides user authentication system"
     - "handles file uploading mechanism"
  
  3. Keep feature descriptions:
     - Maximum 2-3 words
     - Action-oriented
     - No articles (a, an, the)
     - No helper verbs
     - No technical details`;
  }