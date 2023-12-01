import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    console.log(authHeader)
    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'authHeader dont start with Bearer' })
    }
    const token = authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Access token not valid'}) 
            req.email = decoded.email
            req._id = decoded._id
            next()  
        }
    );

  };