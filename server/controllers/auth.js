import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { username, email, password, name } = req.body;
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");
    //hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const q =
      "INSERT INTO users(`username`, `email`, `password` ,`name`) VALUES (?)";

    const values = [username, email, hashedPassword, name];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created successfully");
    });
  });
};

export const login = (req, res) => {
  const { username, password: FrontPassword } = req.body;
  const q = "SELECT * FROM users WHERE username = ? ";

  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("User Not Found");

    //check the password
    const isMatch = bcrypt.compareSync(FrontPassword, data[0].password);
    if (!isMatch) return res.status(400).json("Password is Wrong");

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_KEY);
    const { password, ...others } = data[0];
    return res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json({ ...others, accessToken: token });
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
