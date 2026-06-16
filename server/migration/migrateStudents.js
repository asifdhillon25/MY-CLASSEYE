// migrations/migrateStudents.js
const Student = require("../models/student.model");

async function migrateStudents() {
  console.log("Starting student migration...");

  const students = await Student.find();
  let updatedCount = 0;

  for (const s of students) {
    let changed = false;

    if (s.emdedded_photo_urls !== undefined) {
      s.emdedded_photo_urls = undefined;
      changed = true;
    }

    if (!Array.isArray(s.face_embedding) || s.face_embedding.length !== 512) {
      s.face_embedding = [];
      s.has_embeddings = false;
      s.embeddings_image_count = 0;
      s.embeddings_updated_at = null;
      changed = true;
    }

    if (!s.updated_at) {
      s.updated_at = new Date();
      changed = true;
    }

    if (changed) {
      await s.save({ validateBeforeSave: false });
      updatedCount++;
    }
  }

  console.log(`Student migration completed. Updated ${updatedCount} records.`);
}

module.exports = migrateStudents;
