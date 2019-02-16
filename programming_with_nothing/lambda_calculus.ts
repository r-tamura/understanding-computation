type Proc<T> = (x: T) => T;
type Proc2<T> = (x: T) => (y: T) => T;

/**
 * 内部
 */
// 数
type LambdaInteger = <T>(p: Proc<T>) => Proc<T>;
export const ZERO: LambdaInteger = p => x => x;
export const ONE: LambdaInteger = p => x => p(x);
export const TWO: LambdaInteger = p => x => p(p(x));
export const THREE: LambdaInteger = p => x => p(p(p(x)));
export const FOUR: LambdaInteger = p => x => p(p(p(p(x))));
export const FIVE: LambdaInteger = p => x => p(p(p(p(p(x)))));
export const FIFTEEN: LambdaInteger = p => x =>
  p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(x)))))))))))))));
export const HUNDRED: LambdaInteger = p => x =>
  new Array(100).fill(p).reduce((acc, v) => p(acc), x);
// `p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(p(x))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))`
// HUNDREDは本来、上の式だが長すぎて、エディタでの表示が難しいため簡易実装
// 必要な数の分だけ続く...

// 真偽値
type LambdaBoolean = <T>(x: T) => (y: T) => T;
export const TRUE: LambdaBoolean = x => y => x;
export const FALSE: LambdaBoolean = x => y => y;

// if式
type LambdaIf = (b: LambdaBoolean) => LambdaBoolean;
export const IF: LambdaIf = b => b;

// 述語
// Note: ZEROは一度もpを呼び出さないことを利用する
type LambdaIsZero = (n: LambdaInteger) => LambdaBoolean;
export const IS_ZERO: LambdaIsZero = n => n((_: LambdaBoolean) => FALSE)(TRUE);

// ペア
type LambdaPair<T> = (f: Proc2<T>) => T;
type LambdaPairConstructor = <T>(x: T) => (y: T) => LambdaPair<T>;
type LambdaPairIndex = <T>(p: LambdaPair<T>) => T;
export const PAIR: LambdaPairConstructor = x => y => f => f(x)(y);
export const LEFT: LambdaPairIndex = p => p(x => y => x);
export const RIGHT: LambdaPairIndex = p => p(x => y => y);

// 数値演算
type LambdaUnaryOp = Proc<LambdaInteger>;
export const INCREMENT: LambdaUnaryOp = n => p => x => p(n(p)(x));
// Note: decrementはトリッキー。SLIDEでの引数を[-1, 0]とすることで、slideの呼び出し回数-1
// という状況を作り出せる
type LambdaSlide = (p: LambdaPair<LambdaInteger>) => LambdaPair<LambdaInteger>;
export const SLIDE: LambdaSlide = p => PAIR(RIGHT(p))(INCREMENT(RIGHT(p)));
export const DECREMENT: LambdaUnaryOp = n => LEFT(n(SLIDE)(PAIR(ZERO)(ZERO)));

type LambdaBinaryOp = Proc2<LambdaInteger>;
export const ADD: LambdaBinaryOp = m => n => n(INCREMENT)(m);
export const SUBTRACT: LambdaBinaryOp = m => n => n(DECREMENT)(m);
export const MULTIPLY: LambdaBinaryOp = m => n => n(ADD(m))(ZERO);
export const POWER: LambdaBinaryOp = m => n => n(MULTIPLY(m))(ONE);

type LambdaIsLessOrEqual = (
  m: LambdaInteger
) => (n: LambdaInteger) => LambdaBoolean;
export const IS_LESS_OR_EQUAL: LambdaIsLessOrEqual = m => n =>
  IS_ZERO(SUBTRACT(m)(n));

type LambdaY = <T>(f: Proc<Proc<T>>) => Proc<T>;
export const Y: LambdaY = <T>(f: Proc<Proc<T>>) => (x => f(x(x)))(x => f(x(x)));
export const Z: LambdaY = f => (x => f(y => x(x)(y)))(x => f(y => x(x)(y)));

export const MOD = (m: LambdaInteger) => (n: LambdaInteger) =>
  IF(IS_LESS_OR_EQUAL(n)(m))(x => MOD(SUBTRACT(m)(n))(n)(x))(m);

/**
 * Assert用
 */
export function toInteger(n: LambdaInteger) {
  return n((x: number) => x + 1)(0);
}

export function toBoolean(b: LambdaBoolean) {
  return b(true)(false);
}
