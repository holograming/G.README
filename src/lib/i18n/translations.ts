// src/lib/i18n/translations.ts

import { Translations } from './types';

export const translations: Record<'ko' | 'en', Translations> = {
  ko: {
    common: {
      download: '다운로드',
      createNew: '새로 만들기',
      next: '다음',
      back: '이전',
    },
    generator: {
      uploadFile: '프로젝트 파일 업로드',
      supportedFiles: '(package.json, build.gradle, pom.xml)',
      projectName: '프로젝트 이름',
      description: '설명',
      features: '주요 기능',
      addFeature: '기능 추가',
      techStack: '기술 스택',
      addTech: '기술 추가',
      license: '라이선스',
      author: '작성자',
      generate: 'README 생성하기',
    },
    progress: {
      title: 'README 생성 중',
      pleaseWait: '잠시만 기다려주세요...',
      analyzing: {
        title: '프로젝트 분석 중',
        description: '프로젝트 파일과 입력 정보를 분석하고 있습니다...',
      },
      generating: {
        title: 'README 생성 중',
        description: 'AI를 통해 README 내용을 생성하고 있습니다...',
      },
      formatting: {
        title: '문서 변환 중',
        description: '마크다운 문서로 변환하고 있습니다...',
      },
    },
    result: {
      title: 'README 생성 완료!',
      subtitle: 'README.md 파일을 다운로드하세요',
      downloadButton: 'README 다운로드',
      createNewButton: '새로 만들기',
    },
  },
  en: {
    common: {
      download: 'Download',
      createNew: 'Create New',
      next: 'Next',
      back: 'Back',
    },
    generator: {
      uploadFile: 'Upload Project File',
      supportedFiles: '(package.json, build.gradle, pom.xml)',
      projectName: 'Project Name',
      description: 'Description',
      features: 'Features',
      addFeature: 'Add Feature',
      techStack: 'Tech Stack',
      addTech: 'Add Technology',
      license: 'License',
      author: 'Author',
      generate: 'Generate README',
    },
    progress: {
      title: 'Generating README',
      pleaseWait: 'Please wait...',
      analyzing: {
        title: 'Analyzing Project',
        description: 'Analyzing project files and input information...',
      },
      generating: {
        title: 'Generating README',
        description: 'Generating content using AI...',
      },
      formatting: {
        title: 'Converting Document',
        description: 'Converting to markdown format...',
      },
    },
    result: {
      title: 'README Generated!',
      subtitle: 'Download your README.md file',
      downloadButton: 'Download README',
      createNewButton: 'Create New',
    },
  },
};