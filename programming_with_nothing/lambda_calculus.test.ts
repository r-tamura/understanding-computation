import test from "ava";
import * as L from "./lambda_calculus";
import { R } from "../the_ultimate_machine/turing_machine";

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
  t.is(L.toInteger(L.TEN), 10);
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

test("LambdaBinaryOps", t => {
  t.is(L.toInteger(L.ADD(L.ZERO)(L.ZERO)), 0);
  t.is(L.toInteger(L.ADD(L.ONE)(L.TWO)), 3);
  t.is(L.toInteger(L.SUBTRACT(L.ZERO)(L.ZERO)), 0);
  t.is(L.toInteger(L.SUBTRACT(L.ONE)(L.TWO)), 0);
  t.is(L.toInteger(L.SUBTRACT(L.TWO)(L.ONE)), 1);
  t.is(L.toInteger(L.MULTIPLY(L.ZERO)(L.ZERO)), 0);
  t.is(L.toInteger(L.MULTIPLY(L.ONE)(L.TWO)), 2);
  t.is(L.toInteger(L.MULTIPLY(L.THREE)(L.FIFTEEN)), 45);
  t.is(L.toInteger(L.POWER(L.ZERO)(L.ZERO)), 1);
  t.is(L.toInteger(L.POWER(L.TWO)(L.THREE)), 8);
  t.is(L.toInteger(L.POWER(L.HUNDRED)(L.ONE)), 100);
  t.is(L.toInteger(L.POWER(L.ONE)(L.HUNDRED)), 1);
});

test("IS_LESS_OR_EQUAL", t => {
  t.is(L.toBoolean(L.IS_LESS_OR_EQUAL(L.ZERO)(L.ZERO)), true);
  t.is(L.toBoolean(L.IS_LESS_OR_EQUAL(L.ZERO)(L.TWO)), true);
  t.is(L.toBoolean(L.IS_LESS_OR_EQUAL(L.FIVE)(L.FOUR)), false);
  t.is(L.toBoolean(L.IS_LESS_OR_EQUAL(L.FIFTEEN)(L.ONE)), false);
});

test("MOD", t => {
  t.is(L.toInteger(L.MOD(L.THREE)(L.ONE)), 0);
  t.is(L.toInteger(L.MOD(L.THREE)(L.THREE)), 0);
  t.is(L.toInteger(L.MOD(L.THREE)(L.TWO)), 1);
  t.is(L.toInteger(L.MOD(L.FIVE)(L.TWO)), 1);
  t.is(L.toInteger(L.MOD(L.TWO)(L.FIVE)), 2);
});

test("LIST", t => {
  const mylist = L.UNSHIFT(L.UNSHIFT(L.UNSHIFT(L.EMPTY)(L.THREE))(L.TWO))(
    L.ONE
  );
  t.is(L.toInteger(L.FIRST(mylist)), 1);
  t.is(L.toInteger(L.FIRST(L.REST(mylist))), 2);
  t.is(L.toInteger(L.FIRST(L.REST(L.REST(mylist)))), 3);
  t.false(L.toBoolean(L.IS_EMPTY(mylist)));
  t.true(L.toBoolean(L.IS_EMPTY(L.EMPTY)));
});

test("toArray", t => {
  const mylist = L.UNSHIFT(L.UNSHIFT(L.UNSHIFT(L.EMPTY)(L.THREE))(L.TWO))(
    L.ONE
  );
  t.deepEqual(L.toArray(mylist).map(L.toInteger), [1, 2, 3]);
});

test("RANGE", t => {
  t.deepEqual(L.toArray(L.RANGE(L.ONE)(L.FIVE)).map(L.toInteger), [
    1,
    2,
    3,
    4,
    5
  ]);
});

test("FOLD", t => {
  t.is(L.toInteger(L.FOLD(L.RANGE(L.ONE)(L.FIVE))(L.ZERO)(L.ADD)), 15);
  t.is(L.toInteger(L.FOLD(L.RANGE(L.ONE)(L.FIVE))(L.ONE)(L.MULTIPLY)), 120);
});

test("MAP", t => {
  const mylist = L.MAP(L.RANGE(L.ONE)(L.FIVE))(L.INCREMENT);
  t.deepEqual(L.toArray(mylist).map(L.toInteger), [2, 3, 4, 5, 6]);
});

test("toChar/toString", t => {
  t.is(L.toChar(L.ZED), "z");
  t.is(L.toChar(L.B), "B");
  t.is(L.toChar(L.ZERO), "0");
  t.is(L.toString(L.FIZZBUZZ), "FizzBuzz");
});

test("DIV", t => {
  t.is(L.toInteger(L.DIV(L.ONE)(L.THREE)), 0);
  t.is(L.toInteger(L.DIV(L.THREE)(L.TWO)), 1);
  t.is(L.toInteger(L.DIV(L.HUNDRED)(L.TEN)), 10);
});

test("PUSH", t => {
  const mylist = L.RANGE(L.ONE)(L.FIVE);
  t.deepEqual(L.toArray(L.PUSH(mylist)(L.TEN)).map(L.toInteger), [
    1,
    2,
    3,
    4,
    5,
    10
  ]);
});

test("TO_DIGITS", t => {
  t.deepEqual(L.toArray(L.TO_DIGITS(L.FIVE)).map(L.toInteger), [5]);
  t.deepEqual(
    L.toArray(L.TO_DIGITS(L.POWER(L.FIVE)(L.THREE))).map(L.toInteger),
    [1, 2, 5]
  );
});

test("FIZZBUZZ_FUNC", t => {
  t.deepEqual(L.toArray(L.FIZZBUZZ_FUNC(L.ONE)(L.FIFTEEN)).map(L.toString), [
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz"
  ]);
});
