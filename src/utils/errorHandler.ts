import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";
import BaseError from "../errors/BaseError";

function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof BaseError) {
    logger.error(`${error.name}: ${error.message}`, { details: error.details });
  } else {
    logger.error(`Internal Server Error: ${error.message}`);
  }

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.name,
      details: error.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong !!",
    error: "InternalServerError",
    details: {},
  });
}

export default errorHandler;
