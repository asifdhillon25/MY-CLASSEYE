// uploadRoutes.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // node-fetch v3
const FormData = require("form-data");
const Student = require("../models/student.model"); // Import your student model

const IMGBB_API_KEY = "0c7a84592216317dc484e9758f6d7a23"; // hide this in .env for production
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const FLASK_SERVER_URL = "http://127.0.0.1:8000"; // Flask server URL
const AI_API_URL = process.env.AI_API_URL || "https://asifdhillon25-classeye.hf.space"; // AI API URL (can be Flask or Hugging Face Space)  

/**
 * Generic image upload endpoint
 * Accepts:
 *   - image_url (string)
 *   - or base64 string (from file or canvas)
 */
router.post("/imgbb", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Create form-data for ImgBB
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("ImgBB response:", data);

    if (!data.success) {
      return res.status(500).json({ success: false, message: "ImgBB upload failed", data });
    }

    // Return only the important data (URL, delete URL, etc.)
    res.json({
      success: true,
      url: data.data.url,          // direct image URL
      display_url: data.data.display_url,
      delete_url: data.data.delete_url,
    });

  } catch (error) {
    console.error("ImgBB upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Generate face embeddings from multiple images and save to student
 * Accepts:
 *   - studentId: MongoDB student ID
 *   - images: array of base64 encoded images
 */
// uploadRoutes.js (Fixed)
router.post("/generate-embeddings", async (req, res) => {
  try {
    const { studentId, images } = req.body;

    // Validate inputs
    if (!studentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Student ID is required" 
      });
    }

    if (!images || !Array.isArray(images) || images.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: "At least 3 images are required" 
      });
    }

    if (images.length > 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Maximum 10 images allowed" 
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    console.log(`Generating embeddings for student: ${student.name}, ${images.length} images`);

    // Prepare data for Flask server
    const payload = {
      student_id: studentId.toString(),
      student_name: student.name,
      images: images.map(img => {
        // Remove data URL prefix if present
        if (img.startsWith('data:')) {
          return img.split(',')[1] || img;
        }
        return img;
      })
    };

    console.log("Sending request to Flask server...");

    // Send images to Flask server for face recognition
    const flaskResponse = await fetch(`${AI_API_URL}/generate-embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      timeout: 60000, // 60 seconds timeout (face detection can be slow)
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      console.error("Flask server error:", errorText);
      throw new Error(`Flask server responded with status: ${flaskResponse.status}`);
    }

    const flaskData = await flaskResponse.json();
    console.log("Flask server response received");

    if (!flaskData.success) {
      console.error("Flask server failed:", flaskData.message);
      return res.status(400).json({
        success: false,
        message: flaskData.message || "Failed to generate embeddings",
        details: flaskData.details,
        valid_faces: flaskData.valid_faces,
        face_detected_count: flaskData.face_detected_count
      });
    }

    // Validate the embedding
    if (!flaskData.embeddings || !Array.isArray(flaskData.embeddings)) {
      console.error("Invalid embeddings received:", flaskData.embeddings);
      return res.status(500).json({
        success: false,
        message: "Invalid embeddings received from face recognition server"
      });
    }

    console.log(`Embedding dimension: ${flaskData.embeddings.length}`);

    // Update student with face embeddings
    const updateData = {
      face_embedding: flaskData.embeddings, // This should be a 1D array now
      has_embeddings: true,
      embeddings_updated_at: new Date(),
      embeddings_image_count: flaskData.valid_embeddings_count || images.length,
      last_embedding_dimension: flaskData.embedding_dimension
    };

    console.log("Updating student with embeddings...");
    
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("Student updated successfully");

    res.json({
      success: true,
      message: `Face embeddings generated successfully for ${student.name}`,
      student: {
        id: updatedStudent._id,
        name: updatedStudent.name,
        roll_no: updatedStudent.roll_no,
        has_embeddings: updatedStudent.has_embeddings,
        embeddings_count: updatedStudent.face_embedding?.length || 0,
        images_processed: updatedStudent.embeddings_image_count
      },
      metadata: {
        processing_time: flaskData.processing_time,
        face_detected: flaskData.face_detected,
        confidence: flaskData.confidence,
        embedding_dimension: flaskData.embedding_dimension,
        valid_embeddings_count: flaskData.valid_embeddings_count,
        total_images: images.length
      }
    });

  } catch (error) {
    console.error("Generate embeddings error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to generate embeddings",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Get student embeddings status
 */
router.get("/embeddings-status/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select(
      "name roll_no has_embeddings face_embedding embeddings_updated_at embeddings_image_count"
    );

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        roll_no: student.roll_no,
        has_embeddings: student.has_embeddings || false,
        embeddings_updated_at: student.embeddings_updated_at,
        embeddings_count: student.face_embedding?.length || 0,
        images_used: student.embeddings_image_count || 0
      }
    });

  } catch (error) {
    console.error("Get embeddings status error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;