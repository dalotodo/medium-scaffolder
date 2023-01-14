<template>
  <q-page class="q-pa-md">
    <q-splitter v-model="split" style="height: 100vh;">
      <template #before>
        <div class="q-pa-sm">
          <CodeEditor v-model="sourceCode" class="full-width" :config="config" ></CodeEditor>
        </div>
      </template>

      <template #after>
        <div class="q-pa-sm">
          <CodeEditor v-model="targetCode" class="full-width" :config="config" :readonly="true"></CodeEditor>
        </div>
      </template>

      <template #separator>
        <q-btn color="primary" text-color="white" size="20px" round icon="chevron_right"  @click="doRender()" />
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import CodeEditor from 'src/components/codemirror-editor.vue';
import { useTemplateRenderingEngine } from 'src/lib/render';
import { useQuasar } from 'quasar';


const config = reactive({
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

const sample = {
  fields: [
      // Each row
      [ { id: 'name', label: 'Name', type: 'string' } ],
      [ { id: 'firstName', label: 'First name', type: 'string' }, { id: 'lastName', label: 'Last name', type: 'string' }, ],
      [ { id: 'isMarried', label: 'Is married?', type: 'boolean' } ],
  ]
}

const sourceCode = ref(JSON.stringify(sample, null, 4))
const targetCode = ref('')

const engine = useTemplateRenderingEngine();

const template = ref('form')


const languages = ref([
  ["json", "JSON"],
  ["typescript", "TS"],
])

async function doRender() {
  try {
    const data = JSON.parse(sourceCode.value);
    const code = await engine.render(template.value, data);
    targetCode.value = code;
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: `${err}`
    })
  }
}


</script>
