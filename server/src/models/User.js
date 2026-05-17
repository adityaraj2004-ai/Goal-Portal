// ─── models/User.js ─────────────────────────────────────────────
// PURPOSE: Defines the shape of a "user" document in MongoDB.
// Every employee, manager, and admin is stored in this one
// collection. The `role` field drives RBAC throughout the app.
// `managerId` links an employee to their L1 manager — this lets
// the manager controller fetch "all users where managerId = me".
// ────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,          // no duplicate accounts
      lowercase: true,
      trim: true,
    },

    // We NEVER store plain-text passwords.
    // bcrypt hash is stored here; comparison happens in matchPassword().
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never return password in any query by default
    },

    role: {
      type: String,
      enum: Object.values(ROLES), // only "employee", "manager", "admin"
      default: ROLES.EMPLOYEE,
    },

    // Only set for employees and managers (managers can also have a manager above them).
    // Null for the top-level admin.
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// ── HOOK: hash password before saving ───────────────────────────
// Runs every time a document is saved. The `isModified` check
// prevents re-hashing an already-hashed password on unrelated saves.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── METHOD: compare a plain password against the stored hash ────
// Called in auth.controller.js during login.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
