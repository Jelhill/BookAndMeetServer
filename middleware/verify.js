const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

module.exports = (req, res, next) => {
    try {
        const headerToken = req.headers.authorization.split(" ")[1]
        const verifyToken = jwt.verify(headerToken, SECRET)    
        console.log("Verify Token", verifyToken)
        next()
    } catch (error) {
        res.status(401).json({message: "Unauthorize"})
    }
}
