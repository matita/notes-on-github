import { pinia } from '@/stores';
import { useGithubSettings } from '@/stores/githubSettings';
// import { Octokit } from '@octokit/rest';

const settings = useGithubSettings(pinia);

let cacheOctokit: { get:(url:string)=>Promise<Response> };
const octokit = () => {
  if (cacheOctokit) {
    return cacheOctokit;
  }

  if (!settings.token && !settings.repo) {
    return null;
  }
  
  return cacheOctokit = (() => {
    const options = {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${settings.token}`,
      },
    };
    const BASE_URL = 'https://api.github.com'

    return {
      get: (url:string) => fetch(`${BASE_URL}${url}`, { ...options, method: 'GET' })
    }
  })();
  // return cacheOctokit = new Octokit({ 
  //   auth: settings.token,
  //   request: {
  //     fetch: window.fetch,
  //   }
  // });
}

const b64_to_utf8 = (str:string) => decodeURIComponent(escape(window.atob(str)));

export const fetchFileContent = async (filepath: string) => {
  const res = await octokit()?.get(`/repos/${settings.repoUser}/${settings.repoName}/contents/${filepath}`);
  const data = await res?.json();
  return b64_to_utf8(data.content);
};