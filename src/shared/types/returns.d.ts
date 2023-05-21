export interface ControllerReturn<T> {
  body: UseCaseReturn<T>;
  headers: Record<string, string>;
  statusCode: number;
}

export type UseCaseReturn<T> =
  | {
      success: true;
      data: T | undefined;
    }
  | {
      success: false;
      error: unknown;
    };

export type DBAccessReturn<T> =
  | {
      success: true;
      data: T | undefined;
    }
  | {
      success: false;
      error: unknown;
    };

type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

export type EntityReturn<T> =
  | {
      success: true;
      data: Getters<T>;
    }
  | { success: false; error: unknown };
