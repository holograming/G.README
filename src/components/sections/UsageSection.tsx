// src/components/sections/UsageSection.tsx
interface UsageSectionProps {
  usage?: string[];
}

export function UsageSection({ usage }: UsageSectionProps) {
  // CollapsibleSection에서 처리하므로 여기서는 상태 관리 제거

  if (!usage?.length) return null;

  return (
    <div>
      <ul className="list-disc list-inside space-y-2">
        {usage.map((command, index) => (
          <li key={index} className="font-mono text-sm bg-gray-50 p-2 rounded">
            {command}
          </li>
        ))}
      </ul>
    </div>
  );
}