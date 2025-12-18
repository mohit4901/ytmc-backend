import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin Not Authorized"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied. Admin Only."
      });
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log("Admin Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Admin Token"
    });
  }
};

export default adminAuth;
