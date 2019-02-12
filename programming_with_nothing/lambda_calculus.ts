type Value = number | boolean;
type Proc<T extends Value> = (x: T) => T;

/**
 * 内部
 */
// 数
type LambdaInteger = (p: Proc<number>) => (x: number) => number;
export const ZERO: LambdaInteger = p => x => x;
export const ONE: LambdaInteger = p => x => p(x);
export const TWO: LambdaInteger = p => x => p(p(x));
export const THREE: LambdaInteger = p => x => p(p(p(x)));
export const FOUR: LambdaInteger = p => x => p(p(p(p(x))));
export const FIVE: LambdaInteger = p => x => p(p(p(p(p(x)))));
// 必要な数の分だけ続く...

// 真偽値
type LambdaBoolean = (x: boolean) => (y: boolean) => boolean;
export const TRUE: LambdaBoolean = x => y => x;
export const FALSE: LambdaBoolean = x => y => y;

/**
 * Assert用
 */
export function toInteger(lambda: LambdaInteger) {
  return lambda(x => x + 1)(0);
}

export function toBoolean(lambda: LambdaBoolean) {
  return lambda(true)(false);
}
