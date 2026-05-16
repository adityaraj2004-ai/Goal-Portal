export const DB_NAME = "goal-portal";
const ROLES = {
    EMPLOYEE: "employee",
    MANAGER:  "manager",
    ADMIN:    "admin",
  };
  
  const GOAL_STATUS = {
    DRAFT:    "draft",     // employee still editing
    PENDING:  "pending",   // submitted, awaiting manager
    APPROVED: "approved",  // manager approved → goals locked
    RETURNED: "returned",  // manager sent back for rework
  };
  
  const UOM_TYPES = {
    MAX:      "max",       // higher actual = better (e.g. revenue)
    MIN:      "min",       // lower actual = better (e.g. defects)
    TIMELINE: "timeline",  // did it finish by the deadline?
    ZERO:     "zero",      // target is 0; any occurrence = failure
  };
  
  const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
  
  export { ROLES, GOAL_STATUS, UOM_TYPES, QUARTERS };