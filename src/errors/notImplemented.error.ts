import { StatusCodes } from "http-status-codes";
import BaseError from "./BaseError";

class NotImplemented extends BaseError {
  constructor(methodName: string) {
    super(
      "NotImplemented",
      StatusCodes.NOT_IMPLEMENTED,
      `${methodName} Not Implemented`,
      {},
    );
  }
}

export default NotImplemented;
