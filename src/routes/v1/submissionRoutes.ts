import { Router } from "express";
import { addSubmission } from "../../controllers/submissionController";
import { validate } from "../../validators/zodValidator";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";

const submissionRouter = Router();

submissionRouter.post(
  "/",
  validate(createSubmissionZodSchema, "Create Submission"),
  addSubmission,
);

export default submissionRouter;