// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { projectName, description, features, techStack, license } = await request.json();

   // api/generate/route.ts의 prompt 수정
    const prompt = `Create a concise README for:

    Project: ${projectName}
    Description: ${description}
    ${features.length > 0 ? `Features:\n${features.map(f => `- ${f}`).join('\n')}` : ''}
    ${techStack.length > 0 ? `Tech Stack:\n${techStack.map(t => `- ${t}`).join('\n')}` : ''}
    License: ${license.type}

    Guidelines:
    - Keep descriptions under 10 words
    - Add status badges for tech stack
    - Use simple, clear sections
    - Include emojis sparingly

    Status badges to include:
    ${techStack.map(tech => {
      const normalizedTech = tech.toLowerCase();
      if (normalizedTech.includes('react')) return '![React](https://img.shields.io/badge/React-blue?logo=react)';
      if (normalizedTech.includes('typescript')) return '![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)';
      if (normalizedTech.includes('next')) return '![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)';
      // ... 더 많은 기술 스택 뱃지
      return '';
    }).filter(Boolean).join('\n')}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return NextResponse.json({ 
      markdown: message.content[0].text 
    });

  } catch (error) {
    console.error('Error generating README:', error);
    return NextResponse.json(
      { error: 'Failed to generate README. Please try again.' },
      { status: 500 }
    );
  }
}