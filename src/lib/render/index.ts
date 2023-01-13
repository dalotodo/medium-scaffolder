import Mustache from 'mustache'

import form from './templates/form.mustache?raw'


type RenderTempalteProcessingFunction = (src: any) => any;
export type RenderTemplate = {
  id: string;
  template: string;
  process?: RenderTempalteProcessingFunction;
}

type RenderFormTemplateRow = RenderFormField[];
type RenderFormField = {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  objectType?: string;
}

export type RenderFormTemplate = {
  fields: RenderFormTemplateRow[];
}

function inferPropType(field: RenderFormField) {
  switch (field.type) {
    case 'string': return { propType: 'String', defaultValue: ()=> (text: string)=>`''` };
    case 'number': return { propType: 'Number', defaultValue: ()=> (text: string)=>`0` };
    case 'boolean': return { propType: 'Boolean', defaultValue: ()=> (text: string)=>`false` }
    case 'object': return { propType: `Object as PropType<${field.objectType}>`, defaultValue: ()=> (text: string)=>`undefined` };
  }
}

function inferComponentType(field: RenderFormField) {
  switch (field.type) {
    case 'string': return { isInput: true, inputType: 'text' };
    case 'number': return { isInput: true, inputType: 'number' };
    case 'boolean': return { isToggle: true };
    case 'object': return `Object as PropType<${field.objectType}>`;
  }
}

export const templates: RenderTemplate[] = [
  {
    id: 'form', template: form, process: (src: RenderFormTemplate) => {
      const rows = src.fields.map(row => {
        const fields = row.map(field => {
          const propInfo = inferPropType(field);
          const component = inferComponentType(field);
          return { ...field, ...propInfo, component,  }
        })
        // How many columns
        const cols = (row.length > 0) ? 12 / row.length : 12;
        return { fields, cols }
      });
      return { rows }
    }
  }
];



export function useTemplateRenderingEngine() {

  const engine = {
    addTemplate: (item: RenderTemplate) => {
      templates.push(item);
      Mustache.parse(item.template);
    },
    render: <T>(name: string, data: T) => {
      const t = templates.find(x => x.id === name);
      const template = t ? t.template : name;
      const processed = (t?.process) ? t.process(data) : data;
      const result = Mustache.render(template, processed,);
      return result;
    }
  }

  templates.forEach(t => engine.addTemplate(t))

  return engine;

}
