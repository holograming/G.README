// src/components/sections/license.tsx
"use client"

import { License, LicenseType, LICENSE_TEMPLATES } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LicenseSectionProps {
  value: License;
  onChange: (license: License) => void;
}

export function LicenseSection({ value, onChange }: LicenseSectionProps) {
  const currentYear = new Date().getFullYear().toString();

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-bold">License</h2>
      <div className="space-y-4">
        <Select
          value={value.type}
          onValueChange={(type: LicenseType) => onChange({ ...value, type })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select license" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LICENSE_TEMPLATES).map(([key, license]) => (
              <SelectItem key={key} value={key}>
                {license.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="text-sm text-gray-500">
          {LICENSE_TEMPLATES[value.type].description}
        </div>

        <Input
          placeholder="Author name"
          value={value.author}
          onChange={(e) => onChange({ ...value, author: e.target.value })}
        />

        <Input
          placeholder="Year"
          value={value.year}
          onChange={(e) => onChange({ ...value, year: e.target.value })}
          defaultValue={currentYear}
        />

        {value.type === 'Custom' && (
          <Textarea
            placeholder="Custom license text"
            value={value.customText}
            onChange={(e) => onChange({ ...value, customText: e.target.value })}
            className="h-32"
          />
        )}
      </div>
    </Card>
  );
}