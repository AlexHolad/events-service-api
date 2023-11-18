import User from "../models/User.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./Auth/auth.controller.js";

export const handleRegister = (bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  // VALIDATION
  if (!email || !password) {
    return res.status(400).json("incorrect form submission")
  }

  // CHECK IF USER ALREADY EXIST IN DATABASE
  const isExist = await User.findOne({ email: email })

  if (isExist !== null) {
    return res.status(409).send("User with this email already exist")
  } else {
    try {
      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, async function (err, hash) {
        const user = new User({
          email: email,
          role: "user",
          password: hash,
          events: [],
        });

        await user.save();

        const accessToken = generateAccessToken({_id: user._id.valueOf(), email: user.email})
        const refreshToken = generateRefreshToken({email: user.email})
        console.log(typeof user._id, user._id.valueOf())
        // Create secure cookie with refresh token
        res.cookie("jwt", refreshToken, {
          httpOnly: true, // accessible only by web browser
          secure: true, // https
          sameSite: "None", // cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match rT
        });

        res.json({ accessToken })
      });
    } catch (err) {
      res.status(400).send("Bad request")
    }
  }
};
