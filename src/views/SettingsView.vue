<script setup lang="ts">
  import { useGithubSettings } from '@/stores/githubSettings';
import { reactive } from 'vue';

  const githubSettings = useGithubSettings();

  const settings = reactive({
    token: githubSettings.token,
    repo: githubSettings.repo,
  });

  const onSubmit = () => {
    const [ repoUser, repoName ] = settings.repo.split('/');

    if (!repoUser || !repoName) {
      return alert('Repo has to be with format `user/repo-name`!');
    }

    githubSettings.save({ 
      token: settings.token, 
      repoUser, 
      repoName,
    });
  }
</script>

<template>
  <div class="wrapper">
    <form @submit.stop.prevent="onSubmit">
      <p>
        <label>
          GitHub token 
          (<a 
              href="https://github.com/settings/tokens/new?scopes=repo&description=notes-on-github" 
              target="_blank"
            >Generate one</a>)
          <input 
            placeholder="You'll only see it when setting it"
            @input="settings.token = ($event.target as HTMLInputElement).value" 
          />
        </label>
      </p>

      <p>
        <label>
          GitHub repo
          <input 
            placeholder="user/repo-name" 
            :value="settings.repo" 
            @input="settings.repo = ($event.target as HTMLInputElement).value" 
          />
        </label>
      </p>
      <p>
        <button >Save</button>
      </p>
    </form>
  </div>
</template>

<style scoped>
.wrapper {
  max-width: 800px;
  margin: 0 auto;
}

input {
  width: 100%;
}
</style>
