
export type RenderTemplateProcessingFunction<T=any> = (src: T) => string;

export type RenderTemplate<T=any> = {
   render: RenderTemplateProcessingFunction<T>;
   sample: string;
}
