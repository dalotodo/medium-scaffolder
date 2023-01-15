
export type RenderFormTemplateRow = RenderFormField[];
export type RenderFormField = {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  objectType?: string;
}

export type RenderFormTemplate = {
  fields: RenderFormTemplateRow[];
}
