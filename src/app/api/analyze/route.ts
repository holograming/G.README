// src/app/api/analyze/route.ts
import { generateAnalyzePrompt } from '@/lib/prompts';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface ContentBlock {
  type: 'text';
  text: string;
}

interface ClaudeResponse {
  content: ContentBlock[];
}

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
    const { fileContent, fileName } = await request.json();

    if (!fileContent || !fileName) {
      return NextResponse.json(
        { error: 'File content and name are required' },
        { status: 400 }
      );
    }

    // 프롬프트 생성
    const prompt = generateAnalyzePrompt({
      fileContent,
      fileName
    });

    // Claude API 호출
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 응답 파싱
    try {
      //console.log('Claude response:', message);
      //console.log('Content structure:', message.content);

      //const analysisResult = JSON.parse(message.content[0].text);
      const analysisResult = JSON.parse((message as ClaudeResponse).content[0].text);
      console.log('Analysis result:', analysisResult);
      // 필드 매핑 (analyzedFeatures → features)
      // FeaturesSection 컴포넌트와의 호환성을 위해 키 이름을 유지
      return NextResponse.json({
        projectName: analysisResult.projectName,
        description: analysisResult.description,
        techStack: analysisResult.techStack,
        features: analysisResult.analyzedFeatures, // 기존 코드와의 호환성 유지
        dependencies: analysisResult.dependencies,
        installation: analysisResult.installation,
        usage: analysisResult.usage,
        license: analysisResult.license
      });
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse analysis results' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error analyzing file:', error);
    return NextResponse.json(
      { error: 'Failed to analyze file. Please try again.' },
      { status: 500 }
    );
  }
}