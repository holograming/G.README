// src/app/api/generate/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

export async function POST(request: Request) {
  try {
    const { projectName, projectDescription } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `프로젝트 이름: ${projectName}
프로젝트 설명: ${projectDescription}

위 정보를 바탕으로 마크다운 형식의 README 파일을 생성해주세요. 
다음 섹션들을 포함해야 합니다:
- 프로젝트 제목 (H1)
- 프로젝트 설명
- 주요 기능 (H2)
- 설치 방법 (H2)
- 라이선스 (H2)

한국어로 작성해주세요.`
      }]
    });

    return NextResponse.json({ 
      content: message.content[0].text
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'README 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}