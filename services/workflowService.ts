
import { AppRecord, Category, ConsoleLog, ImageSize, ImageStyle, Suggestion } from '../types';
import * as geminiService from './geminiService';
import * as githubService from './fileService'; // Repurposed for GitHub

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

type LogFunction = (log: ConsoleLog) => void;
type AddRecordFunction = (recordData: Omit<AppRecord, 'id'>) => Promise<void>;
type UpdateRecordFunction = (id: string, updatedData: Omit<AppRecord, 'id'>) => Promise<void>;


export const runGenerateSuggestions = async(record: AppRecord): Promise<Suggestion> => {
    return await geminiService.generateRecordSuggestions(record);
};

export const runRegenerateImage = async(record: AppRecord): Promise<AppRecord> => {
    const imagePrompt = record.description || record.name;
    const imageUrl = await geminiService.generateImage(imagePrompt, record.imageStyle, record.imageSize);
    return { ...record, imageUrl };
};

export const runSpecFlow = async (topic: string, addLog: LogFunction, addRecord: AddRecordFunction) => {
    addLog({ agent: 'Andoy', message: `Starting spec flow for topic: "${topic}".`, type: 'log' });
    
    if (!githubService.isConfigured()) {
        addLog({ agent: 'System', message: 'GitHub not configured. Cannot commit files. Please configure repository in the GitHub tab.', type: 'error' });
        return;
    }

    try {
        addLog({ agent: 'Adam', message: 'Generating YAML workflow plan...', type: 'log' });
        const yamlPlan = await geminiService.generateYamlPlan(topic);
        await githubService.createOrUpdateFile(`specs/${topic}/plan.yaml`, yamlPlan, `feat: Add project plan for ${topic}`);
        addLog({ agent: 'Adam', message: 'YAML plan committed to GitHub repo.', type: 'success' });

        addLog({ agent: 'Adam', message: 'Generating JSON requirements...', type: 'log' });
        const jsonRequirements = await geminiService.generateJsonRequirements(yamlPlan);
        await githubService.createOrUpdateFile(`specs/${topic}/requirements.json`, jsonRequirements, `feat: Add JSON requirements for ${topic}`);
        addLog({ agent: 'Adam', message: 'JSON requirements committed to GitHub.', type: 'success' });

        addLog({ agent: 'David', message: 'Generating Markdown summary...', type: 'log' });
        const mdSummary = await geminiService.generateMarkdownSummary(jsonRequirements);
        await githubService.createOrUpdateFile(`specs/${topic}/summary.md`, mdSummary, `feat: Add Markdown summary for ${topic}`);
        addLog({ agent: 'David', message: 'Markdown summary committed to GitHub.', type: 'success' });
        
        const recordName = `Project Spec: ${topic}`;
        const imagePrompt = `An abstract image representing software architecture and project planning. Keywords: blueprints, flowcharts, interconnected nodes`;
        const imageStyle = ImageStyle.PHOTOREALISTIC;
        const imageSize = '16:9' as ImageSize;
        const imageUrl = await geminiService.generateImage(imagePrompt, imageStyle, imageSize);
        
        await addRecord({ name: recordName, description: mdSummary, category: Category.AI, imageUrl, imageStyle, imageSize, status: 'default' });
        addLog({ agent: 'Andoy', message: `Workflow complete. Files are in the 'GitHub' tab and a summary record has been created.`, type: 'success' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during spec flow.";
        addLog({ agent: 'System', message: `Spec Flow Failed: ${errorMessage}`, type: 'error'});
    }
};


export const runProjectSpecAndPreview = async (topic: string): Promise<{ fileIds: { yaml: string, json: string, md: string }, htmlPreview: string }> => {
    if (!githubService.isConfigured()) {
        throw new Error('GitHub not configured. Cannot create project spec files.');
    }
    const safeTopic = topic.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const basePath = `orchestration/${safeTopic}-${Date.now()}`;

    const yamlPlan = await geminiService.generateYamlPlan(topic);
    const yamlPath = `${basePath}/plan.yaml`;
    await githubService.createOrUpdateFile(yamlPath, yamlPlan, `feat(orchestration): Add YAML plan for ${topic}`);

    const jsonRequirements = await geminiService.generateJsonRequirements(yamlPlan);
    const jsonPath = `${basePath}/requirements.json`;
    await githubService.createOrUpdateFile(jsonPath, jsonRequirements, `feat(orchestration): Add JSON requirements for ${topic}`);

    const mdSummary = await geminiService.generateMarkdownSummary(jsonRequirements);
    const mdPath = `${basePath}/summary.md`;
    await githubService.createOrUpdateFile(mdPath, mdSummary, `feat(orchestration): Add Markdown summary for ${topic}`);
    
    const htmlPreview = await geminiService.generateHtmlPreview(topic, yamlPlan, jsonRequirements, mdSummary);

    return {
        fileIds: {
            yaml: yamlPath,
            json: jsonPath,
            md: mdPath,
        },
        htmlPreview: htmlPreview,
    };
};


export const runAndieSignoff = async (decision: 'approve' | 'reject', records: AppRecord[], addLog: LogFunction, updateRecord: UpdateRecordFunction, addRecord: AddRecordFunction) => {
    addLog({ agent: 'ANDIE', message: 'Reviewing latest AI-generated asset for executive sign-off...', type: 'info' });
    await delay(1000);

    const latestAiRecord = records.find(r => r.category === Category.AI);

    if (!latestAiRecord) {
        addLog({ agent: 'ANDIE', message: 'No AI-generated assets found to review.', type: 'error' });
        return;
    }
    
    addLog({ agent: 'ANDIE', message: `Asset under review: "${latestAiRecord.name}"`, type: 'log' });
    await delay(500);

    if (latestAiRecord.name.startsWith('[Approved]') || latestAiRecord.name.startsWith('[Rejected]')) {
      addLog({ agent: 'ANDIE', message: 'This asset has already been reviewed. No action taken.', type: 'info' });
      return;
    }

    const isApproved = decision === 'approve';
    const statusText = isApproved ? 'Approved' : 'Rejected';
    const statusIcon = isApproved ? '✅' : '❌';
    const newName = `[${statusText}] ${statusIcon} ${latestAiRecord.name}`;
    
    const { id, ...rest } = latestAiRecord;
    const updatedData = { ...rest, name: newName };
    await updateRecord(id, updatedData);
    addLog({ agent: 'ANDIE', message: `Decision: ${statusText}. The record has been updated.`, type: 'success' });

    const recordName = `Sign-off: ${latestAiRecord.name}`;
    const description = `The asset "${latestAiRecord.name}" has been reviewed by ANDIE and marked as ${statusText}.`;
    const imagePrompt = isApproved 
        ? `An official looking document with a large, green, grunge-style "APPROVED" stamp on it`
        : `An official looking document with a large, red, grunge-style "REJECTED" stamp on it`;
    const imageStyle = ImageStyle.PHOTOREALISTIC;
    const imageSize = '16:9' as ImageSize;
    const imageUrl = await geminiService.generateImage(imagePrompt, imageStyle, imageSize);
    
    await addRecord({ name: recordName, description, category: Category.SYSTEM, imageUrl, imageStyle, imageSize, status: 'default' });
    addLog({ agent: 'System', message: `New sign-off record created.`, type: 'success' });
};

export const runLyraTasksource = async (addLog: LogFunction, addRecord: AddRecordFunction) => {
    addLog({ agent: 'Lyra', message: 'TASKSOURCE initiated. Ingesting brand assets from ANDIE...', type: 'info' });
    await delay(500);
    addLog({ agent: 'Lyra', message: 'Validating, normalizing, flagging anomalies...', type: 'log' });
    await delay(800);

    const normalizedData = {
      source: 'ANDIE_assets.zip',
      validation_status: 'OK',
      anomalies_flagged: 2,
      normalized_elements: ['logos', 'color_palette', 'typography'],
      output_file: 'normalized_data.json',
    };
    
    addLog({ agent: 'Lyra', message: 'Normalization complete. Outputting `normalized_data.json`:', type: 'success' });
    addLog({ agent: 'Lyra', message: JSON.stringify(normalizedData, null, 2), type: 'log' });
    addLog({ agent: 'Lyra', message: 'HANDOVER to Kara.', type: 'info' });

    const recordName = `Lyra Task: Brand Asset Ingestion`;
    const description = `Successfully ingested, validated, and normalized brand assets. Anomalies were flagged and the output is ready for the next stage.`;
    const imagePrompt = `An abstract image representing data ingestion and normalization, with clean lines, data streams, and validation checkmarks`;
    const imageStyle = ImageStyle.MINIMALIST;
    const imageSize = '16:9' as ImageSize;
    const imageUrl = await geminiService.generateImage(imagePrompt, imageStyle, imageSize);

    await addRecord({ name: recordName, description, category: Category.SYSTEM, imageUrl, imageStyle, imageSize, status: 'default' });
    addLog({ agent: 'System', message: `New record created: "${recordName}"`, type: 'success' });
};

export const runMarketingFlow = async (addLog: LogFunction, addRecord: AddRecordFunction) => {
    addLog({ agent: 'System', message: `Starting marketing video generation flow...`, type: 'info' });
    await delay(500);
    addLog({ agent: 'Lyra', message: 'Ingesting latest brand assets (assets/latest.zip)...', type: 'log' });
    await delay(1000);
    addLog({ agent: 'Kara', message: 'Fine-tuning script writer model...', type: 'log' });
    await delay(1500);
    addLog({ agent: 'Sophia', message: 'Storyboard rendering...', type: 'log' });
    await delay(2000);
    addLog({ agent: 'Cecilia', message: 'Queueing drafts on the render farm...', type: 'log' });
    await delay(1000);
    addLog({ agent: 'Stan', message: 'Packaging final_video.mp4 and tagging release...', type: 'log' });
    await delay(1000);
    addLog({ agent: 'Dude', message: 'Crafting launch copy and ROI deck...', type: 'log' });
    await delay(1500);
    addLog({ agent: 'ANDIE', message: 'Reviewing launch assets for executive sign-off...', type: 'log' });
    await delay(1000);
    addLog({ agent: 'ANDIE', message: 'Sign-off complete. Marketing campaign is a go! ✅', type: 'success' });
    
    const recordName = "Marketing Video Campaign";
    const description = "A comprehensive marketing campaign including a promotional video, launch copy, and ROI deck has been generated and approved.";
    const imagePrompt = `An abstract image representing a successful marketing campaign launch, with elements of video, data analytics, and teamwork`;
    const imageStyle = ImageStyle.ILLUSTRATION;
    const imageSize = '16:9' as ImageSize;
    const imageUrl = await geminiService.generateImage(imagePrompt, imageStyle, imageSize);
    
    await addRecord({ name: recordName, description, category: Category.AI, imageUrl, imageStyle, imageSize, status: 'default' });
    addLog({ agent: 'System', message: `New record created: "${recordName}"`, type: 'success' });
};
  
export const runDudeCraftCopy = async (hashtags: string, addLog: LogFunction, addRecord: AddRecordFunction) => {
    addLog({ agent: 'Dude', message: `Alright, let's craft some killer launch copy from /release_build.zip.`, type: 'log' });
    addLog({ agent: 'Dude', message: `Using hashtags: ${hashtags}`, type: 'info' });
    await delay(500);
    
    addLog({ agent: 'Lyra', message: `Sourcing a punchy stat from the latest metrics...`, type: 'info' });
    const punchyStat = "Our new AI pipeline boosts content creation efficiency by over 300%!";
    await delay(1000);
    addLog({ agent: 'Lyra', message: `Stat confirmed: ${punchyStat}`, type: 'success' });
    
    addLog({ agent: 'Dude', message: `Rad stat. Generating LinkedIn + X copy...`, type: 'log' });
    const copy = await geminiService.generateLaunchCopy(hashtags, punchyStat);
    
    addLog({ agent: 'Dude', message: `Here's the LinkedIn draft:`, type: 'success' });
    addLog({ agent: 'Dude', message: copy.linkedin, type: 'log' });

    addLog({ agent: 'Dude', message: `And here's the X post:`, type: 'success' });
    addLog({ agent: 'Dude', message: copy.x, type: 'log' });
    
    const recordName = `Launch Copy: AI Promo Video`;
    const description = `**LinkedIn:**\n${copy.linkedin}\n\n**X (Twitter):**\n${copy.x}`;
    const imagePrompt = `An exciting illustration of a rocket launching with social media icons floating around it, representing a product launch on social media`;
    const imageStyle = ImageStyle.ILLUSTRATION;
    const imageSize = '16:9' as ImageSize;
    const imageUrl = await geminiService.generateImage(imagePrompt, imageStyle, imageSize);
    
    await addRecord({ name: recordName, description, category: Category.AI, imageUrl, imageStyle, imageSize, status: 'default' });
    addLog({ agent: 'System', message: `New record created: "${recordName}"`, type: 'success' });
};