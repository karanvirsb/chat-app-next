export type DBUpdateStr = (args: { [key: string]: any }) => string;

export default function DBUpdateStr(args: { [key: string]: any }): string {
  const updateArr: string[] = [];

  for (let i in args) {
    updateArr.push(DBUpdateStrBroker(i, args[i]));
  }

  return updateArr.join(", ");
}

export function DBUpdateStrBroker(key: string, value: unknown) {
  if (typeof value === "string") {
    return StringToDBString(key, value);
  } else if (typeof value === "boolean") {
    return BooleanToDBBoolean(key, value);
  } else if (typeof value === "number") {
    return NumberToDBNumber(key, value);
  } else if (value instanceof Date) {
    return DateToDBDate(key, value);
  } else if (value === null) {
    return NullToDBNull(key);
  } else {
    return Array.isArray(value) ? ArrayToDBArray(key, value) : "";
  }
}

// String -> 'add'
export function StringToDBString(key: string, value: string): string {
  return `"${key}" = '${value}'`;
}
// Date -> to_timestamp(date.getTime()/1000)
export function DateToDBDate(key: string, value: Date): string {
  return `"${key}" = to_timestamp(${value.getTime()}/1000)`;
}
// Number -> add
export function NumberToDBNumber(key: string, value: number): string {
  return `"${key}" = ${value}`;
}
// Boolean -> uppercase
export function BooleanToDBBoolean(key: string, value: Boolean): string {
  // true -> TRUE
  // false -> FALSE
  return `"${key}" = ${value === true ? "TRUE" : "FALSE"}`;
}
// Array -> '{join(", ")}'
export function ArrayToDBArray(key: string, value: unknown[]): string {
  const newArr = convertedArrayValues(value);
  return `"${key}" = '{${newArr.join(", ")}}'`;
}

export function convertedArrayValues(arr: unknown[]): unknown[] {
  return arr.map((value) => {
    if (typeof value === "string") {
      return `"${value}"`;
    } else if (typeof value === "boolean") {
      return value === true ? "TRUE" : "FALSE";
    } else if (typeof value === "number") {
      return value;
    } else if (value instanceof Date) {
      return `to_timestamp(${value.getTime()}/1000)`;
    } else if (value === null) {
      return "NULL";
    } else {
      return Array.isArray(value)
        ? `'{${convertedArrayValues(value).join(", ")}}'`
        : "";
    }
  });
}
// Null -> NULL
export function NullToDBNull(key: string): string {
  return `"${key}" = NULL`;
}
