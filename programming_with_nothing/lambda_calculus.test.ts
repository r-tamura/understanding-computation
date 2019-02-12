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
  FALSE
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
