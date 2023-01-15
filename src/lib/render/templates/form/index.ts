import { RenderTemplate, RenderTemplateProcessingFunction } from '../../models';
import { RenderFormTemplate } from './models';

import sample from './sample.json?raw'
import render from './render'


const template : RenderTemplate<RenderFormTemplate> = {
  render,
  sample
}

export default template;
