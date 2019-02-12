type V = number | boolean | string;
type Proc<T> = (x: T) => T;

/**
 * 内部
 */
// 数
type LambdaInteger<T = number> = (p: Proc<T>) => (x: T) => T;
export const ZERO = <T>(p: Proc<T>) => (x: T) => x;
export const ONE = <T>(p: Proc<T>) => (x: T) => p(x);
export const TWO = <T>(p: Proc<T>) => (x: T) => p(p(x));
export const THREE = <T>(p: Proc<T>) => (x: T) => p(p(p(x)));
export const FOUR = <T>(p: Proc<T>) => (x: T) => p(p(p(p(x))));
export const FIVE = <T>(p: Proc<T>) => (x: T) => p(p(p(p(p(x)))));
// 必要な数の分だけ続く...

// 真偽値
type LambdaBoolean<T = boolean> = (x: T) => (y: T) => T;
export const TRUE = <T>(x: T) => (y: T) => x;
export const FALSE = <T>(x: T) => (y: T) => y;

// if式
type LambdaIf<T> = (b: LambdaBoolean<T>) => LambdaBoolean<T>;
export const IF = <T>(b: LambdaBoolean<T>) => b;

// 述語
// ZEROは一度もpを呼び出さないことを利用する
export const IS_ZERO = (n: LambdaInteger<LambdaBoolean>) => n(_ => FALSE)(TRUE);

/**
 * Assert用
 */
export function toInteger(n: LambdaInteger) {
  return n(x => x + 1)(0);
}

export function toBoolean(b: LambdaBoolean<boolean>) {
  return b(true)(false);
}
