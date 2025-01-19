// src/components/layout/Split.tsx
'use client'

import React from 'react';

interface SplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const Split = ({ left, right }: SplitProps) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-6 overflow-y-auto border-r border-gray-200">
        {left}
      </div>
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-6 overflow-y-auto">
        {right}
      </div>
    </div>
  );
};

export default Split;