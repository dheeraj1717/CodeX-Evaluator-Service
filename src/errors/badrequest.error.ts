import { StatusCodes } from "http-status-codes";
import BaseError from "./BaseError";

class BadRequest extends BaseError {
  constructor(propertyName: string, details: any) {
    super(
      "BadRequest",
      StatusCodes.BAD_REQUEST,
      `Invalid structure for ${propertyName} provided`,
      details,
    );
  }
}

export default BadRequest;
