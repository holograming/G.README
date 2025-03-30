// src/components/sections/FeaturesSection.tsx
import { Button } from '@/components/ui/button';
import { TagInput } from '../common/TagInput';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FeaturesSectionProps {
  features: string[];
  onAddFeature: (feature: string) => void;
  onRemoveFeature: (index: number) => void;
  analyzedFeatures?: string[];
  onAddAnalyzedFeatures?: (feature: string) => void;
}

export function FeaturesSection({
  features,
  onAddFeature,
  onRemoveFeature,
  analyzedFeatures = [],
  onAddAnalyzedFeatures
}: FeaturesSectionProps) {
  console.log('FeaturesSection 렌더링:', {
    현재기능: features,
    분석된기능: analyzedFeatures
  });
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);

  return (
    <div>
      
      <TagInput
        tags={features}
        onAddTag={onAddFeature}
        onRemoveTag={onRemoveFeature}
        placeholder="새로운 기능 추가"
        tagClassName="bg-blue-100 text-blue-800"
      />

      {analyzedFeatures && analyzedFeatures.length > 0 && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRecommendationsOpen(!isRecommendationsOpen)}
            className="w-full flex justify-between items-center"
          >
            분석된 기능 추천 ({analyzedFeatures.length})
            {isRecommendationsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          <div className={cn(
            "mt-2 space-y-2 overflow-hidden transition-all duration-200",
            isRecommendationsOpen ? "block" : "hidden"
          )}>
            {analyzedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-sm">{feature}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddAnalyzedFeatures?.(feature)}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4" />
                  추가
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}