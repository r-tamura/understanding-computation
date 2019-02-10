import test from "ava";
import { Stack } from "./push_down_automata";

test("Stack#top", t => {
  t.is(new Stack("a", "b", "c", "d", "e").top(), "a");
});

test("Stack#pop", t => {
  t.is(
    new Stack("a", "b", "c", "d", "e")
      .pop()
      .pop()
      .top(),
    "c"
  );
});

test("Stack#push", t => {
  t.is(
    new Stack("c", "d", "e")
      .push("x")
      .push("y")
      .pop()
      .top(),
    "x"
  );
});
