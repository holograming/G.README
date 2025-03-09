// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { generateReadmePrompt } from '@/lib/prompts';
import { GeneratePromptData } from '@/lib/prompts/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface ContentBlock {
  type: 'text';
  text: string;
}

interface ClaudeMessage {
  content: ContentBlock[];
}

interface GenerateRequest {
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
  license: {
    type: string;
    author: string;
    year: string;
  };
  dependencies?: { name: string; version: string; }[];
  installation?: string[];
  usage?: string[];
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const requestData = await request.json() as GenerateRequest;

    // 입력 데이터를 GeneratePromptData 형식으로 변환
    const promptData: GeneratePromptData = {
      projectInfo: {
        name: requestData.projectName,
        detailedDescription: requestData.description,
      },
      features: requestData.features.length > 0 
        ? requestData.features.map(feature => ({
            title: feature,
            description: feature
          })) 
        : undefined,
      techStack: requestData.techStack.map(tech => ({
        name: tech,
        version: 'latest',
      })),
      license: {
        type: requestData.license.type,
        author: requestData.license.author,
        year: requestData.license.year
      },
      dependencies: requestData.dependencies,
      // installation 속성이 존재하고 배열이며 내용이 있는 경우에만 추가
      installation: requestData.installation && Array.isArray(requestData.installation) && requestData.installation.length > 0 
        ? {
            installation: requestData.installation,
            usage: requestData.usage && Array.isArray(requestData.usage) ? requestData.usage.join('\n') : undefined
          } 
        : undefined
    };

    // readme.ts 템플릿을 사용하여 프롬프트 생성
    const prompt = generateReadmePrompt(promptData);

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.2, // 약간 낮은 온도로 설정
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }) as ClaudeMessage;

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