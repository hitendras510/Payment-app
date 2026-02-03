const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authHeader;

    if(!authHeader || authHeader.startsWith('Bearer')){
      //Bearer is an authentication scheme(Bearer = “whoever bears (has) this token is allowed”)
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1]; //Bearer token are splitted by space
    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
}

module.exports = authMiddleware;