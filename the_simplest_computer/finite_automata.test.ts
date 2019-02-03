import test from "ava";
import { FARule, DFARuleBook } from "./finite_automata";

test("FARule#appliesTo", t => {
  const rule = new FARule<number>(1, "c", 2);
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

test("DFARulebook#nextState", t => {
  const rulebook = new DFARuleBook(
    new FARule<number>(1, "a", 2),
    new FARule<number>(2, "a", 2),
    new FARule<number>(3, "a", 3),
    new FARule<number>(1, "b", 1),
    new FARule<number>(2, "b", 3),
    new FARule<number>(3, "b", 3)
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
