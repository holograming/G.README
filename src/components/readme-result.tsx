// src/components/readme-result.tsx
"use client"

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Edit, Copy, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProjectInfo, Feature, TechStack, License } from '@/lib/types';

interface ReadmeResultProps {
  data: {
    projectInfo: ProjectInfo;
    features: Feature[];
    techStack: TechStack[];
    license: License;
    markdown: string;
  };
  onBack: () => void;
}

export function ReadmeResult({ data, onBack }: ReadmeResultProps) {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'markdown'>('preview');
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([data.markdown], { type: 'text/markdown' });
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
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Enhance Your README</h2>
              <Button variant="outline" size="sm" onClick={onBack}>
                <Edit className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
            </div>

            <div className="space-y-4">
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

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  {copySuccess ? 'Copied!' : 'Copy Markdown'}
                </Button>
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={(value: 'preview' | 'markdown') => setActiveTab(value)}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="mt-0">
                <div className="prose max-w-none bg-white rounded-lg p-4 h-[600px] overflow-y-auto">
                  <ReactMarkdown>{data.markdown}</ReactMarkdown>
                </div>
              </TabsContent>
              
              <TabsContent value="markdown" className="mt-0">
                <div className="bg-gray-900 rounded-lg p-4 h-[600px] overflow-y-auto">
                  <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                    {data.markdown}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}