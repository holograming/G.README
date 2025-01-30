// src/components/sections/tech-stack.tsx
"use client"

import { TechStack } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface TechStackSectionProps {
  techStack: TechStack[];
  onChange: (techStack: TechStack[]) => void;
}

export function TechStackSection({ techStack, onChange }: TechStackSectionProps) {
  const addTech = () => {
    onChange([...techStack, { name: '', version: '', category: 'Frontend', purpose: '' }]);
  };

  const removeTech = (index: number) => {
    onChange(techStack.filter((_, i) => i !== index));
  };

  const updateTech = (index: number, field: keyof TechStack, value: string) => {
    const updatedTechStack = techStack.map((tech, i) =>
      i === index ? { ...tech, [field]: value } : tech
    );
    onChange(updatedTechStack);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tech Stack</h2>
        <Button onClick={addTech} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Technology
        </Button>
      </div>
      <div className="space-y-4">
        {techStack.map((tech, index) => (
          <div key={index} className="p-4 border rounded-lg relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeTech(index)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Technology name"
                value={tech.name}
                onChange={(e) => updateTech(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Version"
                value={tech.version}
                onChange={(e) => updateTech(index, 'version', e.target.value)}
              />
              <Select
                value={tech.category}
                onValueChange={(value) => updateTech(index, 'category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Purpose"
                value={tech.purpose}
                onChange={(e) => updateTech(index, 'purpose', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}