import test from "ava";
import {
  Stack,
  PDARule,
  PDAConfiguration,
  DPDARulebook,
  DPDA,
  DPDADesign,
  NPDARulebook,
  NPDA,
  NPDADesign
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
  t.false(
    new PDARule(2, "(", 2, "$", ["b", "$"]).applisTo(
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
  t.is(
    rulebook.nextConfiguration(new PDAConfiguration(2, new Stack("$")), ")"),
    null
  );
});

test("DPDARulebook#followFreeMoves", t => {
  const rulebook = new DPDARulebook(
    new PDARule(1, "(", 2, "$", ["b", "$"]),
    new PDARule(2, "(", 2, "b", ["b", "b"]),
    new PDARule(2, ")", 2, "b", [] as string[]),
    new PDARule(2, null, 1, "$", ["$"])
  );
  t.deepEqual(
    rulebook.followFreeMoves(new PDAConfiguration(2, new Stack("$"))),
    new PDAConfiguration(1, new Stack("$"))
  );
});

test("DPDA#accepting", t => {
  const rulebook = new DPDARulebook(
    new PDARule(1, "(", 2, "$", ["b", "$"]),
    new PDARule(2, "(", 2, "b", ["b", "b"]),
    new PDARule(2, ")", 2, "b", [] as string[]),
    new PDARule(2, null, 1, "$", ["$"])
  );
  t.true(
    new DPDA(new PDAConfiguration(1, new Stack("$")), [1], rulebook).accepting()
  );
  t.false(
    new DPDA(
      new PDAConfiguration(2, new Stack("b", "$")),
      [1],
      rulebook
    ).accepting()
  );
});

test("DPDA#readChar/readString", t => {
  const rulebook = new DPDARulebook(
    new PDARule(1, "(", 2, "$", ["b", "$"]),
    new PDARule(2, "(", 2, "b", ["b", "b"]),
    new PDARule(2, ")", 2, "b", [] as string[]),
    new PDARule(2, null, 1, "$", ["$"])
  );
  const dpda = new DPDA(new PDAConfiguration(1, new Stack("$")), [1], rulebook);
  dpda.readChar("(()");
  t.false(dpda.accepting());
});

test("DPDA#isStuck", t => {
  const rulebook = new DPDARulebook(
    new PDARule(1, "(", 2, "$", ["b", "$"]),
    new PDARule(2, "(", 2, "b", ["b", "b"]),
    new PDARule(2, ")", 2, "b", [] as string[]),
    new PDARule(2, null, 1, "$", ["$"])
  );
  const dpda = new DPDA(new PDAConfiguration(1, new Stack("$")), [1], rulebook);
  t.false(dpda.isStuck());
  dpda.readString("())");
  t.false(dpda.accepting());
  t.true(dpda.isStuck());
});

test("DPDADesign#accepts", t => {
  const rulebook = new DPDARulebook(
    new PDARule(1, "(", 2, "$", ["b", "$"]),
    new PDARule(2, "(", 2, "b", ["b", "b"]),
    new PDARule(2, ")", 2, "b", [] as string[]),
    new PDARule(2, null, 1, "$", ["$"])
  );
  const dpdaDesign = new DPDADesign(1, "$", [1], rulebook);
  t.true(dpdaDesign.accepts("(((((((((())))))))))"));
  t.true(dpdaDesign.accepts("()()"));
  t.false(dpdaDesign.accepts("())"));
});

test("NPDARulebook#nextConfiguration", t => {
  const rulebook = new NPDARulebook(
    new PDARule(1, "a", 1, "$", ["a", "$"]),
    new PDARule(1, "a", 1, "a", ["a", "a"]),
    new PDARule(1, "a", 1, "b", ["a", "b"]),
    new PDARule(1, "b", 1, "$", ["b", "$"]),
    new PDARule(1, "b", 1, "a", ["b", "a"]),
    new PDARule(1, "b", 1, "b", ["b", "b"]),
    new PDARule(1, null, 2, "$", ["$"]),
    new PDARule(1, null, 2, "a", ["a"]),
    new PDARule(1, null, 2, "b", ["b"]),
    new PDARule(2, "a", 2, "a", []),
    new PDARule(2, "b", 2, "b", []),
    new PDARule(2, null, 3, "$", ["$"])
  );
  t.deepEqual(
    rulebook.nextConfigurations([new PDAConfiguration(1, new Stack("$"))], "a"),
    [new PDAConfiguration(1, new Stack("a", "$"))]
  );
  t.deepEqual(
    rulebook.nextConfigurations(
      [
        new PDAConfiguration(1, new Stack("a")),
        new PDAConfiguration(1, new Stack("b"))
      ],
      "a"
    ),
    [
      new PDAConfiguration(1, new Stack("a", "a")),
      new PDAConfiguration(1, new Stack("a", "b"))
    ]
  );
  t.deepEqual(
    rulebook.nextConfigurations(
      [
        new PDAConfiguration(1, new Stack("$")),
        new PDAConfiguration(1, new Stack("$"))
      ],
      "a"
    ),
    [new PDAConfiguration(1, new Stack("a", "$"))],
    `複数の同じ構成は、１つにまとめる`
  );
});

test("NPDARulebook#followFreeMoves", t => {
  const rulebook = new NPDARulebook(
    new PDARule(1, "a", 1, "$", ["a", "$"]),
    new PDARule(1, "a", 1, "a", ["a", "a"]),
    new PDARule(1, "a", 1, "b", ["a", "b"]),
    new PDARule(1, "b", 1, "$", ["b", "$"]),
    new PDARule(1, "b", 1, "a", ["b", "a"]),
    new PDARule(1, "b", 1, "b", ["b", "b"]),
    new PDARule(1, null, 2, "$", ["$"]),
    new PDARule(1, null, 2, "a", ["a"]),
    new PDARule(1, null, 2, "b", ["b"]),
    new PDARule(2, "a", 2, "a", []),
    new PDARule(2, "b", 2, "b", []),
    new PDARule(2, null, 3, "$", ["$"])
  );
  t.deepEqual(
    rulebook.followFreeMoves([new PDAConfiguration(1, new Stack("a"))]),
    [
      new PDAConfiguration(1, new Stack("a")),
      new PDAConfiguration(2, new Stack("a"))
    ]
  );
});

test("NPDA#accepting/readChar/readString", t => {
  const rulebook = new NPDARulebook(
    new PDARule(1, "a", 1, "$", ["a", "$"]),
    new PDARule(1, "a", 1, "a", ["a", "a"]),
    new PDARule(1, "a", 1, "b", ["a", "b"]),
    new PDARule(1, "b", 1, "$", ["b", "$"]),
    new PDARule(1, "b", 1, "a", ["b", "a"]),
    new PDARule(1, "b", 1, "b", ["b", "b"]),
    new PDARule(1, null, 2, "$", ["$"]),
    new PDARule(1, null, 2, "a", ["a"]),
    new PDARule(1, null, 2, "b", ["b"]),
    new PDARule(2, "a", 2, "a", []),
    new PDARule(2, "b", 2, "b", []),
    new PDARule(2, null, 3, "$", ["$"])
  );
  const npda = new NPDA(
    [new PDAConfiguration(1, new Stack("$"))],
    [3],
    rulebook
  );
  t.true(npda.accepting());
  npda.readString("abb");
  t.false(npda.accepting());
  npda.readChar("a");
  t.true(npda.accepting());
});

test("NPDADesign#accepts", t => {
  const rulebook = new NPDARulebook(
    new PDARule(1, "a", 1, "$", ["a", "$"]),
    new PDARule(1, "a", 1, "a", ["a", "a"]),
    new PDARule(1, "a", 1, "b", ["a", "b"]),
    new PDARule(1, "b", 1, "$", ["b", "$"]),
    new PDARule(1, "b", 1, "a", ["b", "a"]),
    new PDARule(1, "b", 1, "b", ["b", "b"]),
    new PDARule(1, null, 2, "$", ["$"]),
    new PDARule(1, null, 2, "a", ["a"]),
    new PDARule(1, null, 2, "b", ["b"]),
    new PDARule(2, "a", 2, "a", []),
    new PDARule(2, "b", 2, "b", []),
    new PDARule(2, null, 3, "$", ["$"])
  );
  const npdaDesign = new NPDADesign(1, "$", [3], rulebook);
  t.true(npdaDesign.accepts("abba"));
  t.true(npdaDesign.accepts("babbaabbab"));
  t.false(npdaDesign.accepts("abb"));
  t.false(npdaDesign.accepts("baabaa"));
});
