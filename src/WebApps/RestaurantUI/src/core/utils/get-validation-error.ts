import { TypeWidthKey } from "../models/type-with-key";

export const getValidationError = (err: any) => {
  const codeMatcher: TypeWidthKey<string> = {
    ERR_NETWORK: "Network Error",
    ERR_BAD_REQUEST: "Request failed with status code 404",
  };
  return codeMatcher[err];
};
