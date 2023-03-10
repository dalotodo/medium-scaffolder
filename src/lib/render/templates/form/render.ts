import Mustache from 'mustache'
import { RenderFormField, RenderFormTemplate } from './models';

import template from './form.mustache?raw'


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

function preProcess(src: RenderFormTemplate ) {
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

Mustache.parse(template)

export default function render(data: RenderFormTemplate) {
  const model = preProcess(data);
  return Mustache.render(template, model)
}
