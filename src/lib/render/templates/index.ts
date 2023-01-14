import Module from "module";
import { RenderTemplateProcessingFunction } from "../models";

// const importers = import.meta.glob<RenderTemplateProcessingFunction>(
//   "./*/index.ts"
// );
type ModuleWithRender = Module & { default: RenderTemplateProcessingFunction; }

const importers = import.meta.glob<ModuleWithRender>("./*/index.ts");

class Lazy<T> {
  private _value?: T;
  private readonly _factory: () => Promise<T>;

  constructor(factory: () => Promise<T>) {
    this._factory = factory;
  }

  getValue = async () => {
    this._value =
      typeof this._value === "undefined" ? await this._factory() : this._value!;
    return this._value!;
  };
}

export function createTemplatesRepository() {
  const repository: Record<string, Lazy<RenderTemplateProcessingFunction>> = {};
  const keys = Object.keys(importers);
  for (const fileName of keys) {

    const key = fileName.replace('./','').replace('/index.ts', '');
    const template = new Lazy<RenderTemplateProcessingFunction>( async()=> {
      const m = await importers[fileName]()
      console.log('Module', m)
      return m.default
    });
    console.log(fileName,key,importers[fileName])
    repository[key] = template;
  }
  return repository;
}
