

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ImageStyle, ImageSize, AppRecord, Suggestion, Category, WebsiteAnalysis } from '../types';
import * as instructionService from './instructionService';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this context, throwing an error is clear.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const _callTextApi = async (prompt: string, errorMessage: string, useSupervisorInstruction: boolean = false): Promise<string> => {
    const systemInstruction = instructionService.getSystemOrchestratorInstruction();
    
    let finalPrompt = prompt;
    if (useSupervisorInstruction) {
        const aiSupervisorInstruction = instructionService.getAiSupervisorInstruction();
        finalPrompt = `${aiSupervisorInstruction}\n\n== USER QUERY ==\n\n${prompt}`;
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2,
                topP: 0.8,
                topK: 10,
            }
        });
        const text = response.text;
        if (!text) {
            throw new Error('Received an empty response from the AI.');
        }
        // Clean up markdown code blocks if present
        return text.trim().replace(/^```(?:\w*\n)?([\s\S]*?)```$/, '$1').trim();
    } catch (error) {
        console.error(`Error with Gemini API for ${errorMessage}:`, error);
        throw new Error(`Failed to communicate with the AI service for ${errorMessage}.`);
    }
};

export const generateDescription = async (name: string): Promise<string> => {
  const prompt = `From the perspective of a UI/UX specialist, generate a concise, one-sentence description for a data record named "${name}". The description should be suitable for a technical audience and explain the record's purpose within a web application context.`;
  return _callTextApi(prompt, 'description generation', true);
};

export const generateImage = async (prompt: string, style?: ImageStyle, size?: ImageSize): Promise<string> => {
    const fullPrompt = style ? `${prompt}, in a ${style.toLowerCase()} style.` : prompt;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: size || '1:1',
            },
        });
        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error('No images were generated.');
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch(error) {
        console.error('Error generating image:', error);
        // Fallback to a placeholder image on error
        const placeholderBg = 'cccccc';
        const placeholderText = 'Image generation failed';
        return `https://via.placeholder.com/1024x576/${placeholderBg}/FFFFFF?text=${encodeURIComponent(placeholderText)}`;
    }
};

export const generateRecordSuggestions = async (record: AppRecord): Promise<Suggestion> => {
    const systemInstruction = instructionService.getSystemOrchestratorInstruction();
    const aiSupervisorInstruction = instructionService.getAiSupervisorInstruction();
    
    const userPrompt = `Analyze the following data record and suggest an improved name, a more detailed and professional description, and the most appropriate category.
    Current Record:
    - Name: ${record.name}
    - Description: ${record.description}
    - Category: ${record.category}

    Provide your response as a JSON object. The category must be one of "USER", "AI", or "SYSTEM".`;

    const fullPrompt = `${aiSupervisorInstruction}\n\n== USER QUERY ==\n\n${userPrompt}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING, enum: Object.values(Category) },
                },
                required: ['name', 'description', 'category'],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Suggestion;
};

export const analyzeWebsite = async (url: string): Promise<WebsiteAnalysis> => {
    const systemInstruction = `You are an expert Senior Web Analyst. Your task is to analyze a given website URL and provide a comprehensive, structured report in JSON format. The analysis should be insightful and cover key areas like purpose, structure, SEO, UX, performance, and technology stack.`;
    
    const userPrompt = `Please provide a detailed analysis of the website at the following URL: ${url}.

    Your analysis should include:
    1.  **description**: A concise summary of the website's purpose and primary audience.
    2.  **pages**: A list of the most important or representative pages/sections of the site (e.g., "Home", "About Us", "Products", "Blog").
    3.  **inDepthAnalysis**: A list of observations. Each observation should have a 'title' (e.g., "SEO Strengths", "UX/UI Opportunities", "Performance Bottlenecks") and detailed 'content' written in paragraphs.
    4.  **techStack**: A list of technologies, frameworks, or libraries you can identify from the website's behavior or source.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { 
                        type: Type.STRING,
                        description: "A concise summary of the website's purpose and primary audience."
                    },
                    pages: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "A list of the most important pages/sections."
                    },
                    inDepthAnalysis: {
                        type: Type.ARRAY,
                        description: "Detailed analysis points on topics like SEO, UX, Performance, etc.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The title of the analysis point (e.g., 'SEO Strengths')." },
                                content: { type: Type.STRING, description: "The detailed content of the analysis." }
                            },
                            required: ['title', 'content']
                        }
                    },
                    techStack: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "A list of identified technologies or frameworks."
                    }
                },
                required: ['description', 'pages', 'inDepthAnalysis', 'techStack']
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as WebsiteAnalysis;
};

