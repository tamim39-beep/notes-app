import { pool } from "../config/db.js";
import noteRouter from "../routes/notesRoute.js";

// ================== GET ALL NOTES ==================
export const getAllNotesHandlers = async (req, res) => {
  try {
    const [notes] = await pool.query("SELECT * FROM notes");

    res.status(200).json({
      status: "success",
      message: "success",
      data: notes,
    });
  } catch (error) {
    console.error("Error in getAllNotesHandlers:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// ================== ADD NOTE ==================
export const addNoteHandler = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "content is required",
      });
    }

    // simpan catatan baru ke database
    const [result] = await pool.query(
      "INSERT INTO notes (title, content) VALUES (?, ?)",
      [title, content]
    );

    const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      status: "success",
      message: "Note added successfully",
      data: notes[0],
    });
  } catch (error) {
    console.error("Error in addNoteHandler:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// ================== GET NOTE BY ID ==================
export const getNoteByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

    if (notes.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: notes[0],
    });
  } catch (error) {
    console.error("Error in getNoteByIdHandler:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// ================== UPDATE NOTE ==================
export const updateNoteByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "content is required",
      });
    }

    await pool.query("UPDATE notes SET title = ?, content = ? WHERE id = ?", [
      title,
      content,
      id,
    ]);

    const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

    if (notes.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Note updated successfully",
      data: notes[0],
    });
  } catch (error) {
    console.error("Error in updateNoteByIdHandler:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// ================== DELETE NOTE ==================
export const deleteNoteByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const [deleteNote] = await pool.query("DELETE FROM notes WHERE id = ?", [
      id,
    ]);

    if (deleteNote.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteNoteByIdHandler:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
