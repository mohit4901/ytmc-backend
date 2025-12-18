import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. No Token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default auth;
