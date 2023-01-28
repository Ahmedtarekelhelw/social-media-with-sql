import express from "express";
import { getPosts, addNewPost, deletePost } from "../controllers/post.js";

const router = express.Router();

router.route("/").get(getPosts).post(addNewPost).delete(deletePost);

export default router;
