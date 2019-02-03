import test from "ava";
import { FARule, DFARuleBook, DFA, DFADesign } from "./finite_automata";

test("FARule#appliesTo", t => {
  const rule = new FARule(1, "c", 2);
  t.true(
    rule.appliesTo(1, "c") === true,
    `ルールに対応する状態と入力が与えられた場合, trueを返す`
  );
  t.true(
    rule.appliesTo(1, "b") === false,
    `ルールに対応する状態と入力が与えられなかった場合, falseを返す`
  );
  t.true(
    rule.appliesTo(2, "c") === false,
    `ルールに対応する状態と入力が与えられなかった場合, falseを返す`
  );
});

test("FARule#follow", t => {
  t.true(
    new FARule(1, "a", 2).follow() === 2,
    `機械の状態を何に変更するかを返す`
  );
});

test("FARule#inspect", t => {
  t.true(new FARule(1, "a", 2).toString() === `#<FA Rule 1 --a--> 2`);
});

test("DFARulebook#nextState", t => {
  const rulebook = new DFARuleBook(
    new FARule(1, "a", 2),
    new FARule(2, "a", 2),
    new FARule(3, "a", 3),
    new FARule(1, "b", 1),
    new FARule(2, "b", 3),
    new FARule(3, "b", 3)
  );

  t.true(
    rulebook.nextState(1, "a") === 2,
    `一つ以上のルールに対応した入力と状態が与えられた場合、次の状態を返す。`
  );
  t.true(
    rulebook.nextState(1, "b") === 1,
    `一つ以上のルールに対応した入力と状態が与えられた場合、次の状態を返す。`
  );
  t.true(
    rulebook.nextState(2, "b") === 3,
    `一つ以上のルールに対応した入力と状態が与えられた場合、次の状態を返す。`
  );
  t.true(
    rulebook.nextState(1, "d") === null,
    `与えられた状態と入力対応したルールがない場合、null返す。`
  );
  t.true(
    rulebook.nextState(4, "a") === null,
    `与えられた状態と入力対応したルールがない場合、null返す。`
  );
});

test("DFA#accepting", t => {
  const rulebook = new DFARuleBook(
    new FARule(1, "a", 2),
    new FARule(2, "a", 2),
    new FARule(3, "a", 3),
    new FARule(1, "b", 1),
    new FARule(2, "b", 3),
    new FARule(3, "b", 3)
  );

  const dfa = new DFA(1, [1, 3], rulebook);
  t.true(dfa.accepting());
  const dfa2 = new DFA(1, [3], rulebook);
  t.false(dfa2.accepting());
});

test("DFA#readChar", t => {
  const rulebook = new DFARuleBook(
    new FARule(1, "a", 2),
    new FARule(2, "a", 2),
    new FARule(3, "a", 3),
    new FARule(1, "b", 1),
    new FARule(2, "b", 3),
    new FARule(3, "b", 3)
  );
  const dfa = new DFA(1, [3], rulebook);
  dfa.readChar("b");
  t.false(dfa.accepting());
  ["a", "a", "a"].forEach(c => dfa.readChar(c));
  t.false(dfa.accepting());
  dfa.readChar("b");
  t.true(dfa.accepting());
});

test("DFA#readString", t => {
  const rulebook = new DFARuleBook(
    new FARule(1, "a", 2),
    new FARule(2, "a", 2),
    new FARule(3, "a", 3),
    new FARule(1, "b", 1),
    new FARule(2, "b", 3),
    new FARule(3, "b", 3)
  );
  const dfa = new DFA(1, [3], rulebook);
  dfa.readString("baaab");
  t.true(dfa.accepting());
});

test("DFADesign#acceps", t => {
  const rulebook = new DFARuleBook(
    new FARule(1, "a", 2),
    new FARule(2, "a", 2),
    new FARule(3, "a", 3),
    new FARule(1, "b", 1),
    new FARule(2, "b", 3),
    new FARule(3, "b", 3)
  );
  const dfadesign = new DFADesign(1, [3], rulebook);
  t.false(dfadesign.accepts("a"));
  t.false(dfadesign.accepts("baa"));
  t.true(dfadesign.accepts("baba"));
});
