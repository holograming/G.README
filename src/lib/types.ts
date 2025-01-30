// src/lib/types.ts

export type LicenseType = 
  | 'MIT' 
  | 'Apache-2.0' 
  | 'GPL-3.0'
  | 'BSD-3-Clause'
  | 'ISC'
  | 'Custom';

export const LICENSE_TEMPLATES = {
  'MIT': {
    name: 'MIT License',
    description: 'A short and simple permissive license',
    url: 'https://opensource.org/licenses/MIT',
  },
  'Apache-2.0': {
    name: 'Apache License 2.0',
    description: 'A permissive license with patent protection',
    url: 'https://opensource.org/licenses/Apache-2.0',
  },
  'GPL-3.0': {
    name: 'GNU General Public License v3.0',
    description: 'A copyleft license that requires disclosure of source',
    url: 'https://opensource.org/licenses/GPL-3.0',
  },
  'BSD-3-Clause': {
    name: 'BSD 3-Clause License',
    description: 'A permissive license similar to the MIT License',
    url: 'https://opensource.org/licenses/BSD-3-Clause',
  },
  'ISC': {
    name: 'ISC License',
    description: 'A permissive license similar to the MIT License',
    url: 'https://opensource.org/licenses/ISC',
  },
  'Custom': {
    name: 'Custom License',
    description: 'Custom license terms',
    url: '',
  },
} as const;

export interface ProjectInfo {
  name: string;
  shortDescription: string;
  detailedDescription: string;
}

export interface Feature {
  title: string;
  description: string;
  example?: string;
}

export interface TechStack {
  name: string;
  version: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Other';
  purpose: string;
}

export interface License {
  type: LicenseType;
  author: string;
  year: string;
  customText?: string;
}

export interface InstallationInfo {
  requirements?: string[];
  installation?: string[];
  configuration?: string;
  usage?: string;
}