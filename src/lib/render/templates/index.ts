import Module from "module";
import { RenderTemplate } from "../models";

type ModuleWithRender = Module & { default: RenderTemplate; }

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
  const repository: Record<string, Lazy<RenderTemplate>> = {};
  const keys = Object.keys(importers);
  for (const fileName of keys) {

    const key = fileName.replace('./','').replace('/index.ts', '');
    const template = new Lazy<RenderTemplate>( async()=> {
      const m = await importers[fileName]()
      return m.default
    });
    repository[key] = template;
  }
  return repository;
}
