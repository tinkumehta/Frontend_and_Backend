const express = require("express");
const cors = require("cors");
const compareRoute = require("./routes/compare");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", compareRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
