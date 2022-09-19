import { StringOperation, stringTransform } from "./operation";

const s = "abcde";

const apply = (o: StringOperation, s: string): string => {
  const start = Math.min(s.length, o.rangeStart);
  const end = o.newValue == "" ? o.rangeEnd : start;
  return s.substring(0, start) + o.newValue + s.substring(end);
};

describe("insert insert", () => {
  test("non overlap", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "1" };
    const o2: StringOperation = { rangeStart: 2, rangeEnd: 3, newValue: "2" };
    expect(apply(o1, s)).toBe("a1bcde");
    expect(apply(o2, s)).toBe("ab2cde");

    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("a1b2cde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("a1b2cde");
  });

  test("same location", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "2" };
    const o2: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "1" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("a12bcde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("a12bcde");
  });

  test("overlap", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 3, newValue: "11" };
    const o2: StringOperation = { rangeStart: 2, rangeEnd: 4, newValue: "22" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("a11b22cde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("a11b22cde");
  });
});

describe("insert delete", () => {
  test("non overlap", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "1" };
    const o2: StringOperation = { rangeStart: 2, rangeEnd: 3, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("a1bde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("a1bde");
  });

  test("same location", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "1" };
    const o2: StringOperation = { rangeStart: 0, rangeEnd: 1, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("1bcde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("1bcde");
  });

  test("overlap insert before delete", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 3, newValue: "12" };
    const o2: StringOperation = { rangeStart: 0, rangeEnd: 1, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("12bcde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("12bcde");
  });

  test("overlap delete before insert", () => {
    const o1: StringOperation = { rangeStart: 2, rangeEnd: 3, newValue: "1" };
    const o2: StringOperation = { rangeStart: 0, rangeEnd: 3, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("1de");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("1de");
  });

  test("overlap less insert than delete", () => {
    const o1: StringOperation = { rangeStart: 0, rangeEnd: 1, newValue: "1" };
    const o2: StringOperation = { rangeStart: 0, rangeEnd: 5, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("1");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("1");
  });

  test("overlap more insert than delete", () => {
    const o1: StringOperation = {
      rangeStart: 0,
      rangeEnd: 5,
      newValue: "11111",
    };
    const o2: StringOperation = { rangeStart: 0, rangeEnd: 1, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("11111bcde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("11111bcde");
  });
});

describe("delete delete", () => {
  test("non overlap", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "" };
    const o2: StringOperation = { rangeStart: 2, rangeEnd: 3, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("ade");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("ade");
  });

  test("same operations", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "" };
    const o2: StringOperation = { rangeStart: 1, rangeEnd: 2, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("acde");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("acde");
  });

  test("overlap", () => {
    const o1: StringOperation = { rangeStart: 1, rangeEnd: 3, newValue: "" };
    const o2: StringOperation = { rangeStart: 2, rangeEnd: 3, newValue: "" };
    const [o1_t1, o2_t1] = stringTransform(o1, o2);
    const [o1_t2, o2_t2] = stringTransform(o2, o1);
    console.log(o1_t1, o2_t1);
    console.log(o1_t2, o2_t2);
    expect(apply(o1_t1, apply(o2_t1, s))).toBe("ade");
    expect(apply(o2_t2, apply(o1_t2, s))).toBe("ade");
  });
});
