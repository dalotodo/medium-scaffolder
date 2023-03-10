<template>
  <div class="editor">
    <div class="main">
      <codemirror
        v-model="code"
        :style="{
          width: preview ? '50%' : '100%',
          height: config.height,
          backgroundColor: '#fff',
          color: '#333',
        }"
        placeholder="Please enter the code."
        :extensions="extensions"
        :autofocus="config.autofocus"
        :disabled="config.disabled"
        :indent-with-tab="config.indentWithTab"
        :tab-size="config.tabSize"
        @update="handleStateUpdate"
        @ready="handleReady"
        @focus="log('focus', $event)"
        @blur="log('blur', $event)"
      />
      <pre
        v-if="preview"
        class="code"
        :style="{ height: config.height, width: preview ? '50%' : '0px' }"
        >{{ code }}</pre
      >
    </div>
    <div class="divider"></div>
    <div class="footer">
      <div class="buttons">
        <button class="item" @click="togglePreview">
          <span>Preview</span>
          <i
            class="iconfont"
            :class="preview ? 'icon-eye' : 'icon-eye-close'"
          ></i>
        </button>
        <button class="item" @click="handleUndo">Undo</button>
        <button class="item" @click="handleRedo">Redo</button>
      </div>
      <div class="infos">
        <span class="item">Spaces: {{ config.tabSize }}</span>
        <span class="item">Length: {{ state.length }}</span>
        <span class="item">Lines: {{ state.lines }}</span>
        <span class="item">Cursor: {{ state.cursor }}</span>
        <span class="item">Selected: {{ state.selected }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive,shallowRef,computed} from "vue";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { redo, undo } from "@codemirror/commands";
import { Codemirror } from "vue-codemirror";
import { javascript } from '@codemirror/lang-javascript'

// Editor is based on great vue-codemirror component from @SURMON-CHINA
// At: https://github.surmon.me/vue-codemirror

const props = defineProps({
  config: { type: Object, required: true },
  modelValue: { type: String, required: true },
  theme: [Object, Array],
  language: Function,
});

const emit = defineEmits( ['update:modelValue'] )

const log = console.log;

// const code = shallowRef(props.code);
const code = computed( {
  get: ()=>props.modelValue||'',
  set: (value)=>emit('update:modelValue', value),
})

const extensions = computed(() => {
  const result = [];
  result.push( javascript({ typescript: true }) )

  if (props.language) {
    result.push(props.language());
  }
  if (props.theme) {
    result.push(props.theme);
  }
  return result;
});

const preview = shallowRef(false);
const togglePreview = () => {
  preview.value = !preview.value;
};

const cmView = shallowRef<EditorView>();
const handleReady = ({ view }: any) => {
  cmView.value = view;
};

// https://github.com/codemirror/commands/blob/main/test/test-history.ts
function handleUndo() {
  undo({
    state: cmView.value!.state,
    dispatch: cmView.value!.dispatch,
  });
}

function handleRedo() {
  redo({
    state: cmView.value!.state,
    dispatch: cmView.value!.dispatch,
  });
}

const state = reactive({
  lines: null as null | number,
  cursor: null as null | number,
  selected: null as null | number,
  length: null as null | number,
});

function handleStateUpdate(viewUpdate: ViewUpdate) {
  // selected
  const ranges = viewUpdate.state.selection.ranges;
  state.selected = ranges.reduce(
    (plus, range) => plus + range.to - range.from,
    0
  );
  state.cursor = ranges[0].anchor;
  // length
  state.length = viewUpdate.state.doc.length;
  state.lines = viewUpdate.state.doc.lines;
  // log('viewUpdate', viewUpdate)
}




</script>

<style lang="scss" scoped>
@import "src/css/codemirror.variables.scss";

.editor {
  .divider {
    height: 1px;
    background-color: $border-color;
  }

  .main {
    display: flex;
    width: 100%;

    .code {
      width: 30%;
      height: 100px;
      margin: 0;
      padding: 0.4em;
      overflow: scroll;
      border-left: 1px solid $border-color;
      font-family: monospace;
    }
  }

  .footer {
    height: 3rem;
    padding: 0 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 90%;

    .buttons {
      .item {
        margin-right: 1em;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: 1px dashed $border-color;
        font-size: $font-size-small;
        color: $text-secondary;
        cursor: pointer;
        .iconfont {
          margin-left: $xs-gap;
        }
        &:hover {
          color: $text-color;
          border-color: $text-color;
        }
      }
    }

    .infos {
      .item {
        margin-left: 2em;
        display: inline-block;
        font-feature-settings: "tnum";
      }
    }
  }
}
</style>
