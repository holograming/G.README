// src/lib/prompts/templates/preview.ts
import { GeneratePromptData } from '../types';

export function generatePreviewMarkdown(data: GeneratePromptData): string {
  const { projectInfo, features, techStack, license } = data;
  
  const categorizedTech = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(`${tech.name}${tech.version ? ` (${tech.version})` : ''}`);
    return acc;
  }, {} as Record<string, string[]>);

  return `# ${projectInfo.name}

${projectInfo.shortDescription}

## Overview

${projectInfo.detailedDescription}

## Features

${features.map(f => `### ${f.title}
${f.description}
${f.example ? `\n**Example:**\n\`\`\`\n${f.example}\n\`\`\`` : ''}`).join('\n\n')}

## Tech Stack

${Object.entries(categorizedTech).map(([category, techs]) => `
### ${category}
${techs.map(t => `- ${t}`).join('\n')}`).join('\n')}

## License

${license.type} License © ${license.year} ${license.author}

${license.customText || ''}`;
}