const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

require("dotenv").config();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cors());

//Import Routes
const routes = require("./routes/routes")(app, fs);

// app.use("/pizzas", pizzasRoute);

const PORT = process.env.PORT || 8000;
// Listen on port 8000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));