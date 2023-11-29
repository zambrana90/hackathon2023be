const cors = require("cors");

const corsMiddleware = cors({
	origin: process.env.FRONTEND_POINT || "http://localhost:3000",
	allowedHeaders: ["Content-Type", "Authorization"]
});

module.exports = corsMiddleware;