import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    const { fileContent, fileName } = body;

    if (!fileContent) {
      return NextResponse.json(
        { error: 'File content is required' },
        { status: 400 }
      );
    }

    // Create prompt for Claude
    const prompt = `You are a project analyzer that identifies technologies and features from project files.
    
Analyze the following ${fileName} file and extract:
1. Technologies used (programming languages, frameworks, libraries)
2. Project features or capabilities

File content:
\`\`\`
${fileContent}
\`\`\`

Respond ONLY with a JSON object in this exact format:
{
  "techStack": ["technology1", "technology2", ...],
  "features": ["feature1", "feature2", ...]
}

Notes:
- Include only confirmed technologies and features
- Use standard technology names (e.g., "React" not "react.js")
- Keep feature descriptions concise and clear
- Do not include uncertain items`;

    // Call Claude API
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

    try {
      // Parse the response as JSON
      const analysisResult = JSON.parse(message.content[0].text);
      return NextResponse.json(analysisResult);
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