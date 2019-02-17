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
export const TEN: LambdaInteger = p => x => p(p(p(p(p(p(p(p(p(p(x))))))))));
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
type LambdaPair = (f: Proc2<any>) => any;
type LambdaPairConstructor = (x: any) => (y: any) => LambdaPair;
type LambdaPairIndex = (p: LambdaPair) => any;
export const PAIR: LambdaPairConstructor = x => y => f => f(x)(y);
export const LEFT: LambdaPairIndex = p => p(x => y => x);
export const RIGHT: LambdaPairIndex = p => p(x => y => y);

// 数値演算
type LambdaUnaryOp = Proc<LambdaInteger>;
export const INCREMENT: LambdaUnaryOp = n => p => x => p(n(p)(x));
// Note: decrementはトリッキー。SLIDEでの引数を[-1, 0]とすることで、slideの呼び出し回数-1
// という状況を作り出せる
type LambdaSlide = (p: LambdaPair) => LambdaPair;
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

// Note: 関数の構成が複雑なためFunctionで簡易的な定義とする
type LambdaY = <F extends Function>(f: (x: Function) => F) => Function;
export const Y: LambdaY = f => (x => f(x(x)))(x => f(x(x)));
export const Z: LambdaY = f => (x => f(y => x(x)(y)))(x => f(y => x(x)(y)));

export const MOD = Z(f => (m: LambdaInteger) => (n: LambdaInteger) =>
  IF(IS_LESS_OR_EQUAL(n)(m))(x => f(SUBTRACT(m)(n))(n)(x))(m)
);

// List
export const EMPTY = PAIR(TRUE)(TRUE);
export const UNSHIFT = (l: LambdaPair) => (x: any) => PAIR(FALSE)(PAIR(x)(l));
export const IS_EMPTY = LEFT;
export const FIRST = (l: LambdaPair) => LEFT(RIGHT(l));
export const REST = (l: LambdaPair) => RIGHT(RIGHT(l));

export const RANGE = Z(
  (f: Function) => (m: LambdaInteger) => (n: LambdaInteger) =>
    IF(IS_LESS_OR_EQUAL(m)(n))((x: any) => UNSHIFT(f(INCREMENT(m))(n))(m)(x))(
      EMPTY
    )
);

export const FOLD = Z(f => (l: LambdaPair) => (x: any) => (g: Function) =>
  IF(IS_EMPTY(l))(x)((y: any) => g(f(REST(l))(x)(g))(FIRST(l))(y))
);

export const MAP = <T>(k: LambdaPair) => (f: Function) =>
  FOLD(k)(EMPTY)((l: LambdaPair) => (x: T) => UNSHIFT(l)(f(x)));

// String
// "FizzBuzz"用なので"B", "F", "i", "u", "z"のみ対応していればよい
// それぞれの文字を10以降にエンコードする
type LambdaString = LambdaInteger;
export const B = TEN;
export const F = INCREMENT(B);
export const I = INCREMENT(F);
export const U = INCREMENT(I);
export const ZED = INCREMENT(U); // Zコンビネータと被らないように別名にする

export const FIZZ = UNSHIFT(UNSHIFT(UNSHIFT(UNSHIFT(EMPTY)(ZED))(ZED))(I))(F);
export const BUZZ = UNSHIFT(UNSHIFT(UNSHIFT(UNSHIFT(EMPTY)(ZED))(ZED))(U))(B);
export const FIZZBUZZ = UNSHIFT(UNSHIFT(UNSHIFT(UNSHIFT(BUZZ)(ZED))(ZED))(I))(
  F
);

// Number to String
export const DIV = Z(f => (m: LambdaInteger) => (n: LambdaInteger) =>
  IF(IS_LESS_OR_EQUAL(n)(m))((x: any) => INCREMENT(f(SUBTRACT(m)(n))(n))(x))(
    ZERO
  )
);

export const PUSH = <T>(l: LambdaPair) => (x: T) =>
  FOLD(l)(UNSHIFT(EMPTY)(x))(UNSHIFT);

export const TO_DIGITS = Z(f => (n: LambdaInteger) =>
  PUSH(
    IF(IS_LESS_OR_EQUAL(n)(DECREMENT(TEN)))(EMPTY)((x: any) =>
      f(DIV(n)(TEN))(x)
    )
  )(MOD(n)(TEN))
);

// FizzBuzz
export const FIZZBUZZ_FUNC = (a: LambdaInteger) => (b: LambdaInteger) =>
  MAP(RANGE(a)(b))((n: LambdaInteger) =>
    IF(IS_ZERO(MOD(n)(FIFTEEN)))(FIZZBUZZ)(
      IF(IS_ZERO(MOD(n)(THREE)))(FIZZ)(
        IF(IS_ZERO(MOD(n)(FIVE)))(BUZZ)(TO_DIGITS(n))
      )
    )
  );

// Infinite Streams
export const ZEROS = Z(f => UNSHIFT(f as LambdaPair)(ZERO)) as LambdaPair;
export const UPWARD_OF = Z(f => (n: LambdaInteger) =>
  UNSHIFT(x => f(INCREMENT(n))(x))(n)
);
export const MULTIPLIES_OF = (m: LambdaInteger) =>
  Z(f => (n: LambdaInteger) => UNSHIFT(x => f(ADD(m)(n))(x))(n))(m);

/**
 * Assert用
 */
export function toInteger(n: LambdaInteger) {
  return n((x: number) => x + 1)(0);
}

export function toBoolean(b: LambdaBoolean) {
  return b(true)(false);
}

export function toArray<T>(a: LambdaPair, count: number | null = null): any[] {
  const array = [] as T[];

  while (!toBoolean(IS_EMPTY(a)) && count !== 0) {
    array.push(FIRST(a));
    a = REST(a);
    if (typeof count === "number") {
      count = count - 1;
    }
  }
  return array;
}

export function toChar(c: LambdaString) {
  return "0123456789BFiuz"[toInteger(c)];
}

export function toString(s: LambdaPair) {
  return toArray(s)
    .map(toChar)
    .join("");
}
