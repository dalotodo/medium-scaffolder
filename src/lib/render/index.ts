import { defineStore } from "pinia";
import { computed } from "vue";
import { RenderTemplate } from "./models";
import { createTemplatesRepository } from "./templates";

export interface ITemplateRenderingEngine {
  load(name: string): Promise<RenderTemplate>;
  render<T>(name: string, data: T): Promise<string>;
}

export const useTemplates = defineStore('templates', ()=> {
  const templates = createTemplatesRepository();

  const loadTemplateAsync = async (name: string)=>  {
    const t = templates[name];
    if (!t) throw new Error(`Could not find template '${name}'`);
    const template = await t.getValue();
    return template;
  }

  const items = computed( ()=>Object.keys(templates))

  return {
    items,
    loadTemplateAsync
  }

})



