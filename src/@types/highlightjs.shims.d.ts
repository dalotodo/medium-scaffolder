
declare module 'vue3-highlightjs' {
  import type { Plugin } from 'vue';

  const plugin : Plugin;
  export default plugin;

}

declare module 'simple-code-editor' {
  import type { DefineComponent } from 'vue';
   const component: DefineComponent<{}, {}, any>;

  export default component;
}

declare module 'highlightjs-vue' {
  import { LanguageFn } from 'highlight.js';
  const fn : LanguageFn;
  export default fn;
}
