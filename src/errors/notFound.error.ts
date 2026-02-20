import { StatusCodes } from "http-status-codes";
import BaseError from "./BaseError";

class NotFoundError extends BaseError {
  constructor(resourceName: string, resourceValue: any) {
    super(
      "Not found",
      StatusCodes.NOT_FOUND,
      `${resourceName} with value ${resourceValue} not found`,
      {
        resourceName,
        resourceValue,
      },
    );
  }
}

export default NotFoundError;
