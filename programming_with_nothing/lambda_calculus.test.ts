import test from "ava";
import { LCFunction, LCCall, LCVariable } from "./lambda_calculus";

test("toString", t => {
  const one = new LCFunction(
    "p",
    new LCFunction("x", new LCCall(new LCVariable("p"), new LCVariable("x")))
  );
  t.is(one.toString(), "-> p { -> x { p[x] } }");
});
