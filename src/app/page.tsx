"use client"

import { ReadmeGenerator } from '@/components/readme-generator'

export default function Home() {
  return (
    <main>
      <ReadmeGenerator 
        onGenerate={(data) => {
          console.log('Generated Data:', data);
          // TODO: 여기에 README 생성 로직 추가
        }}
      />
    </main>
  )
}