import test from "ava";
import { Tape, TMRule, R, TMConfiguration } from "./turing_machine";

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

test("TMRule#follow", t => {
  const rule = new TMRule(1, "0", 2, "1", R);
  t.deepEqual(
    rule.follow(new TMConfiguration(1, new Tape([], "0" as string, [], "_"))),
    new TMConfiguration(2, new Tape(["1"], "_", [], "_"))
  );
});
