// src/components/sections/InstallationSection.tsx
interface InstallationSectionProps {
  installation?: string[];
}

export function InstallationSection({ installation }: InstallationSectionProps) {
  // CollapsibleSection에서 처리하므로 여기서는 상태 관리 제거

  if (!installation?.length) return null;

  return (
    <div>
      <ol className="list-decimal list-inside space-y-2">
        {installation.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}