const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const cors = require("cors");
const app = express();

app.use(cors())
app.use(express.json());


app.use("/api", routes);
app.use(errorHandler)

module.exports = app;