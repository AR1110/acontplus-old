import { Injectable } from '@angular/core';
import { LookupType } from '@core/models/lookup-type';

@Injectable({ providedIn: 'root' })
export class LookupCache {
  // module → context → object with multiple lookup lists
  private cache = new Map<string, Map<string, Record<string, any>>>();

  private getModuleCache(module: string): Map<string, Record<string, any>> {
    if (!this.cache.has(module)) {
      this.cache.set(module, new Map());
    }
    return this.cache.get(module)!;
  }

  set(type: LookupType, data: Record<string, any>): void {
    const moduleCache = this.getModuleCache(type.module);
    moduleCache.set(type.context, data);
  }

  get(type: LookupType): Record<string, any> | undefined {
    const moduleCache = this.getModuleCache(type.module);
    return moduleCache.get(type.context);
  }

  getByKeys(type: LookupType, keys: string): Record<string, any> | undefined {
    const moduleCache = this.getModuleCache(type.module);
    const contextCache = moduleCache.get(type.context);

    if (!contextCache) return undefined;

    const keysArray = keys.split(',').map((k) => k.trim());
    const result: Record<string, any> = {};

    for (const key of keysArray) {
      if (contextCache[key] !== undefined) {
        result[key] = contextCache[key];
      }
    }

    return result;
  }

  clear(type?: LookupType): void {
    if (!type) {
      this.cache.clear();
      return;
    }

    const moduleCache = this.cache.get(type.module);
    if (!moduleCache) return;

    moduleCache.delete(type.context);
    if (moduleCache.size === 0) this.cache.delete(type.module);
  }

  clearModule(module: string): void {
    this.cache.delete(module);
  }
}
