import test from "ava";
import {
  toInteger,
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  toBoolean,
  TRUE,
  FALSE,
  IF,
  IS_ZERO,
  PAIR,
  LEFT,
  RIGHT
} from "./lambda_calculus";

test("toInteger", t => {
  t.is(toInteger(ZERO), 0);
  t.is(toInteger(THREE), 3);
});

test("LambdaIntegers", t => {
  t.is(toInteger(ONE), 1);
  t.is(toInteger(TWO), 2);
  t.is(toInteger(THREE), 3);
  t.is(toInteger(FOUR), 4);
  t.is(toInteger(FIVE), 5);
});

test("toBoolean/LambdaBoolean", t => {
  t.true(toBoolean(TRUE));
  t.false(toBoolean(FALSE));
});

test("LambdaIf", t => {
  t.is(IF(TRUE)("happy")("sad"), "happy");
  t.is(IF(FALSE)("happy")("sad"), "sad");
});

test("IS_ZERO", t => {
  t.is(IS_ZERO(ZERO), TRUE);
  t.is(IS_ZERO(ONE), FALSE);
});

test("LEFT/RIGHT", t => {
  const pair = PAIR(THREE)(FIVE);
  t.is(toInteger(LEFT(pair)), 3);
  t.is(toInteger(RIGHT(pair)), 5);
});