export const generateRefinedHtmlPage = async (records: AppRecord[], userPrompt: string): Promise<string> => {
    const recordsData = records.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        imageUrl: r.imageUrl
    }));

    const prompt = `
You are an expert web designer specializing in "glass morphism" and interactive JavaScript. Your task is to create a single, cohesive, and visually appealing HTML page that synthesizes information from a collection of data records.

**User's Goal:**
${userPrompt}

**Source Records (JSON):**
${JSON.stringify(recordsData, null, 2)}

**Styling Requirement: Glass Morphism**
The page will be displayed over a dark, vibrant image (like Las Vegas at night). All primary containers, cards, and interactive elements MUST use the glass morphism effect. Use embedded CSS for all styling.
- Use a dark theme with neon text highlights (e.g., cyan, magenta).
- Use this CSS as a reference for glass containers:
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    padding: 20px;
    color: #e0e0e0;
  }
- Font families to use: 'Orbitron' for headings, 'Rajdhani' for body text.

**Data & Interactivity Requirement:**
1.  The page must be fully self-contained with no external script or style dependencies (except Google Fonts).
2.  Embed the provided records data into the page inside a script tag: \`<script id="records-data" type="application/json">${JSON.stringify(recordsData, null, 2)}</script>\`.
3.  Write JavaScript within a \`<script>\` tag at the end of the \`<body>\` to perform the following:
    a.  **On page load**, retrieve the JSON from the \`#records-data\` script tag.
    b.  **Dynamically render** each record into a 'glass-card' and append it to a main container div. Each card should display the record's image, name, and description.
    c.  **Add interaction**: To each card, add an "Edit" button. When clicked, it should hide the description paragraph and show a \`<textarea>\` with the current description, along with a "Save" button.
    d.  **Simulate updates**: The "Save" button, when clicked, should read the value from the textarea, update the record data *in the JavaScript array*, and then re-render that specific card to show the change. It should also log the "updated" record object to the console to simulate a POST request (e.g., \`console.log('Simulating POST:', updatedRecord);\`). This demonstrates a full interactive loop.

**Final Output:**
Return ONLY the raw, complete HTML code for a single .html file. Do NOT include any markdown specifiers like \`\`\`html. The response MUST start with \`<!DOCTYPE html>\` and end with \`</html>\`.
`;

    return _callTextApi(prompt, 'refined HTML page generation', false); // No supervisor instruction needed for this direct a command
};


export const generateYamlPlan = (topic: string): Promise<string> => {
    const prompt = `Create a detailed, structured project plan in YAML format for a new software project with the topic: "${topic}".
    The YAML should include keys like 'project_name', 'objective', 'milestones' (with 'name', 'tasks', 'due_date'), and 'team_roles'.
    Be creative and thorough.`;
    return _callTextApi(prompt, 'YAML plan generation', true);
};

export const generateJsonRequirements = (yamlPlan: string): Promise<string> => {
    const prompt = `Based on the following YAML project plan, generate a detailed set of technical requirements in JSON format.
    The JSON should be an array of objects, where each object has 'id', 'component', 'requirement_description', and 'priority' (High, Medium, Low).
    YAML Plan:
    ---
    ${yamlPlan}
    ---`;
    return _callTextApi(prompt, 'JSON requirements generation', true);
};

export const generateMarkdownSummary = (jsonRequirements: string): Promise<string> => {
    const prompt = `Based on the following JSON of technical requirements, write a concise but comprehensive project summary in GitHub-flavored Markdown.
    The summary should include a title, a brief overview, a section for key features (as a bulleted list), and a table of requirements.
    JSON Requirements:
    ---
    ${jsonRequirements}
    ---`;
    return _callTextApi(prompt, 'Markdown summary generation', true);
};

export const generateHtmlPreview = (topic: string, yamlPlan: string, jsonRequirements: string, mdSummary: string): Promise<string> => {
    const prompt = `Create a single, self-contained, visually appealing HTML file that acts as a project dashboard for the project: "${topic}".
    Incorporate the following data into the HTML:
    1. A project overview section based on the Markdown summary.
    2. A section displaying key milestones from the YAML plan.
    3. A section displaying the technical requirements from the JSON data, perhaps in a styled table.

    Use inline or embedded CSS for styling. Make it professional, modern, and easy to read. Use a dark theme. Do not include any \`\`\`html or markdown specifiers in your response, just return the raw HTML code.

    ---
    Markdown Summary:
    ${mdSummary}
    ---
    YAML Plan:
    ${yamlPlan}
    ---
    JSON Requirements:
    ${jsonRequirements}
    ---
    `;
    return _callTextApi(prompt, 'HTML preview generation', true);
};

export const generateLaunchCopy = async (hashtags: string, punchyStat: string): Promise<{ linkedin: string, x: string }> => {
    const prompt = `You are "Dude", a hip and energetic marketing copywriter.
    Your task is to craft compelling launch copy for a new AI feature.
    - Incorporate this key statistic: "${punchyStat}"
    - Include these hashtags: ${hashtags}

    Write one post for LinkedIn (professional but engaging) and one for X (Twitter) (short, punchy, and exciting).
    Provide your response as a JSON object.`;
    
    const systemInstruction = instructionService.getSystemOrchestratorInstruction();

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    linkedin: { type: Type.STRING },
                    x: { type: Type.STRING },
                },
                required: ['linkedin', 'x'],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as { linkedin: string, x: string };
};