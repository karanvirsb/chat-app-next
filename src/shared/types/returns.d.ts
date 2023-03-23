export interface ControllerReturn<T> {
  body: UseCaseReturn<T>;
  headers: Record<String, String>;
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
