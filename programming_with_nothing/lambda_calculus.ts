type Proc<T> = (x: T) => T;
type Proc2<T> = (x: T) => (y: T) => T;

/**
 * 内部
 */
// 数
type LambdaInteger = <T>(p: Proc<T>) => (x: T) => T;
export const ZERO: LambdaInteger = p => x => x;
export const ONE: LambdaInteger = p => x => p(x);
export const TWO: LambdaInteger = p => x => p(p(x));
export const THREE: LambdaInteger = p => x => p(p(p(x)));
export const FOUR: LambdaInteger = p => x => p(p(p(p(x))));
export const FIVE: LambdaInteger = p => x => p(p(p(p(p(x)))));
// 必要な数の分だけ続く...

// 真偽値
type LambdaBoolean = <T>(x: T) => (y: T) => T;
export const TRUE: LambdaBoolean = x => y => x;
export const FALSE: LambdaBoolean = x => y => y;

// if式
type LambdaIf = (b: LambdaBoolean) => LambdaBoolean;
export const IF: LambdaIf = b => b;

// 述語
// ZEROは一度もpを呼び出さないことを利用する
export const IS_ZERO = (n: LambdaInteger) => n(_ => FALSE)(TRUE);

// ペア
type LambdaPair = <T>(x: T) => (y: T) => (f: Proc2<T>) => T;
type LambdaPairIndex = <T>(p: (f: Proc2<T>) => T) => T;
export const PAIR: LambdaPair = x => y => f => f(x)(y);
export const LEFT: LambdaPairIndex = p => p(x => y => x);
export const RIGHT: LambdaPairIndex = p => p(x => y => y);

/**
 * Assert用
 */
export function toInteger(n: LambdaInteger) {
  return n((x: number) => x + 1)(0);
}

export function toBoolean(b: LambdaBoolean) {
  return b(true)(false);
}
