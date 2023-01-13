import { boot } from 'quasar/wrappers';
import { Component } from 'vue';

const components : Record<string,Component> = {

}


export default boot(({ app }) => {
  // Register Components Globally
  Object.entries( components ).forEach( ([name,component])=> app.component(name,component) )
});
