// src/lib/prompts/templates/readme.ts
import { GeneratePromptData } from '../types';

export function generateReadmePrompt(data: GeneratePromptData): string {
  const { projectInfo, features, techStack, license, installation } = data;
  
  const categorizedTech = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(`${tech.name} (${tech.version}) - ${tech.purpose}`);
    return acc;
  }, {} as Record<string, string[]>);

  return `Create a professional README.md file using the following information:

# Project Details
Name: ${projectInfo.name}
Short Description: ${projectInfo.shortDescription}
Detailed Description:
${projectInfo.detailedDescription}

# Features
${features.map(f => `
- ${f.title}
  Description: ${f.description}
  ${f.example ? `Example: ${f.example}` : ''}`).join('\n')}

# Technology Stack
${Object.entries(categorizedTech).map(([category, techs]) => `
${category}:
${techs.map(t => `- ${t}`).join('\n')}`).join('\n')}

# License
Type: ${license.type}
Author: ${license.author}
Year: ${license.year}
${license.customText ? `Custom Text: ${license.customText}` : ''}

${installation ? `# Installation Guide
Requirements: ${installation.requirements?.join(', ')}
Installation Steps: ${installation.installation?.join('\n')}
Configuration: ${installation.configuration}
Usage: ${installation.usage}` : ''}

Please create a README.md with:
1. Clear header with project name and badges for main technologies
2. Concise project description that explains the value proposition
3. Features section with detailed explanations and examples
4. Technology stack organized by category
5. Installation and usage instructions (if provided)
6. License section with proper formatting
7. Add emoji icons where appropriate
8. Include a table of contents

Format the output in clean Markdown with proper heading hierarchy and sections separated by horizontal rules.`;
}