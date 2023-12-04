import User from "../models/User.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./Auth/auth.controller.js";

export const handleSignIn = (bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // VALIDATION
  if (!email || !password) {
    return res.status(400).json("Введите логин и пароль");
  }

  try {
    // Request user by email from DB
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res
        .status(401)
        .json("Аккаунт с таким email не существует");
    }

    // Compare hashed password with password from client
    const match = await bcrypt.compare(password, foundUser.password);
    console.log(match)
    
    if (!match) {
      return res.status(400).json("Неверная комбинация логина и пароля");
    } 
    
      const accessToken = generateAccessToken(foundUser);
      const refreshToken = generateRefreshToken(foundUser);
  
      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, // accessible only by web browser
        secure: true, // https
        sameSite: "None", // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match rT
      });
  
      // Send token containing email and role
      return res.json({ accessToken });
 } catch (err) {
    res.status(400).json("Неверная комбинация логина и пароля");
  }
}