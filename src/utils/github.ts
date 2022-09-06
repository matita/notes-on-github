import { pinia } from '@/stores';
import { useGithubSettings } from '@/stores/githubSettings';

const BASE_URL = 'https://api.github.com'

const settings = useGithubSettings(pinia);

let cacheApi: { get:(url:string)=>Promise<Response> };
const api = () => {
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
      get: (url:string) => fetch(`${BASE_URL}${url}`, { ...options, method: 'GET' })
    }
  })();
}

const b64_to_utf8 = (str:string) => decodeURIComponent(escape(window.atob(str)));

export const fetchFileContent = async (filepath: string) => {
  const res = await api()?.get(`/repos/${settings.repoUser}/${settings.repoName}/contents/${filepath}`);
  const data = await res?.json();
  console.log('data', data);
  if (!data?.content) {
    return null;
  }
  return b64_to_utf8(data.content);
};