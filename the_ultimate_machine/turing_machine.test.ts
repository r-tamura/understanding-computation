import test from "ava";
import {
  Tape,
  TMRule,
  R,
  TMConfiguration,
  DTMRulebook,
  L,
  DTM
} from "./turing_machine";

test("Tape#toString", t => {
  t.is(new Tape(["1", "0", "1"], "1", [], "_").toString(), "#<Tape 101(1)>");
  t.is(new Tape(["1", "0"], "1", ["1"], "_").toString(), "#<Tape 10(1)1>");
});

test("Tape#moveHeadLeft", t => {
  t.is(
    new Tape(["1", "0", "1"], "1", [], "_").moveHeadLeft().toString(),
    "#<Tape 10(1)1>"
  );
  t.is(
    new Tape([], "1", ["0", "1", "1"], "_").moveHeadLeft().toString(),
    "#<Tape (_)1011>"
  );
});

test("Tape#moveHeadRight", t => {
  t.is(
    new Tape(["1", "0", "1"], "1", [], "_").moveHeadRight().toString(),
    "#<Tape 1011(_)>"
  );
  t.is(
    new Tape([], "1", ["0", "1", "1"], "_").moveHeadRight().toString(),
    "#<Tape 1(0)11>"
  );
});

test("TMRule#appiesTo", t => {
  const rule = new TMRule(1, "0", 2, "1", R);
  // TypeScriptの型判定でSが"0"と判定されないように as stringを明記する
  t.true(
    rule.appliesTo(new TMConfiguration(1, new Tape([], "0" as string, [], "_")))
  );
  t.false(
    rule.appliesTo(new TMConfiguration(1, new Tape([], "1" as string, [], "_")))
  );
  t.false(
    rule.appliesTo(new TMConfiguration(2, new Tape([], "0" as string, [], "_")))
  );
});

test("DTMRule#follow", t => {
  const rule = new TMRule(1, "0", 2, "1", R);
  t.deepEqual(
    rule.follow(new TMConfiguration(1, new Tape([], "0" as string, [], "_"))),
    new TMConfiguration(2, new Tape(["1"], "_", [], "_"))
  );
});

test("DTMRulebook#nextConfiguration", t => {
  const rulebook = new DTMRulebook(
    new TMRule(1, "0", 2, "1", R),
    new TMRule(1, "1", 1, "0", L),
    new TMRule(1, "_", 2, "1", R),
    new TMRule(2, "0", 2, "0", R),
    new TMRule(2, "1", 2, "1", L),
    new TMRule(2, "_", 3, "_", L)
  );
  t.deepEqual(
    rulebook.nextConfiguration(
      new TMConfiguration(1, new Tape(["1", "0", "1"], "1", [], "_"))
    ),
    new TMConfiguration(1, new Tape(["1", "0"], "1", ["0"], "_"))
  );
  t.deepEqual(
    rulebook.nextConfiguration(
      new TMConfiguration(1, new Tape(["1", "0"], "1", ["0"], "_"))
    ),
    new TMConfiguration(1, new Tape(["1"], "0", ["0", "0"], "_"))
  );
  t.deepEqual(
    rulebook.nextConfiguration(
      new TMConfiguration(1, new Tape(["1"], "0", ["0", "0"], "_"))
    ),
    new TMConfiguration(2, new Tape(["1", "1"], "0", ["0"], "_"))
  );
});

test("DTM#accepting", t => {
  const tape = new Tape(["1", "0", "1"], "1", [], "_");
  const rulebook = new DTMRulebook(
    new TMRule(1, "0", 2, "1", R),
    new TMRule(1, "1", 1, "0", L),
    new TMRule(1, "_", 2, "1", R),
    new TMRule(2, "0", 2, "0", R),
    new TMRule(2, "1", 2, "1", L),
    new TMRule(2, "_", 3, "_", L)
  );
  t.false(new DTM(new TMConfiguration(1, tape), [3], rulebook).accepting());
});

test("DTM#run", t => {
  const tape = new Tape(["1", "0", "1"], "1", [], "_");
  const rulebook = new DTMRulebook(
    new TMRule(1, "0", 2, "1", R),
    new TMRule(1, "1", 1, "0", L),
    new TMRule(1, "_", 2, "1", R),
    new TMRule(2, "0", 2, "0", R),
    new TMRule(2, "1", 2, "1", L),
    new TMRule(2, "_", 3, "_", L)
  );
  const dtm = new DTM(new TMConfiguration(1, tape), [3], rulebook);
  dtm.run();
  t.false(dtm.isStuck());
  t.true(dtm.accepting());
});

test("DTM#run (got stuck)", t => {
  const tape = new Tape(["1", "2", "1"], "1", [], "_");
  const rulebook = new DTMRulebook(
    new TMRule(1, "0", 2, "1", R),
    new TMRule(1, "1", 1, "0", L),
    new TMRule(1, "_", 2, "1", R),
    new TMRule(2, "0", 2, "0", R),
    new TMRule(2, "1", 2, "1", L),
    new TMRule(2, "_", 3, "_", L)
  );
  const dtm = new DTM(new TMConfiguration(1, tape), [3], rulebook);
  dtm.run();
  t.true(dtm.isStuck());
  t.false(dtm.accepting());
});

test("DTM", t => {
  const tape = new Tape([], "a", "aabbbccc".split(""), "_");
  const rulebook = new DTMRulebook(
    // State 1: scan right looking for a
    new TMRule(1, "X", 1, "X", R),
    new TMRule(1, "a", 2, "X", R),
    new TMRule(1, "_", 6, "_", L),

    // State 2: scan right looking for b
    new TMRule(2, "a", 2, "a", R),
    new TMRule(2, "X", 2, "X", R),
    new TMRule(2, "b", 3, "X", R),

    // State 3: scan right looking for c
    new TMRule(3, "b", 3, "b", R),
    new TMRule(3, "X", 3, "X", R),
    new TMRule(3, "c", 4, "X", R),

    // State 4: scan right looking for end of string
    new TMRule(4, "c", 4, "c", R),
    new TMRule(4, "_", 5, "_", L),

    // State 5: scan left looking for beginning of string
    new TMRule(5, "a", 5, "a", L),
    new TMRule(5, "b", 5, "b", L),
    new TMRule(5, "c", 5, "c", L),
    new TMRule(5, "X", 5, "X", L),
    new TMRule(5, "_", 1, "_", R)
  );

  const dtm = new DTM(new TMConfiguration(1, tape), [6], rulebook);
  dtm.run();
  t.true(dtm.accepting());
});
