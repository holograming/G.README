// src/components/sections/DependenciesSection.tsx
import { useState } from 'react';

interface Dependency {
  name: string;
  version: string;
  type?: 'production' | 'development' | 'peer' | 'optional';
}

interface DependenciesSectionProps {
  dependencies?: Dependency[];
}

export function DependenciesSection({ dependencies }: DependenciesSectionProps) {
  // CollapsibleSection에서 처리하므로 여기서는 상태 관리 제거

  if (!dependencies?.length) return null;

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">패키지명</th>
            <th className="text-left py-2">버전</th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((dep, index) => (
            <tr key={index} className="border-t">
              <td className="py-2">{dep.name}</td>
              <td className="py-2">{dep.version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}