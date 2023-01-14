<template>
  <editor-content :editor="editor" :content="inputValue" />
</template>
<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>
<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3'
import { useEditor, VueNodeViewRenderer } from '@tiptap/vue-3'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

import { lowlight } from 'lowlight'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

const props = defineProps( {
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed( {
  get: ()=>props.modelValue,
  set: (value)=>emit('update:modelValue',value),
})


const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    // CodeBlockLowlight
    //       .extend({
    //         addNodeView() {
    //           return VueNodeViewRenderer(CodeBlockComponent)
    //         },
    //       })
    //       .configure({ lowlight }),
  ],
  onUpdate: ()=> inputValue.value = editor.value?.getText()||''
})

watch( ()=>props.modelValue, (value)=>editor.value?.commands.setContent(value,false))

onUnmounted( ()=> { editor.value?.destroy() })
</script>
