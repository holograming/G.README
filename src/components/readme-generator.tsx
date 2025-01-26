"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReadmeGeneratorProps {
  onGenerate: (data: {
    projectName: string;
    description: string;
    features: string[];
    techStack: string[];
    markdown?: string;
  }) => void;
}

interface ProjectData {
  name?: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const detectTechStack = (dependencies: Record<string, string> = {}, devDependencies: Record<string, string> = {}) => {
  const allDeps = { ...dependencies, ...devDependencies };
  const detectedStack: string[] = [];

  const techMapping: Record<string, string> = {
    'react': 'React',
    'next': 'Next.js',
    'typescript': 'TypeScript',
    'express': 'Express',
    'mongoose': 'MongoDB',
    'pg': 'PostgreSQL',
    'redis': 'Redis',
    'jest': 'Jest',
    'tailwindcss': 'TailwindCSS',
    'graphql': 'GraphQL'
  };

  Object.keys(allDeps).forEach(dep => {
    const normalizedDep = dep.toLowerCase();
    Object.entries(techMapping).forEach(([key, value]) => {
      if (normalizedDep.includes(key) && !detectedStack.includes(value)) {
        detectedStack.push(value);
      }
    });
  });

  return detectedStack;
};

const parseGradleFile = (content: string) => {
  const detected = {
    techStack: [] as string[],
    features: [] as string[]
  };

  const gradleDependencies: Record<string, string> = {
    'org.springframework.boot': 'Spring Boot',
    'org.springframework': 'Spring Framework',
    'org.jetbrains.kotlin': 'Kotlin',
    'io.ktor': 'Ktor',
    'org.hibernate': 'Hibernate',
    'junit': 'JUnit'
  };

  const pluginsMatch = content.match(/plugins\s*{[^}]*}/g);
  const dependenciesMatch = content.match(/dependencies\s*{[^}]*}/g);

  if (pluginsMatch) {
    const plugins = pluginsMatch[0];
    if (plugins.includes('org.springframework.boot')) {
      detected.techStack.push('Spring Boot');
    }
    if (plugins.includes('kotlin')) {
      detected.techStack.push('Kotlin');
    }
  }

  if (dependenciesMatch) {
    const dependencies = dependenciesMatch[0];
    Object.entries(gradleDependencies).forEach(([key, value]) => {
      if (dependencies.includes(key)) {
        detected.techStack.push(value);
      }
    });

    if (dependencies.includes('spring-boot-starter-web')) {
      detected.features.push('REST API');
    }
    if (dependencies.includes('spring-boot-starter-data-jpa')) {
      detected.features.push('Database Integration');
    }
    if (dependencies.includes('spring-boot-starter-security')) {
      detected.features.push('Authentication');
    }
  }

  return detected;
};

const ReadmeGenerator: React.FC<ReadmeGeneratorProps> = ({ onGenerate }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newStack, setNewStack] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonFeatures = [
    'Authentication',
    'REST API',
    'Database Integration',
    'File Upload',
    'Real-time Updates',
    'Search Functionality',
    'User Management',
    'Responsive Design'
  ];

  const commonStacks = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'TailwindCSS'
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      let detected = { techStack: [] as string[], features: [] as string[] };

      if (file.name.endsWith('.json')) {
        const packageJson = JSON.parse(content) as ProjectData;
        detected.techStack = detectTechStack(
          packageJson.dependencies,
          packageJson.devDependencies
        );
        
        if (packageJson.name) setProjectName(packageJson.name);
        if (packageJson.description) setDescription(packageJson.description);

      } else if (file.name.endsWith('.gradle') || file.name.endsWith('.gradle.kts')) {
        detected = parseGradleFile(content);
      }

      setSelectedStack(prevStack => {
        const newStack = [...prevStack];
        detected.techStack.forEach(stack => {
          if (!newStack.includes(stack)) {
            newStack.push(stack);
          }
        });
        return newStack;
      });

      setSelectedFeatures(prevFeatures => {
        const newFeatures = [...prevFeatures];
        detected.features.forEach(feature => {
          if (!newFeatures.includes(feature)) {
            newFeatures.push(feature);
          }
        });
        return newFeatures;
      });

    } catch (error) {
      console.error('Error parsing file:', error);
      setError('Failed to parse the uploaded file');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !selectedFeatures.includes(newFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleAddStack = () => {
    if (newStack.trim() && !selectedStack.includes(newStack.trim())) {
      setSelectedStack([...selectedStack, newStack.trim()]);
      setNewStack('');
    }
  };

  const handleGenerate = async () => {
    if (!projectName.trim() || !description.trim()) {
      setError('Project name and description are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          description,
          features: selectedFeatures,
          techStack: selectedStack,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate README');
      }

      const data = await response.json();
      onGenerate({
        projectName,
        description,
        features: selectedFeatures,
        techStack: selectedStack,
        markdown: data.markdown,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">README Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".json,.gradle,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">
                    Optional: Upload project file to auto-fill
                  </p>
                  <p className="text-xs text-gray-500">
                    (package.json, build.gradle, CMakeLists.txt)
                  </p>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Project Name
                </label>
                <Input 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                  className="h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedFeatures.map((feature) => (
                    <span 
                      key={feature}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => setSelectedFeatures(
                          selectedFeatures.filter(f => f !== feature)
                        )}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add custom feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button onClick={handleAddFeature} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => {
                        if (selectedFeatures.includes(feature)) {
                          setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                        } else {
                          setSelectedFeatures([...selectedFeatures, feature]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        selectedFeatures.includes(feature)
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedStack.map((stack) => (
                    <span 
                      key={stack}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {stack}
                      <button
                        onClick={() => setSelectedStack(
                          selectedStack.filter(s => s !== stack)
                        )}
                        className="hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add custom tech stack"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStack()}
                  />
                  <Button onClick={handleAddStack} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonStacks.map((stack) => (
                    <button
                      key={stack}
                      onClick={() => {
                        if (selectedStack.includes(stack)) {
                          setSelectedStack(selectedStack.filter(s => s !== stack));
                        } else {
                          setSelectedStack([...selectedStack, stack]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        selectedStack.includes(stack)
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {stack}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate README'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview</h3>
            </div>
            <div className="prose max-w-none bg-white rounded-lg p-4 h-[600px] overflow-y-auto">
              <div className="text-gray-500">
                Generated README will appear here...
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReadmeGenerator;