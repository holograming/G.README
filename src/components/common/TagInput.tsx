
// components/common/TagInput.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  placeholder: string;
  className?: string;
  tagClassName?: string;
}

export function TagInput({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder,
  className = '',
  tagClassName = 'bg-blue-100 text-blue-800'
}: TagInputProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${tagClassName} px-3 py-1 rounded-full text-sm flex items-center gap-1`}
          >
            {tag}
            <button
              onClick={() => onRemoveTag(index)}
              className="hover:text-blue-600"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newTag.trim()) {
              handleAddTag();
            }
          }}
        />
        <Button size="sm" onClick={handleAddTag} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          추가
        </Button>
      </div>
    </div>
  );
}