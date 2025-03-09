// src/lib/prompts/templates/readme.ts
import { GeneratePromptData } from '../types';

export function generateReadmePrompt(data: GeneratePromptData): string {
  const { projectInfo, features, techStack, license, dependencies, installation } = data;
  
  return `Create a professional README.md file for ${projectInfo.name} using the following format and STRICTLY using ONLY the information provided below:

# ${projectInfo.name}

${projectInfo.detailedDescription}

${techStack && techStack.length > 0 ? 
  techStack.map(tech => `![${tech.name}](https://img.shields.io/badge/${tech.name.replace(/\./g, '%2E')}-${tech.version}-blue)`).join('\n') 
  : ''}

${features && features.length > 0 ? `
## Features
${features.map(f => `
- ${f.title}
  ${f.description}
  ${f.example ? `Example: ${f.example}` : ''}`).join('\n')}
` : ''}

${dependencies && dependencies.length > 0 ? `## Dependencies

| Package | Version |
|---------|---------|
${dependencies.map(dep => `| ${dep.name} | ${dep.version} |`).join('\n')}
` : ''}

${installation ? `## Installation
${installation.requirements && installation.requirements.length > 0 ? `### Requirements
\`\`\`bash
${installation.requirements.join('\n')}\`\`\`` : ''}

${installation.installation && installation.installation.length > 0 ? `### Steps
\`\`\`bash
${installation.installation.join('\n')}\`\`\`` : ''}

${installation.configuration ? `### Configuration
${installation.configuration}` : ''}

${installation.usage ? `### Usage
\`\`\`bash
${installation.usage}\`\`\`` : ''}
` : ''}

## License
${license.type}

Copyright (c) ${license.year} ${license.author}

IMPORTANT INSTRUCTIONS:
1. Generate README content using ONLY the information provided above 
2. DO NOT invent or add any features, technologies, or information not explicitly provided
3. DO NOT include sections that have no content provided
4. If a section has empty data, omit that section entirely
5. Never add placeholders or examples if data is missing`;

}