export type PaginatedGroupMessages<T> = {
  hasNextPage: boolean;
  nextPage: string | null;
  data: T[];
};
