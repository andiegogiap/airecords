import { Agent } from '../types';
import {
    LyraIcon,
    KaraIcon,
    DudeIcon,
    AndieIcon,
    AdamIcon,
    BookOpenIcon,
    LightbulbIcon,
    GenericAgentIcon,
    UsersIcon,
} from '../components/icons';

export const allAgents: Agent[] = [
    {
        id: 'lyra',
        name: 'Lyra',
        description: 'Master Orchestrator who supervises overall task flows and coordinates multi-agent operations.',
        color: '#ffcc00', // Neon Yellow
        avatar: LyraIcon,
        specialties: ['Data Ingestion', 'Workflow Coordination', 'Asset Validation', 'Metrics Sourcing'],
        associatedWorkflowIds: ['wf-lyra', 'wf-marketing', 'wf-dude'],
    },
    {
        id: 'dude',
        name: 'Dude',
        description: 'Hip and energetic marketing copywriter who crafts compelling social media posts.',
        color: '#4d94ff', // Neon Blue
        avatar: DudeIcon,
        specialties: ['Launch Copy', 'Social Media', 'ROI Decks', 'Creative Writing'],
        associatedWorkflowIds: ['wf-dude', 'wf-marketing'],
    },
    {
        id: 'adam',
        name: 'Adam',
        description: 'A meticulous planner responsible for creating structured project documents.',
        color: '#39ff14', // Neon Green
        avatar: AdamIcon,
        specialties: ['YAML Plans', 'JSON Requirements', 'Technical Specs'],
        associatedWorkflowIds: ['wf-spec'],
    },
    {
        id: 'andie',
        name: 'ANDIE',
        description: 'The executive decision-maker, providing final sign-off and approval on generated assets.',
        color: '#ff9900', // Neon Orange
        avatar: AndieIcon,
        specialties: ['Executive Approval', 'Sign-off', 'Asset Review', 'Governance'],
        associatedWorkflowIds: ['wf-andie', 'wf-marketing'],
    },
     {
        id: 'atlas',
        name: 'Atlas',
        description: 'The application guide, providing documentation and cheatsheets to help the user.',
        color: '#00ffff', // Neon Cyan
        avatar: BookOpenIcon,
        specialties: ['Onboarding', 'Documentation', 'User Guidance'],
        associatedWorkflowIds: ['wf-guide'],
    },
     {
        id: 'critica',
        name: 'Critica',
        description: 'An analytical agent that reviews existing records and suggests improvements.',
        color: '#ff00ff', // Neon Pink/Magenta
        avatar: LightbulbIcon,
        specialties: ['Content Analysis', 'Suggestion Generation', 'Quality Improvement'],
        associatedWorkflowIds: [], // This is triggered from the record card, not a workflow
    },
    {
        id: 'multi-agent-teams',
        name: 'Multi-Agent Teams',
        description: 'Some workflows are complex and require the combined expertise of multiple agents working in concert.',
        color: '#e0e0e0',
        avatar: UsersIcon,
        specialties: ['Project Specs', 'Marketing Pipelines', 'Cross-functional Collaboration'],
        associatedWorkflowIds: ['wf-spec', 'wf-marketing'],
    },
    {
        id: 'kara',
        name: 'Kara',
        description: 'Security and Compliance agent ensuring all operations are safe and governed.',
        color: '#ff4d4d', // Neon Red
        avatar: KaraIcon,
        specialties: ['Security Monitoring', 'Compliance Checks', 'Safe Orchestration'],
        associatedWorkflowIds: ['wf-marketing'],
    },
    {
        id: 'andoy',
        name: 'Andoy',
        description: 'The lead agent for the Project Spec Pipeline, initiating the documentation workflow.',
        color: '#b8b8b8',
        avatar: GenericAgentIcon,
        specialties: ['Pipeline Initiation', 'Project Scoping'],
        associatedWorkflowIds: ['wf-spec'],
    },
    {
        id: 'david',
        name: 'David',
        description: 'A communications specialist who generates human-readable summaries from technical data.',
        color: '#b8b8b8',
        avatar: GenericAgentIcon,
        specialties: ['Markdown Summaries', 'Technical Writing'],
        associatedWorkflowIds: ['wf-spec'],
    }
];
