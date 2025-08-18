import { Workflow } from '../types';

export const workflows: Workflow[] = [
  {
    id: 'wf-guide',
    name: 'Onboarding & App Cheatsheet',
    description: 'A comprehensive step-by-step guide to the application, its features, and the AI agent orchestration process.',
    agents: ['Atlas'],
    color: '#00ffff', // Neon Cyan
    action: {
      type: 'command',
      command: '/guide',
    },
  },
  {
    id: 'wf-marketing',
    name: 'Marketing Video Pipeline',
    description: 'An end-to-end pipeline that ingests brand assets, writes a script, renders a promo video, and prepares launch materials.',
    agents: ['Lyra', 'Kara', 'Sophia', 'Cecilia', 'Stan', 'Dude', 'ANDIE'],
    color: '#c000ff', // Neon Purple
    action: {
      type: 'command',
      command: '/marketing_flow',
    },
  },
  {
    id: 'wf-spec',
    name: 'Project Spec Pipeline',
    description: 'Generates a complete set of project specification documents, including a YAML plan, JSON requirements, and a Markdown summary.',
    agents: ['Andoy', 'Adam', 'David'],
    color: '#39ff14', // Neon Green
    action: {
      type: 'command',
      command: '/spec_flow',
      requiresInput: true,
      inputPrompt: 'Enter the project topic:',
    },
  },
  {
    id: 'wf-lyra',
    name: 'Lyra: Data Ingestion',
    description: 'A standalone task for Lyra to ingest, validate, and normalize a new set of brand assets, producing a JSON output.',
    agents: ['Lyra'],
    color: '#ffcc00', // Neon Yellow
    action: {
        type: 'command',
        command: '/lyra_tasksource',
    }
  },
  {
    id: 'wf-dude',
    name: 'Dude: Craft Launch Copy',
    description: 'Drafts compelling LinkedIn and X (Twitter) posts for a launch, incorporating key stats and SEO tags.',
    agents: ['Dude', 'Lyra'],
    color: '#4d94ff', // Neon Blue
    action: {
      type: 'command',
      command: '/dude_craft_copy',
      requiresInput: true,
      inputPrompt: 'Enter SEO hashtags (e.g., #AI #LaunchDay):',
    },
  },
  {
    id: 'wf-andie',
    name: 'ANDIE: Executive Approval',
    description: 'Provides executive sign-off on the latest AI-generated asset. The decision (approve/reject) will modify the asset record.',
    agents: ['ANDIE'],
    color: '#ff9900', // Neon Orange
    action: {
      type: 'command',
      command: '/andie_signoff',
      requiresInput: true,
      inputPrompt: 'Type "approve" or "reject" for the latest AI asset:',
    },
  },
];