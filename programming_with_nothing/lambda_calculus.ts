type Value = number;
type Proc = (x: Value) => Value;
/**
 * 内部
 */
export const ZERO = (p: Proc) => (x: Value) => x;
export const ONE = (p: Proc) => (x: Value) => p(x);
export const TWO = (p: Proc) => (x: Value) => p(p(x));
export const THREE = (p: Proc) => (x: Value) => p(p(p(x)));
export const FOUR = (p: Proc) => (x: Value) => p(p(p(p(x))));
export const FIVE = (p: Proc) => (x: Value) => p(p(p(p(p(x)))));
// 必要な数の分だけ続く...

/**
 * Assert用
 */
type Integer = (p: Proc) => (x: Value) => Value;
export function toInteger(lambda: Integer) {
  return lambda((x: Value) => x + 1)(0);
}
