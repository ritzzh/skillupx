import { validationResult } from "express-validator";
import * as leadModel from "../models/leadSheetModel.js";

// Create Lead
export const createLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, name, phone, subject } = req.body;

    const lead = await leadModel.createLead({
      email,
      name,
      phone,
      subject,
    });

    res.status(201).json({ lead });
  } catch (err) {
    next(err);
  }
};

// Update Lead
export const updateLead = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const patch = req.body;

    const lead = await leadModel.updateLead(id, patch);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (err) {
    next(err);
  }
};

// Get Lead by ID
export const getLead = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const lead = await leadModel.findLeadById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (err) {
    next(err);
  }
};

// List Leads
export const listLeads = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const offset = Number(req.query.offset) || 0;

    const leads = await leadModel.listLeads({ limit, offset });

    res.json({ leads });
  } catch (err) {
    next(err);
  }
};

// Delete (soft)
export const deleteLead = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const lead = await leadModel.softDeleteLead(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (err) {
    next(err);
  }
};
