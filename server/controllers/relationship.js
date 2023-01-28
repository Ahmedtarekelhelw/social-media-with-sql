import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const { followedUserId } = req.query;
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  db.query(q, [followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((d) => d.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(403).json("Not Logged In");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(401).json("Token is Not Valid");

    const q =
      "INSERT INTO relationships (`followerUserId` , `followedUserId`) VALUES (?)";

    const values = [userInfo.id, req.query.followedUserId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(userInfo.id);
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(403).json("Not Logged In");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(401).json("Token is Not Valid");

    const q = "DELETE FROM relationships WHERE followerUserId = ?";

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(userInfo.id);
    });
  });
};
