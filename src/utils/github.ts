import { pinia } from '@/stores';
import { useSettings } from '@/stores/settings';

const BASE_URL = 'https://api.github.com'

const settings = useSettings(pinia);

interface GitHubApi {
  get: (url:string )=> Promise<Response>,
  put: (url:string, body:any) => Promise<Response>,
}

export interface UpdateFileOptions {
  content: string,
  sha?: string,
  message: string,
}

let cacheApi: GitHubApi;
const api = ():GitHubApi | null => {
  if (cacheApi) {
    return cacheApi;
  }

  if (!settings.token && !settings.repo) {
    return null;
  }
  
  return cacheApi = (() => {
    const options = {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${settings.token}`,
      },
    };

    return {
      get: (url:string) => fetch(`${BASE_URL}${url}`, { ...options, method: 'GET' }),
      put: (url:string, body:any) => fetch(`${BASE_URL}${url}`, { 
        ...options, 
        method: 'PUT', 
        body: JSON.stringify(body), 
      }),
    }
  })();
}

const base64ToUtf8 = (str:string) => decodeURIComponent(escape(window.atob(str)));
const utf8ToBase64 = (str:string) => window.btoa(unescape(encodeURIComponent( str )))

export const fetchFile = async (filepath: string) => {
  const res = await api()?.get(`/repos/${settings.repoUser}/${settings.repoName}/contents/${filepath}`);
  const data = await res?.json();
  
  if (typeof data?.content === 'undefined') {
    return null;
  }
  
  return {
    sha: data.sha,
    content: base64ToUtf8(data.content),
  };
};

export const updateFileContent = async (filepath: string, payload: UpdateFileOptions) => {
  const content = utf8ToBase64(payload.content);
  const message = payload.message || 'Update file';
  const { sha } = payload;
  const res = await api()?.put(`/repos/${settings.repoUser}/${settings.repoName}/contents/${filepath}`, { 
    content, 
    message, 
    sha 
  });
  const data = await res?.json();
  
  return data;
}