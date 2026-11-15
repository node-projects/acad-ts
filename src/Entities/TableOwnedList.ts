import type { CadObject } from '../CadObject.js';

/** Array-compatible table collection with atomic ownership checks and removal. */
export function tableOwnedList<T extends { owner: CadObject | null }>(owner: () => CadObject | null): T[] {
  const items: T[] = [];
  const update = (next: T[]) => {
    const seen = new Set<T>();
    for (const item of next) {
      if (!item) continue;
      if (seen.has(item) || (item.owner != null && !items.includes(item))) throw new Error('Component already belongs to a table.');
      seen.add(item);
    }
    for (const item of items) if (item && !seen.has(item)) item.owner = null;
    for (const item of next) if (item && !items.includes(item)) item.owner = owner();
    items.length = 0;
    // Avoid argument limits for large tables.
    for (const item of next) items.push(item);
  };
  return new Proxy(items, {
    get(target, key, receiver) {
      if (['push', 'pop', 'shift', 'unshift', 'splice'].includes(String(key))) {
        return (...args: unknown[]) => {
          const next = items.slice();
          const result = Reflect.apply(Reflect.get(Array.prototype, key), next, args);
          update(next);
          return result;
        };
      }
      // Reordering does not change ownership.
      if (key === 'sort' || key === 'reverse') return (...args: unknown[]) => {
        Reflect.apply(Reflect.get(Array.prototype, key), items, args); return receiver;
      };
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value) {
      if (key === 'length' || /^(0|[1-9]\d*)$/.test(String(key))) {
        const next = items.slice(); Reflect.set(next, key, value); update(next); return true;
      }
      return Reflect.set(target, key, value);
    },
  });
}
