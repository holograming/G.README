// src/lib/prompts/templates/analyze.ts
import { AnalyzePromptData } from '../types';

export function generateAnalyzePrompt(data: AnalyzePromptData) {
  const { fileContent, fileName } = data;
  
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

1. License Analysis:
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
   - For ambiguous cases, use "Custom"

2. Feature analysis rules:
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
   - No technical details

4. Dependencies and Installation:
   - Keep dependencies and tech stack as is
   - Installation as clear commands
   - Usage as example commands

IMPORTANT: 
- License type must be exactly one of the specified values
- Keep features extremely concise
- Strip unnecessary words
- Maintain JSON format
- No additional text`;
}