// ─── models/Goal.js ─────────────────────────────────────────────
// PURPOSE: Each row in an employee's goal sheet is one Goal doc.
// Key fields for RBAC flow:
//   status  → drives what actions are available (edit? submit? approve?)
//   locked  → true once approved; blocks further employee edits
//   sharedParentId → set when admin pushes a shared KPI; the goal
//                    title/target is read-only for the recipient
// ────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import { GOAL_STATUS, UOM_TYPES } from "../config/constants.js";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // every goal belongs to exactly one employee
    },

    title:       { type: String, required: true, trim: true },
    thrustArea:  { type: String, required: true },   // e.g. "Revenue Growth"
    description: { type: String, default: "" },

    uom: {
      type: String,
      enum: Object.values(UOM_TYPES),
      required: true,
    },

    target:    { type: Number, required: true },
    weightage: { type: Number, required: true, min: 10, max: 100 },

    status: {
      type: String,
      enum: Object.values(GOAL_STATUS),
      default: GOAL_STATUS.DRAFT,
    },

    // Once manager approves → locked = true.
    // Post-lock edits require admin to unlock (sets this back to false).
    locked: { type: Boolean, default: false },

    // If this goal was pushed by admin as a shared KPI,
    // sharedParentId stores the source goalId.
    // The controller uses this to make title+target read-only.
    sharedParentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },

    // Optional: manager's note when returning a goal sheet
    returnNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);