// This file has been repurposed to act as the GitHub API service.

const GITHUB_API_URL = 'https://api.github.com';

const getAuthHeaders = () => {
    const token = localStorage.getItem('github_token');
    if (!token) return null;
    return {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
    };
};

const getRepoPath = () => {
    const owner = localStorage.getItem('github_owner');
    const repo = localStorage.getItem('github_repo');
    if (!owner || !repo) return null;
    return `repos/${owner}/${repo}`;
}

export const isConfigured = (): boolean => {
    return !!(getAuthHeaders() && getRepoPath());
}

export const getRepo = async () => {
    const headers = getAuthHeaders();
    const repoPath = getRepoPath();
    if (!headers || !repoPath) throw new Error('GitHub not configured');

    const response = await fetch(`${GITHUB_API_URL}/${repoPath}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch repo: ${response.statusText}`);
    return response.json();
}

export const getContents = async (path: string = '') => {
    const headers = getAuthHeaders();
    const repoPath = getRepoPath();
    if (!headers || !repoPath) throw new Error('GitHub not configured');

    const response = await fetch(`${GITHUB_API_URL}/${repoPath}/contents/${path}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch contents for path "${path}": ${response.statusText}`);
    const contents = await response.json();
    // Sort contents so directories appear first, then by name
    return contents.sort((a: any, b: any) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type === 'dir' ? -1 : 1;
    });
};

export const getFileContent = async (path: string) => {
    const data = await getContents(path);
    if (data.encoding !== 'base64') {
        throw new Error('Unsupported file encoding');
    }
    // In a browser environment, atob is available for base64 decoding.
    return atob(data.content);
}

export const createOrUpdateFile = async (path: string, content: string, commitMessage: string, sha?: string) => {
    const headers = getAuthHeaders();
    const repoPath = getRepoPath();
    if (!headers || !repoPath) throw new Error('GitHub not configured');

    const body = JSON.stringify({
        message: commitMessage,
        content: btoa(content), // btoa is available in browsers to base64 encode
        sha: sha, // Include SHA for updates, omit for new files
    });

    const response = await fetch(`${GITHUB_API_URL}/${repoPath}/contents/${path}`, {
        method: 'PUT',
        headers,
        body,
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to save file: ${error.message}`);
    }
    return response.json();
};

export const deleteFile = async (path: string, commitMessage: string, sha: string) => {
    const headers = getAuthHeaders();
    const repoPath = getRepoPath();
    if (!headers || !repoPath) throw new Error('GitHub not configured');

    const body = JSON.stringify({
        message: commitMessage,
        sha: sha,
    });

    const response = await fetch(`${GITHUB_API_URL}/${repoPath}/contents/${path}`, {
        method: 'DELETE',
        headers,
        body,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to delete file: ${error.message}`);
    }
    return response.json();
}