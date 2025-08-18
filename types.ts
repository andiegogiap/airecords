
import React from 'react';

export enum Category {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export enum ImageStyle {
  PHOTOREALISTIC = 'Photorealistic',
  ILLUSTRATION = 'Illustration',
  ABSTRACT = 'Abstract',
  MINIMALIST = 'Minimalist',
}

export type ImageSize = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export type AppRecordStatus = 'default' | 'staged' | 'processing' | 'complete';

export type AppRecord = {
  id: string;
  name: string;
  description: string;
  category: Category;
  imageUrl?: string;
  imageStyle?: ImageStyle;
  imageSize?: ImageSize;
  isBookmarked?: boolean;
  // New fields for orchestration workflow
  status?: AppRecordStatus;
  generatedFileIds?: {
    yaml: string;
    json: string;
    md: string;
  };
  generatedHtmlPreview?: string;
};

export type ConsoleLog = {
  agent: string;
  message: string;
  type: 'log' | 'error' | 'success' | 'info';
};

export type WorkflowAction = {
  type: 'command';
  command: string;
  requiresInput?: boolean;
  inputPrompt?: string;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  agents: string[];
  color: string;
  action: WorkflowAction;
};

export type Agent = {
    id: string;
    name: string;
    description: string;
    color: string;
    avatar: React.FC<React.SVGProps<SVGSVGElement>>;
    specialties: string[];
    associatedWorkflowIds: string[];
};

export type Page = 'records' | 'refinery' | 'agents' | 'orchestration' | 'files' | 'settings' | 'devtools';

export type Suggestion = {
    name: string;
    description: string;
    category: Category;
};

export type WebsiteAnalysis = {
  description: string;
  pages: string[];
  inDepthAnalysis: { title: string; content: string }[];
  techStack: string[];
};