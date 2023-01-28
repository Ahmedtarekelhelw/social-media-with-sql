import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token Not Valid");
    const { userId } = req.query;

    const q =
      userId !== "undefined"
        ? `SELECT p.* , u.id AS userId , name , profilePic FROM posts AS p
       JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?
       ORDER BY p.createdAt DESC`
        : `SELECT p.* , u.id AS userId , name , profilePic FROM posts AS p
       JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r 
       ON (p.userId = r.followedUserId ) WHERE r.followerUserId = ? OR p.userId = ?
       ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
    db.query(q, values, (err, posts) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(posts);
    });
  });
};

export const addNewPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token Not Valid");
    const { desc, img } = req.body;
    const values = [
      desc,
      img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    const q =
      "INSERT INTO posts (`desc` , `img` , `createdAt` , `userId`) VALUES (?)";
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token Not Valid");
    const { postId } = req.query;

    const q = "DELETE FROM posts WHERE id = ? AND userId = ?";
    const values = [postId, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json(postId);
      return res.status(403).json("You can delete only your post");
    });
  });
};
