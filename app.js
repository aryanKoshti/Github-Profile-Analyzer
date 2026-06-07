require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const profileRoutes = require("./routes/profileRoutes");

require("./config/db");


app.use(cors());
app.use(express.json());
app.use("/api", profileRoutes);


app.get("/", (req, res) => {
  res.json({ message: "GitHub Analyzer API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});