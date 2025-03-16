// src/components/sections/TechStackSection.tsx
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
    <div>
      <TagInput
        tags={techStack}
        onAddTag={onAddTech}
        onRemoveTag={onRemoveTech}
        placeholder="기술 스택 추가"
        tagClassName="bg-green-100 text-green-800"
      />
    </div>
  );
}