import test from "ava";
import {
  Stack,
  PDARule,
  PDAConfiguration,
  DPDARulebook
} from "./push_down_automata";

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

test("PDARule#appliesTo", t => {
  t.true(
    new PDARule(1, "(", 2, "$", ["b", "$"]).applisTo(
      new PDAConfiguration(1, new Stack("$")),
      "("
    )
  );
});

test("DPDARulebook#nextConfiguration", t => {
  const rulebook = new DPDARulebook(
    new PDARule(1, "(", 2, "$", ["b", "$"]),
    new PDARule(2, "(", 2, "b", ["b", "b"]),
    new PDARule(2, ")", 2, "b", [] as string[]),
    new PDARule(2, null, 1, "$", ["$"])
  );
  t.deepEqual(
    rulebook.nextConfiguration(new PDAConfiguration(1, new Stack("$")), "("),
    new PDAConfiguration(2, new Stack("b", "$"))
  );
  t.deepEqual(
    rulebook.nextConfiguration(
      new PDAConfiguration(2, new Stack("b", "$")),
      "("
    ),
    new PDAConfiguration(2, new Stack("b", "b", "$"))
  );
  t.deepEqual(
    rulebook.nextConfiguration(
      new PDAConfiguration(2, new Stack("b", "b", "$")),
      ")"
    ),
    new PDAConfiguration(2, new Stack("b", "$"))
  );
});
