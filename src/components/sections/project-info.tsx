// src/components/sections/project-info.tsx
"use client"

import { ProjectInfo } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProjectInfoSectionProps {
  value: ProjectInfo;
  onChange: (info: ProjectInfo) => void;
}

export function ProjectInfoSection({ value, onChange }: ProjectInfoSectionProps) {
  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Project Information</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Project Name</label>
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Short Description</label>
          <Input
            value={value.shortDescription}
            onChange={(e) => onChange({ ...value, shortDescription: e.target.value })}
            placeholder="One line description of your project"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Detailed Description</label>
          <Textarea
            value={value.detailedDescription}
            onChange={(e) => onChange({ ...value, detailedDescription: e.target.value })}
            placeholder="Explain what your project does, who it's for, and why it exists"
            className="h-32"
          />
        </div>
      </div>
    </Card>
  );
}