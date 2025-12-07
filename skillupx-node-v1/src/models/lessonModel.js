// src/models/lessonModel.js
import pool from '../config/db.js';

export const createLesson = async ({ course_id, title, slug = null, summary = null, duration_seconds = 0 }) => {
  const q = `
    INSERT INTO lessons (course_id, title, slug, summary, duration_seconds)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [course_id, title, slug, summary, duration_seconds];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const updateLesson = async (id, patch) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(patch)) {
    fields.push(`${key} = $${idx++}`);
    values.push(val);
  }

  if (fields.length === 0) return await findLessonById(id);

  values.push(id);

  const q = `
    UPDATE lessons
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *
  `;

  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const findLessonById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM lessons WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
};

export const listLessonsForCourse = async (course_id, { limit = 100, offset = 0 } = {}) => {
  const { rows } = await pool.query(
    `SELECT * FROM lessons 
     WHERE course_id = $1 AND deleted_at IS NULL
     ORDER BY id
     LIMIT $2 OFFSET $3`,
    [course_id, limit, offset]
  );
  return rows;
};

export const softDeleteLesson = async (id) => {
  const { rows } = await pool.query(
    'UPDATE lessons SET deleted_at = NOW() WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};
