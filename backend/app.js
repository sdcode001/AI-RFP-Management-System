const express = require('express')
const path = require("path");
const cors = require('cors')
const {router }= require("./router");

const app = express();

app.use(cors());

app.use(express.json());

//serve files from /uploads directory in GET request
app.use("/uploads", express.static(path.resolve(__dirname, "./uploads")));

app.use("/api", router);

module.exports = {
    app
}