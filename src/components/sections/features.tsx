// src/components/sections/features.tsx
"use client"

import { Feature } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface FeaturesSectionProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
}

export function FeaturesSection({ features, onChange }: FeaturesSectionProps) {
  const addFeature = () => {
    onChange([...features, { title: '', description: '', example: '' }]);
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updatedFeatures = features.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    onChange(updatedFeatures);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Features</h2>
        <Button onClick={addFeature} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="p-4 border rounded-lg relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeFeature(index)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="space-y-3">
              <Input
                placeholder="Feature title"
                value={feature.title}
                onChange={(e) => updateFeature(index, 'title', e.target.value)}
              />
              <Textarea
                placeholder="Feature description"
                value={feature.description}
                onChange={(e) => updateFeature(index, 'description', e.target.value)}
              />
              <Input
                placeholder="Usage example (optional)"
                value={feature.example || ''}
                onChange={(e) => updateFeature(index, 'example', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}