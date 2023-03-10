<template>
  <q-page class="q-pa-md">

    <q-splitter v-model="split" style="height: 100vh;">
      <template #before>
        <div class="q-pa-sm">
          <q-card>
            <q-toolbar class="bg-primary text-white">
              <q-btn-dropdown stretch flat :label="dropdownLabel">
                <q-list>
                  <template v-for="item in templates.items">
                      <q-item clickable v-close-popup tabindex="0" @click="doSelectTemplate(item)">
                        {{ t(item) }}
                      </q-item>
                  </template>
                </q-list>
              </q-btn-dropdown>
            </q-toolbar>
            <q-card-section>
              <CodeEditor v-model="sourceCode" class="full-width" :config="editorConfig" ></CodeEditor>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template #after>
        <div class="q-pa-sm">
          <q-card>
            <q-toolbar class="bg-primary text-white">
              <q-space />
              <q-btn icon="content_copy" flat dense @click="copyToClipboard()" />
            </q-toolbar>
            <q-card-section>
              <CodeEditor v-model="targetCode" class="full-width" :config="editorConfig" :readonly="true"></CodeEditor>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template #separator>
        <q-btn color="primary" text-color="white" size="20px" round icon="chevron_right" :disable="!isTemplateSelected"  @click="doRender()" />
      </template>
    </q-splitter>
  </q-page>
</template>
<i18n>
  'en-US':
    'combo': 'Choose your template'
    'copied-to-clipboard': 'Copied to clipboard!'
    'form': 'Form'


</i18n>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import CodeEditor from 'src/components/codemirror-editor.vue';
import { useTemplates } from 'src/lib/render';
import { useQuasar } from 'quasar';
import { RenderTemplate } from 'src/lib/render/models';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const editorConfig = reactive({
        disabled: false,
        indentWithTab: true,
        tabSize: 2,
        autofocus: true,
        height: 'auto',
        language: 'javascript',
        theme: 'oneDark'
})

const $q = useQuasar();

const split = ref(40);

const sourceCode = ref('')
const targetCode = ref('')

const templates = useTemplates();

const selected = ref<string>()
const dropdownLabel = computed( ()=>t(selected.value||'combo') )

const template = ref<RenderTemplate>();
const isTemplateSelected = computed( ()=>!!template.value)

async function  doSelectTemplate(name: string) {
  const t = await templates.loadTemplateAsync(name)
  selected.value = name;
  template.value = t;
  sourceCode.value = t.sample;
}

async function doRender() {
  try {
    const data = JSON.parse(sourceCode.value);
    const code = ( await template.value?.render(data) )|| '';
    targetCode.value = code;
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: `${err}`
    })
  }
}

async function copyToClipboard() {
  try {
    navigator.clipboard.writeText(targetCode.value)
    $q.notify( { position: 'top', type: 'positive', message: t('copied-to-clipboard'), timeout: 1000 })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: `${err}`
    })
  }
}

</script>
