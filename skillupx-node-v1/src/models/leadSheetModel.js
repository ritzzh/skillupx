import pool from "../config/db.js";

// Create new lead
export const createLead = async ({ email, name, phone, subject }) => {
  const q = `
    INSERT INTO lead_sheet (email, name, phone, subject, created_at, active)
    VALUES ($1, $2, $3, $4, NOW(), true)
    RETURNING *
  `;
  const values = [email, name, phone, subject];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

// Update lead
export const updateLead = async (id, patch) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [k, v] of Object.entries(patch)) {
    fields.push(`${k} = $${i++}`);
    values.push(v);
  }
  values.push(id);

  const q = `
    UPDATE lead_sheet
    SET ${fields.join(", ")}
    WHERE lead_id = $${i}
    RETURNING *
  `;

  const { rows } = await pool.query(q, values);
  return rows[0] || null;
};

// Get single lead
export const findLeadById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM lead_sheet WHERE lead_id = $1",
    [id]
  );
  return rows[0] || null;
};

// List all leads (filter active = true)
export const listLeads = async ({ limit = 100, offset = 0 } = {}) => {
  const { rows } = await pool.query(
    `SELECT * FROM lead_sheet
     WHERE active = true
     ORDER BY lead_id DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

// Soft delete (set active = false)
export const softDeleteLead = async (id) => {
  const { rows } = await pool.query(
    "UPDATE lead_sheet SET active = false WHERE lead_id = $1 RETURNING *",
    [id]
  );
  return rows[0] || null;
};
