import { ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";
import BadRequest from "../errors/badrequest.error";

export const validate =
  (schema: ZodSchema<any>, propertyName?: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
       ...req.body,
       ...req.params,
       ...req.query
      });
      next();
    } catch (error) {
      throw new BadRequest(propertyName || "request", error);
    }
  };
