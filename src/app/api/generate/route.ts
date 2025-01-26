import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
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
    // Parse request body
    const body = await request.json();
    const { projectName, description, features, techStack } = body;

    // Validate required fields
    if (!projectName || !description) {
      return NextResponse.json(
        { error: 'Project name and description are required' },
        { status: 400 }
      );
    }

    // Create prompt for Claude
    const prompt = `Create a detailed README.md file for a project with the following details:

Project Name: ${projectName}
Description: ${description}
Features: ${features.join(', ')}
Tech Stack: ${techStack.join(', ')}

The README should include:
1. Clear project title and description
2. Features list with brief explanations
3. Technology stack details
4. Installation instructions
5. Usage examples with code snippets
6. Contributing guidelines
7. License information

Please format the response in Markdown.`;

    // Call Claude API
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

    // Extract markdown content from the response
    const markdown = message.content[0].text;

    // Return response
    return NextResponse.json({ markdown });

  } catch (error) {
    console.error('Error generating README:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to generate README. Please try again.' },
      { status: 500 }
    );
  }
}