/**
 * Reads JSON from Response without checking response.ok
 * Useful when you need to handle both success and error responses
 */
export const readJson = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json()) as T;
  return payload;
};

/**
 * Reads JSON from Response and throws error if response is not ok
 * Useful for simple cases where you only expect success responses
 */
export const readJsonOrThrow = async <T>(
  response: Response,
  errorMessage?: string
): Promise<T> => {
  const payload = (await response.json()) as T;
  if (!response.ok) {
    const message =
      (payload as { message?: string }).message ??
      errorMessage ??
      "Request failed";
    throw new Error(message);
  }
  return payload;
};
