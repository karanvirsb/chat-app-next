interface ControllerReturn<T> {
  body: UseCaseReturn<T>;
  headers: Record<String, String>;
  statusCode: number;
}

type UseCaseReturn<T> =
  | {
      success: true;
      data: T | undefined;
    }
  | {
      success: false;
      error: unknown;
    };

type DBAccessReturn<T> =
  | {
      success: true;
      data: T | undefined;
    }
  | {
      success: false;
      error: unknown;
    };
