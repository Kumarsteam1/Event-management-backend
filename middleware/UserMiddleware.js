const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const authUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        // Check if Authorization Header Exists
        if (!authorization) {
            return res.status(401).json({ error: "Auth Token Required" });
        }

        // Extract Token from Header (Format: "Bearer <token>")
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid Auth Token Format" });
        }

        // Verify Token
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        // Find User by ID and Attach to Request
        const user = await User.findById(_id).select("_id");
        if (!user) {
            return res.status(401).json({ error: "User Not Found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or Expired Token" });
    }
};

module.exports = authUser;
