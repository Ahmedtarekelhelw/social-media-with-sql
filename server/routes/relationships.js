import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
} from "../controllers/relationship.js";

const router = express.Router();

router
  .route("/")
  .get(getRelationships)
  .post(addRelationship)
  .delete(deleteRelationship);

export default router;
