<template>
  <q-page class="q-pa-md">
    <q-splitter v-model="split" style="height: 100vh;">
      <template #before>
        <div class="q-pa-sm">
          <CodeEditor v-model="sourceCode" class="full-width" :language-selector="true" :languages="languages"></CodeEditor>
        </div>
      </template>
      <template #separator>
        <q-btn color="primary" text-color="white" size="20px" round icon="chevron_right" @click="doRender()" />
      </template>
      <template #after>
        <div class="q-pa-sm">
          <CodeEditor v-model="targetCode" class="full-width" :readonly="true"></CodeEditor>
        </div>
        <!-- <CodeDisplay v-model="sourceCode" /> -->
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CodeEditor from 'simple-code-editor';
import { useTemplateRenderingEngine } from 'src/lib/render';
import { useQuasar } from 'quasar';


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
    const code = engine.render(template.value, data);
    targetCode.value = code;
  } catch (err) {
    $q.notify({
      type: 'info',
      message: `${err}`
    })
  }
}


</script>
