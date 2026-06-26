//backend/server.js
// backend/server.js

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);
      console.log(
        `Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );

    });

  } catch (error) {

    console.error("Failed to start server:", error.message);
    process.exit(1);

  }
};

startServer();