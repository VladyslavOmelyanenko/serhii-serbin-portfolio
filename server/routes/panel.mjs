import express from "express";
const router = express.Router();
import { User } from '../models/User.mjs';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// const admin = new User({
//   username: "serhiiserbin",
//   password: await bcrypt.hash("mMSr76ws$mFhk32",10),
// });




router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({userId: user._id, secretKey: 'serbin'}, 'yourSecretKey' );
    res.json({ token });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;