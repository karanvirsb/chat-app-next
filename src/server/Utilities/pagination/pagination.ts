type props = {
  prevDate: number;
  nextDate: number | null;
  rows: unknown[];
};

export interface Pagination<T> {
  hasNextPage: boolean;
  cursor: number | null;
  data: T[];
}

export default function pagination<T>({ prevDate, nextDate, rows }: props) {
  const hasNextPage = nextDate !== null;

  return {
    hasNextPage,
    cursor: nextDate ? prevDate + ".000Z" : null,
    data: rows as T[],
  };
}
