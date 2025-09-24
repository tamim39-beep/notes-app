import { pool } from "../config/db.js";
import noteRouter from "../routes/notesRoute.js";

const test = "hahhhaha";
// mendapatkan semua catatan
export const getAllNotesHandlers = async (req, res) => {
  const [notes] = await pool.query("SELECT * FROM notes");

  res.status(200).json({
    message: "success",
    data: notes,
  });
};

export const addNoteHandler = (req, res) => {
  const { title, content } = req.body;
  //simpan catatan baru ke database
  const newNote = pool.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content]
  );

  res.status(201).json({
    message: "Note added successfully",
    data: "Note created",
  });
};

export const getNoteByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  res.status(200).json({
    message: "success",
    data: notes,
  });
};
