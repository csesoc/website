import { AtomicOperation, Operation, StringOperation } from "./operation";
import { transform } from "./transform";



// TODO: Add tests for other cases
describe("Transform operation", () => {
  test("two insert operations on same path result in a string transformation", () => {
    const a: Operation = {
      path: [0],
      opType: "insert",
      isNoOp: false,
      atomicOp: new StringOperation(1, 2, "1"),
    };
    const b: Operation = {
      path: [0],
      opType: "insert",
      isNoOp: false,
      atomicOp: new StringOperation(2, 3, "2"),
    };

    // Apply transformation
    let [transformedA, transformedB] = transform(a, b);

    // Check other fields are constant
    expect(transformedA.path).toBe(a.path);
    expect(transformedA.opType).toBe(a.opType);
    expect(transformedA.isNoOp).toBe(a.isNoOp);
    expect(transformedB.path).toBe(b.path);
    expect(transformedB.opType).toBe(b.opType);
    expect(transformedB.isNoOp).toBe(b.isNoOp);

    // Check that atomic operation was changed
    const apply = (o: AtomicOperation, s: string): string => {
      const strOp = o as StringOperation;
      const start = Math.min(s.length, strOp.start);
      const end = strOp.newValue == "" ? strOp.end : start;
      return s.substring(0, start) + strOp.newValue + s.substring(end);
    }; 
    const s = "abcde";
    let [o1, o2] = [transformedA.atomicOp, transformedB.atomicOp];
    expect(apply(o1, apply(o2, s))).toBe("a1b2cde");

    // Check that reverse order transformation is also correct
    [transformedB, transformedA] = transform(b, a);
    [o1, o2] = [transformedB.atomicOp, transformedA.atomicOp];
    expect(apply(o2, apply(o1, s))).toBe("a1b2cde");
  });
});
