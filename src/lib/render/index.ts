import { createTemplatesRepository } from "./templates";

export interface ITemplateRenderingEngine {
  render<T>(name: string, data: T): Promise<string>;
}


export function useTemplateRenderingEngine() {
  const templates = createTemplatesRepository();

  const engine : ITemplateRenderingEngine = {

    render: async (name, data) => {
      const t = templates[name];
      if (!t) throw new Error(`Could not find template '${name}'`);
      const template = await t.getValue();
      console.log(template)
      return template(data);
    }
  }

  return engine;
}
