<template>
  <q-card>
    <q-toolbar class="bg-primary text-white">
      <q-space />
      <q-btn flat icon="content_copy" @click="copyToClipboard()" />
    </q-toolbar>

      <!-- <pre ref="placeholder" class="language-javascript"><code>{{ sourceCode }}</code> </pre> -->
       <!-- <pre v-highlightjs="sourceCode"><code class="vue"></code></pre>
      <highlightjs language="vue" :code="sourceCode" /> -->
    <highlightjs autodetect :code="sourceCode" />

  </q-card>
</template>
<style lang="scss">
@import 'highlight.js/styles/stackoverflow-dark.css';
</style>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, watch } from 'vue';

const $q = useQuasar();

const props = defineProps({
  modelValue: { type: String },
})


const sourceCode = computed(() => props.modelValue || '')

async function copyToClipboard() {
  await navigator.clipboard.writeText(sourceCode.value);
  $q.notify( {
    message: 'Source code copied to clipboard',
    position: 'top',
    color: 'info',
    icon: 'check_circle',
    timeout: 1000,
  })
}

</script>
