import test from "ava";
import * as L from "./lambda_calculus";

test("toInteger", t => {
  t.is(L.toInteger(L.ZERO), 0);
  t.is(L.toInteger(L.THREE), 3);
});

test("LambdaIntegers", t => {
  t.is(L.toInteger(L.ONE), 1);
  t.is(L.toInteger(L.TWO), 2);
  t.is(L.toInteger(L.THREE), 3);
  t.is(L.toInteger(L.FOUR), 4);
  t.is(L.toInteger(L.FIVE), 5);
  t.is(L.toInteger(L.FIFTEEN), 15);
  t.is(L.toInteger(L.HUNDRED), 100);
});

test("toBoolean/LambdaBoolean", t => {
  t.true(L.toBoolean(L.TRUE));
  t.false(L.toBoolean(L.FALSE));
});

test("LambdaIf", t => {
  t.is(L.IF(L.TRUE)("happy")("sad"), "happy");
  t.is(L.IF(L.FALSE)("happy")("sad"), "sad");
});

test("IS_ZERO", t => {
  t.is(L.IS_ZERO(L.ZERO), L.TRUE);
  t.is(L.IS_ZERO(L.ONE), L.FALSE);
});

test("LEFT/RIGHT", t => {
  const pair = L.PAIR(L.THREE)(L.FIVE);
  t.is(L.toInteger(L.LEFT(pair)), 3);
  t.is(L.toInteger(L.RIGHT(pair)), 5);
});

test("INCREMENT", t => {
  t.is(L.toInteger(L.INCREMENT(L.ZERO)), 1);
  t.is(L.toInteger(L.INCREMENT(L.FOUR)), 5);
});

test("DECREMENT", t => {
  t.is(L.toInteger(L.DECREMENT(L.ZERO)), 0);
  t.is(L.toInteger(L.DECREMENT(L.FIVE)), 4);
  t.is(L.toInteger(L.DECREMENT(L.FIFTEEN)), 14);
  t.is(L.toInteger(L.DECREMENT(L.HUNDRED)), 99);
  t.is(L.toInteger(L.DECREMENT(L.FIFTEEN)), 14);
});
