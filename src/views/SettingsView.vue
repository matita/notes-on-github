<script setup lang="ts">
import { useSettings } from '@/stores/settings';
import { reactive } from 'vue';
import CodeEditor from '@/components/CodeEditor.vue';

  const settingsStore = useSettings();

  const settings = reactive({
    token: settingsStore.token,
    repo: settingsStore.repo,
    newNoteFilepath: settingsStore.newNoteFilepath,
    newNoteTemplate: settingsStore.newNoteTemplate,
    separator: settingsStore.separator,
  });

  const onSubmit = () => {
    const [ repoUser, repoName ] = settings.repo.split('/');

    if (!repoUser || !repoName) {
      return alert('Repo has to be with format `user/repo-name`!');
    }

    settingsStore.save({ 
      token: settings.token, 
      repoUser, 
      repoName,
      newNoteFilepath: settings.newNoteFilepath,
      newNoteTemplate: settings.newNoteTemplate,
      separator: settings.separator,
    });
    alert('Settings saved!');
  }
</script>

<template>
  <div class="wrapper">
    <form @submit.stop.prevent="onSubmit">
      <h1>Settings</h1>
      
      <h2>GitHub token</h2>
      <p>
        Authentication token to read and write on repository 
        &mdash; 
        <a 
          href="https://github.com/settings/tokens/new?scopes=repo&description=notes-on-github" 
          target="_blank"
        >Generate one</a>.
      </p>
      <input 
        placeholder="You'll only see it when setting it"
        @input="settings.token = ($event.target as HTMLInputElement).value" 
      />

      
      <h2>GitHub repository</h2>
      <p>Where to store the notes.</p>
      <input 
        placeholder="user/repo-name" 
        :value="settings.repo" 
        @input="settings.repo = ($event.target as HTMLInputElement).value" 
      />
      
      <h2>New note filepath</h2>
      <p>When first opening the editor this is the file that will be opened, if it doesn't
      exist yet it will be created as soon as you type any character.</p>
      <input 
        placeholder="e.g. notes/{YYYY}-{MM}-{DD}.md" 
        :value="settings.newNoteFilepath" 
        @input="settings.newNoteFilepath = ($event.target as HTMLInputElement).value" 
      />

      <h2>New note template</h2>
      <p>
        Text that will be added when opening the editor with the <code>?append</code> URL parameter.<br />
        <code>{value}</code> keyword will be replaced with the value of the <code>?append</code> parameter.
      </p>
      <CodeEditor
        :value="settings.newNoteTemplate"
        @change="settings.newNoteTemplate = $event"
      />

      <h2>Notes separator</h2>
      <p>
        When the file to which you want to <code>?append</code> the new note template already exists,
        this separator is prefixed to the new note template itself.
      </p>
      <CodeEditor
        :value="settings.separator"
        @change="settings.separator = $event"
      />

      <hr />
      
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
  padding: 2em;
}

input, textarea {
  width: 100%;
  padding: .6em;
  border-radius: 4px;
  border: 1px solid #999;
  margin-top: .4em;
  margin-bottom: .4em;
}

h1, h2, h3, h4, h5 {
  margin-bottom: 0;
}

p {
  margin: 0;
}

p + p {
  margin-top: 1em;
}

hr {
  margin-top: 2em;
  margin-bottom: 2em;
}
</style>
