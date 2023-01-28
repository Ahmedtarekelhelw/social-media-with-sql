import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getLikes = (req, res) => {
  const { postId } = req.query;
  const q = "SELECT userId FROM likes WHERE postId = ?";
  db.query(q, [postId], (err, likes) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(likes.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged In");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token Not Valid");

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const { postId } = req.body;
    const { id } = userInfo;
    const values = [id, postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(id);
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged In");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token Not Valid");

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(userInfo.id);
    });
  });
};
