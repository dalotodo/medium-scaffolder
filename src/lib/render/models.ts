
export type RenderTemplateProcessingFunction<T> = (src: T) => string;

export type RenderTemplate<T=any> = {
   render: RenderTemplateProcessingFunction<T>;
   sample: string;
}
