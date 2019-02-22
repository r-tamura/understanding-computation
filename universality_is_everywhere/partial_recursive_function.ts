/**
 * 部分再帰関数の4つの構成要素
 */
export function zero() {
  return 0;
}

export function increment(n: number) {
  return n + 1;
}

export function recurse(f: Function, g: Function, ...values: number[]) {
  const [otherValues, lastValue] = [values.slice(0, -1), values.slice(-1)[0]];
  if (lastValue === 0) {
    return f(...otherValues);
  } else {
    const easierLasvValue = lastValue - 1;
    const easierValues = otherValues.concat([easierLasvValue]);
    const easierResult = recurse(f, g, ...easierValues);
    return g(...easierValues, easierResult);
  }
}

//-----------------------------------------------------------------------------------
export function one() {
  return increment(zero());
}

export function two() {
  return increment(increment(zero()));
}

export function three() {
  return increment(increment(increment(zero())));
}

export function addZeroToX(x: number) {
  return x;
}

export function incrementEasierResult(x, easier_y, easier_result) {
  return increment(easier_result);
}

export function add(x: () => number, y: () => number) {
  return recurse(addZeroToX, incrementEasierResult, x(), y());
}
