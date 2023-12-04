import jwt from "jsonwebtoken";

import User from "../../models/User.js"

export const refreshToken = () => async (req, res) => {
    const cookies = req.cookies
    
    console.log(cookies)

    if(!cookies?.jwt) return res.status(401).json({ message: 'You are not authorized' }) 
    
    const refreshToken = cookies.jwt

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          res.clearCookie(
            "jwt", { httpOnly: true, sameSite: "None", secure: true  }
          );
          return res.status(403).json({ message: 'Refresh token not valid animore, please log in' })
        }

        const foundUser = await User.findOne({email: decoded.email})

        if (!foundUser) return res.status(401).json({ message: 'User not found' })
        
        const userId = foundUser._id.valueOf()
        const accessToken = generateAccessToken({email: foundUser.email, role: foundUser.role, _id: userId})

        res.json({accessToken})
      }
    )  
};

export const generateAccessToken = (user) => {
  const userId = user._id.toString()
  return jwt.sign(
      {
        email: user.email,
        role: user.role,
        _id: userId
      },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      email: user.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
};
