// src/components/sections/LicenseSection.tsx
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type LicenseType } from '@/lib/types';

interface LicenseSectionProps {
    license: {
      type: LicenseType;
      author: string;
      year: string;
    };
    onLicenseChange: (license: { 
      type: LicenseType; 
      author: string;
      year: string;
    }) => void;
  }
  

  export function LicenseSection({
    license,
    onLicenseChange
  }: LicenseSectionProps) {
    return (
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">라이선스</h2>
        <div className="space-y-4">
          <Select
            value={license.type}
            onValueChange={(type: LicenseType) => 
              onLicenseChange({ ...license, type })}
          >
          <SelectTrigger>
            <SelectValue placeholder="라이선스 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MIT">MIT License</SelectItem>
            <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
            <SelectItem value="GPL-3.0">GNU GPL v3</SelectItem>
            <SelectItem value="BSD-3-Clause">BSD 3-Clause</SelectItem>
          </SelectContent>
          </Select>

<Input
  placeholder="작성자 이름"
  value={license.author}
  onChange={(e) => 
    onLicenseChange({ ...license, author: e.target.value })}
/>

<Input
  placeholder="연도"
  value={license.year}
  onChange={(e) => 
    onLicenseChange({ ...license, year: e.target.value })}
/>
</div>
</Card>
);
}