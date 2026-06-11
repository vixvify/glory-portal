export function isEmptyAll(...items: (unknown[] | string | { length: number } | null | undefined)[]): boolean {
  return items.every((item) => {
    if (item === null || item === undefined) return true;
    return item.length === 0;
  });
}
