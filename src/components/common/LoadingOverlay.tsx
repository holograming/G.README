// components/common/LoadingOverlay.tsx
import { Card } from '@/components/ui/card';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="p-6 w-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">파일 분석 중</h3>
          <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
        </div>
      </Card>
    </div>
  );
}
