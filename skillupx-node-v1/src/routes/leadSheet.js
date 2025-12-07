import express from "express";
import { body } from "express-validator";
import * as controller from "../controllers/leadSheetController.js";

const router = express.Router();

// Validation rules
const leadValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("name").notEmpty().withMessage("Name required"),
  body("phone").notEmpty().withMessage("Phone required"),
  body("subject").notEmpty().withMessage("Subject required"),
];

// Routes
router.post("/", leadValidation, controller.createLead);
router.get("/", controller.listLeads);
router.get("/:id", controller.getLead);
router.patch("/:id", controller.updateLead);
router.delete("/:id", controller.deleteLead);

export default router;
