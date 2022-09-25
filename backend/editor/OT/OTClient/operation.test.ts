import { AtomicOperation, StringOperation } from "./operation";

describe("String transformation functions", () => {

  const s = "abcde";

  const apply = (o: AtomicOperation, s: string): string => {
    const strOp = o as StringOperation;
    const start = Math.min(s.length, strOp.start);
    const end = strOp.newValue == "" ? strOp.end : start;
    return s.substring(0, start) + strOp.newValue + s.substring(end);
  };

  describe("insert insert", () => {
    test("non overlap", () => {
      const o1 = new StringOperation(1, 2, "1");
      const o2 = new StringOperation(2, 3, "2");
      expect(apply(o1, s)).toBe("a1bcde");
      expect(apply(o2, s)).toBe("ab2cde");

      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("a1b2cde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("a1b2cde");
    });

    test("same location", () => {
      const o1 = new StringOperation(1, 2, "2");
      const o2 = new StringOperation(1, 2, "1");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("a12bcde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("a12bcde");
    });

    test("overlap", () => {
      const o1 = new StringOperation(1, 3, "11");
      const o2 = new StringOperation(2, 4, "22");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("a11b22cde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("a11b22cde");
    });
  });

  describe("insert delete", () => {
    test("non overlap", () => {
      const o1 = new StringOperation(1, 2, "1");
      const o2 = new StringOperation(2, 3, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("a1bde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("a1bde");
    });

    test("same location", () => {
      const o1 = new StringOperation(1, 2, "1");
      const o2 = new StringOperation(0, 1, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("1bcde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("1bcde");
    });

    test("overlap insert before delete", () => {
      const o1 = new StringOperation(1, 3, "12");
      const o2 = new StringOperation(0, 1, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("12bcde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("12bcde");
    });

    test("overlap delete before insert", () => {
      const o1 = new StringOperation(2, 3, "1");
      const o2 = new StringOperation(0, 3, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("1de");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("1de");
    });

    test("overlap less insert than delete", () => {
      const o1 = new StringOperation(0, 1, "1");
      const o2 = new StringOperation(0, 5, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("1");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("1");
    });

    test("overlap more insert than delete", () => {
      const o1 = new StringOperation(0, 5, "11111");
      const o2 = new StringOperation(0, 1, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("11111bcde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("11111bcde");
    });
  });

  describe("delete delete", () => {
    test("non overlap", () => {
      const o1 = new StringOperation(1, 2, "");
      const o2 = new StringOperation(2, 3, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("ade");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("ade");
    });

    test("same operations", () => {
      const o1 = new StringOperation(1, 2, "");
      const o2 = new StringOperation(1, 2, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("acde");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("acde");
    });

    test("overlap", () => {
      const o1 = new StringOperation(1, 3, "");
      const o2 = new StringOperation(2, 3, "");
      const [o1_t1, o2_t1] = o1.transformAgainst(o2);
      const [o1_t2, o2_t2] = o2.transformAgainst(o1);
      expect(apply(o1_t1, apply(o2_t1, s))).toBe("ade");
      expect(apply(o2_t2, apply(o1_t2, s))).toBe("ade");
    });
  });
});
