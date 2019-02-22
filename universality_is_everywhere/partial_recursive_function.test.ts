import test from "ava";
import { zero, increment, two, three, add } from "./partial_recursive_function";

test("zero", t => {
  t.is(zero(), 0);
});

test("increment", t => {
  t.is(increment(zero()), 1);
  t.is(two(), 2);
  t.is(three(), 3);
});

test("add", t => {
  t.is(add(two, three), 5);
});
