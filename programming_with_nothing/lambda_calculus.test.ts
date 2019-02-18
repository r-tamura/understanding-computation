import test from "ava";
import { LCFunction, LCCall, LCVariable } from "./lambda_calculus";

test("toString", t => {
  const one = new LCFunction(
    "p",
    new LCFunction("x", new LCCall(new LCVariable("p"), new LCVariable("x")))
  );
  t.is(one.toString(), "-> p { -> x { p[x] } }");
});

test("LCVariable#replace", t => {
  const expression = new LCVariable("x");
  t.is(
    expression
      .replace("x", new LCFunction("y", new LCVariable("y")))
      .toString(),
    "-> y { y }"
  );
  t.is(
    expression
      .replace("z", new LCFunction("y", new LCVariable("y")))
      .toString(),
    "x"
  );
});

test("LCCall#replace", t => {
  const expression = new LCCall(
    new LCCall(
      new LCCall(new LCVariable("a"), new LCVariable("b")),
      new LCVariable("c")
    ),
    new LCVariable("b")
  );
  t.is(expression.replace("a", new LCVariable("x")).toString(), "x[b][c][b]");
  t.is(
    expression
      .replace("b", new LCFunction("x", new LCVariable("x")))
      .toString(),
    "a[-> x { x }][c][-> x { x }]"
  );
});

test("LCFunction#replace", t => {
  const expression = new LCFunction(
    "y",
    new LCCall(new LCVariable("x"), new LCVariable("y"))
  );
  t.is(
    expression.replace("x", new LCVariable("z")).toString(),
    "-> y { z[y] }"
  );
  t.is(
    expression.replace("y", new LCVariable("z")).toString(),
    "-> y { x[y] }"
  );

  // Only free variables is replaced
  const expression2 = new LCCall(
    new LCCall(new LCVariable("x"), new LCVariable("y")),
    new LCFunction("y", new LCCall(new LCVariable("y"), new LCVariable("x")))
  );
  t.is(
    expression2.replace("x", new LCVariable("z")).toString(),
    "z[y][-> y { y[z] }]"
  );
  t.is(
    expression2.replace("y", new LCVariable("z")).toString(),
    "x[z][-> y { y[x] }]"
  );
});

test("LCFunction#call", t => {
  const f = new LCFunction(
    "x",
    new LCFunction("y", new LCCall(new LCVariable("x"), new LCVariable("y")))
  );
  t.is(
    f.call(new LCFunction("z", new LCVariable("z"))).toString(),
    "-> y { -> z { z }[y] }"
  );
});
