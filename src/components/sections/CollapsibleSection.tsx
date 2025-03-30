// src/components/sections/CollapsibleSection.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 border rounded-lg shadow-sm bg-card">
      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center"
        >
          <h2 className="text-xl font-bold">{title}</h2>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 px-4 pb-4",
          isOpen ? "block" : "hidden h-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}