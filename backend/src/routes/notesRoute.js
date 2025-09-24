import express from "express";
import { getAllNotesHandlers } from "../handlers/notesHandler.js";
import { addNoteHandler } from "../handlers/notesHandler.js";
import { getNoteByIdHandler } from "../handlers/notesHandler.js";
const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandlers);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNoteByIdHandler);

export default noteRouter;
