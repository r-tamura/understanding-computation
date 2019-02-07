import test from "ava";
import { intersection } from "./util";

test("intersection", t => {
  const source1 = [1];
  const source2 = [1];
  const actual1 = intersection(source1, source2);
  t.not(source1, actual1);
  t.not(source2, actual1);
  t.deepEqual(
    actual1,
    [1],
    `全ての要素が同じ場合, 全ての要素を含む新しい配列を返す`
  );

  t.deepEqual(
    intersection([1, 3, 4, 6, 5], [3, 7, 5, 2]),
    [3, 5],
    `共通の値を持つリストが渡された場合、共通集合を返す`
  );
  t.deepEqual(
    intersection([1, 3, 5, 7, 9], [2, 4, 6, 8]),
    [],
    `共通集合を持たないリストが渡された場合、空の配列を返す`
  );
});
