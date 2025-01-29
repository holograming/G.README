// src/lib/i18n/types.ts

export type Language = 'ko' | 'en';

export interface Translations {
  common: {
    download: string;
    createNew: string;
    next: string;
    back: string;
  };
  generator: {
    uploadFile: string;
    supportedFiles: string;
    projectName: string;
    description: string;
    features: string;
    addFeature: string;
    techStack: string;
    addTech: string;
    license: string;
    author: string;
    generate: string;
  };
  progress: {
    title: string;
    pleaseWait: string;
    analyzing: {
      title: string;
      description: string;
    };
    generating: {
      title: string;
      description: string;
    };
    formatting: {
      title: string;
      description: string;
    };
  };
  result: {
    title: string;
    subtitle: string;
    downloadButton: string;
    createNewButton: string;
  };
}