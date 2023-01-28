import { db } from "../connect.js";
import moment from "moment";
import jwt from "jsonwebtoken";

export const getComments = (req, res) => {
  const q = `SELECT c.* , u.id AS commnetUserId , name , profilePic FROM comments AS c JOIN users As u
     ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC `;
  db.query(q, [req.query.postId], (err, comments) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(comments);
  });
};

export const addNewComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token Not Valid");
    const { desc } = req.body;
    const { postId } = req.query;
    const q =
      "INSERT INTO comments(`desc` , `createdAt` , `userId` , `postId`) VALUES (?)";

    const values = [
      desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      postId,
    ];
    db.query(q, [values], (err, comments) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created");
    });
  });
};
