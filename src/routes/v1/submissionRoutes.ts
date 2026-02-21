import { Router } from "express";
import { addSubmission } from "../../controllers/submissionController";

const submissionRouter = Router();

submissionRouter.post("/", addSubmission);
 
export default submissionRouter;