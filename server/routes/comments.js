import express from "express";
import { getComments, addNewComment } from "../controllers/comment.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addNewComment);

export default router;
