import express from "express";
import {
  deleteNoteByIdHandler,
  getAllNotesHandlers,
  updateNoteByIdHandler,
  addNoteHandler,
  getNoteByIdHandler,
} from "../handlers/notesHandler.js";

const noteRouter = express.Router();

// karena sudah diprefix "/notes" di server.js
noteRouter.get("/", getAllNotesHandlers); // GET /notes
noteRouter.post("/", addNoteHandler); // POST /notes
noteRouter.get("/:id", getNoteByIdHandler); // GET /notes/:id
noteRouter.put("/:id", updateNoteByIdHandler); // PUT /notes/:id
noteRouter.delete("/:id", deleteNoteByIdHandler); // DELETE /notes/:id

export default noteRouter;
