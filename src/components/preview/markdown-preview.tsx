// src/components/preview/markdown-preview.tsx
"use client"

import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

export function MarkdownPreview({ markdown, className }: MarkdownPreviewProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Preview</h3>
      </div>
      <div className="prose max-w-none dark:prose-invert bg-white rounded-lg p-4 h-[600px] overflow-y-auto">
        {markdown ? (
          <ReactMarkdown>{markdown}</ReactMarkdown>
        ) : (
          <div className="text-gray-500">
            Generated README will appear here...
          </div>
        )}
      </div>
    </Card>
  );
}