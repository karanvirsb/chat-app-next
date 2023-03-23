import DBUpdateStr, {
  ArrayToDBArray,
  BooleanToDBBoolean,
  DateToDBDate,
  NullToDBNull,
  NumberToDBNumber,
  StringToDBString,
} from ".";

describe("Testing out DBUpdateString", () => {
  it("Testing out String", () => {
    const result = StringToDBString("name", "john");
    expect(result).toBe(`"name" = 'john'`);
  });
  it("Testing out Boolean", () => {
    const result = BooleanToDBBoolean("name", true);
    expect(result).toBe(`"name" = TRUE`);
  });
  it("Testing out Number", () => {
    const res = NumberToDBNumber("num", 15);
    expect(res).toBe(`"num" = 15`);
  });
  it("Testing out Date", () => {
    const date = new Date();
    const res = DateToDBDate("date", date);
    expect(res).toBe(`"date" = to_timestamp(${date.getTime()}/1000)`);
  });
  it("Testing out Null", () => {
    const res = NullToDBNull("date");
    expect(res).toBe(`"date" = NULL`);
  });
  it("Testing out Array", () => {
    const res = ArrayToDBArray("random", [12, 14, true, "nice", ["str", 12]]);
    expect(res).toBe(`"random" = '{12, 14, TRUE, "nice", '{"str", 12}'}'`);
  });

  it("Testing out full function", () => {
    const obj = {
      name: "john",
      boo: true,
      num: 15,
      date: new Date(),
      email: null,
      random: [12, 14, true, "nice", ["str", 12]],
    };
    const res = DBUpdateStr(obj);
    expect(res).toBe(
      `"name" = 'john', "boo" = TRUE, "num" = 15, "date" = to_timestamp(${obj.date.getTime()}/1000), "email" = NULL, "random" = '{12, 14, TRUE, "nice", '{"str", 12}'}'`
    );
  });
});
