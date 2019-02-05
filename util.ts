export function equals<T extends object>(a: T, b: T, key: (t: T) => any) {
  return key(a) === key(b);
}

function identity<T>(a: T) {
  return a;
}

/**
 * List Functions
 */
export function uniq<T>(xs: T[]): T[] {
  return uniqBy(identity, xs);
}

export function uniqBy<T>(keyFn: (t: T) => any, xs: T[]): T[] {
  return xs.reduce(
    (acc: T[], x) => {
      if (acc.map(keyFn).includes(keyFn(x))) {
        return acc;
      }
      acc.push(x);
      return acc;
    },
    [] as T[]
  );
}

export function flatMap<T, S>(f: (x: T) => S[], xs: T[]) {
  return xs.map(f).reduce((acc: S[], xs: S[]) => [...acc, ...xs], []);
}
