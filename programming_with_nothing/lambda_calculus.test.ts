import test from "ava";
import {
  toInteger,
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE
} from "./lambda_calculus";

test("toInteger", t => {
  t.is(toInteger(ZERO), 0);
  t.is(toInteger(THREE), 3);
});

test("Integer", t => {
  t.is(toInteger(ONE), 1);
  t.is(toInteger(TWO), 2);
  t.is(toInteger(THREE), 3);
  t.is(toInteger(FOUR), 4);
  t.is(toInteger(FIVE), 5);
});
