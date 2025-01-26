"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Edit, Copy, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types
interface ReadmeData {
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
}

interface ReadmeResultProps {
  data?: ReadmeData;
  onBack?: () => void;
}

// Default data for testing and fallback
const defaultData: ReadmeData = {
  projectName: 'My Project',
  description: 'Project description',
  features: [],
  techStack: []
};

const ReadmeResult: React.FC<ReadmeResultProps> = ({ 
  data = defaultData, 
  onBack = () => {} 
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);

  // Safely access data properties with fallbacks
  const {
    projectName = defaultData.projectName,
    description = defaultData.description,
    features = defaultData.features,
    techStack = defaultData.techStack
  } = data || {};

  const readmeContent = `# ${projectName}

${description}

## Features
${features.length > 0 
  ? features.map(feature => `- ${feature}`).join('\n')
  : '- Feature 1\n- Feature 2\n- Feature 3'}

## Tech Stack
${techStack.length > 0 
  ? techStack.map(tech => `- ${tech}`).join('\n')
  : '- Technology 1\n- Technology 2\n- Technology 3'}

## Installation
\`\`\`bash
npm install ${projectName.toLowerCase().replace(/\s+/g, '-')}
\`\`\`

## Usage
\`\`\`javascript
// Example code will be here
\`\`\`

## License
MIT License
`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            README가 생성되었습니다. 내용을 검토하고 필요한 부분을 수정해주세요.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Panel - Controls & Suggestions */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Enhance Your README</h2>
              <Button variant="outline" size="sm" onClick={onBack}>
                <Edit className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
            </div>

            <div className="space-y-4">
              {/* Suggestions */}
              <div className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center text-amber-600 mb-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="font-medium">Suggested Improvements</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-2 mb-3">
                  <li>• Add detailed installation instructions</li>
                  <li>• Include code examples</li>
                  <li>• Add contributing guidelines</li>
                  <li>• Include license information</li>
                  <li>• Add badges (Build Status, Version)</li>
                </ul>
              </div>

              {/* Download & Copy Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copySuccess ? 'Copied!' : 'Copy Markdown'}
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* Right Panel - Preview */}
          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="mt-0">
                <div className="prose prose-slate max-w-none bg-white rounded-lg p-4 h-[600px] overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ 
                    __html: readmeContent.replace(/\n/g, '<br>') 
                  }} />
                </div>
              </TabsContent>
              
              <TabsContent value="markdown" className="mt-0">
                <div className="bg-gray-900 rounded-lg p-4 h-[600px] overflow-y-auto">
                  <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                    {readmeContent}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReadmeResult;