export function equals<T>(a: T, b: T, key: (t: T) => any) {
  return key(a) === key(b);
}

function identity<T>(a: T) {
  return a;
}

export function tap<T>(f: (s: T) => any | void) {
  const w = (x: T) => {
    f(x);
    return x;
  };
  return w;
}

/**
 * List Functions
 */

export function uniq<T>(xs: T[]): T[] {
  return uniqBy(identity, xs);
}

export function uniqBy<T>(keyFn: (t: T) => any, xs: T[]): T[] {
  return xs.reduce(
    (acc: T[], x: T) => {
      const not = (b: boolean) => !b;
      const pred = (acc: T[], x: T) => not(acc.map(keyFn).includes(keyFn(x)));
      const reduce = (acc: T[], x: T) => {
        acc.push(x);
        return acc;
      };
      return pred(acc, x) ? reduce(acc, x) : acc;
    },
    [] as T[]
  );
}

export function flatMap<T, S>(f: (x: T) => S[], xs: T[]) {
  return xs.map(f).reduce((acc: S[], xs: S[]) => [...acc, ...xs], []);
}

export const any = <T>(pred: (a: T) => boolean) => (xs: T[]) => xs.some(pred);

export function intersection<T>(xs: T[], ys: T[]): T[] {
  const result = [] as T[];
  for (const x of xs) {
    for (const y of ys) {
      if (equals(x, y, identity)) {
        result.push(x);
      }
    }
  }
  return result;
}

/**
 * リストxsがリストysの部分集合であるかを判定します
 * @param xs
 * @param ys
 *
 * @example リストaがリストbの部分集合
 * const a = [1, 3]
 * const b = [1, 2, 3, 4]
 * isSubset(a, b) // true
 * isSubset(b, a) // false
 */
export function isSubset<T>(xs: T[], ys: T[], keyFn = identity) {
  const yKeys = ys.map(keyFn);
  for (const x of xs) {
    if (!yKeys.includes(keyFn(x))) {
      return false;
    }
  }
  return true;
}

export function reverse<T>(iter: Iterable<T>): T[] {
  switch (iter.constructor) {
    case Array: {
      const res = [] as T[];
      for (const x of iter) {
        res.unshift(x);
      }
      return res;
    }
    default:
      throw new TypeError(
        `[app] expected Iterable type object, but given '${iter.constructor}'`
      );
  }
}
