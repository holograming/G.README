// src/components/sections/TechStackSection.tsx
import { Card } from '@/components/ui/card';
import { TagInput } from '../common/TagInput';

interface TechStackSectionProps {
  techStack: string[];
  onAddTech: (tech: string) => void;
  onRemoveTech: (index: number) => void;
}

export function TechStackSection({
  techStack,
  onAddTech,
  onRemoveTech
}: TechStackSectionProps) {
  return (
    <Card className="mb-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">기술 스택</h2>
      </div>
      <TagInput
        tags={techStack}
        onAddTag={onAddTech}
        onRemoveTag={onRemoveTech}
        placeholder="기술 스택 추가"
        tagClassName="bg-green-100 text-green-800"
      />
    </Card>
  );
}