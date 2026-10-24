
export interface APIResult<T = any> {
  Message?: string;
  MessageType: Number;
  Result?: T;
};

export const ErrorAPIResult: APIResult = {
  Message: "Internal server error.",
  MessageType: 0
};
