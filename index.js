const express = require("express");
const bodyParser = require("body-parser");
const appPort = 7500;
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const app = express();

//middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.options("*", cors()); // Handle preflight requests
app.use(cors());

// Database Connection
mongoose.connect(
  "mongodb+srv://ppbackend:Web786786@healthcarecluster.yhawahg.mongodb.net/usshape?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("db connected");
});
db.on("disconnected", (err, res) => {
  console.log("db disconnected", err, "###", res);
});

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://usshape.org");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use((req, res, next) => {
  const allowedOrigins = ['https://usshape.org', 'http://localhost:3000']; // Add localhost for development
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);  // Dynamically set the allowed origin
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//All Routes
app.use("/", routes);


// Server
app.listen(appPort, () => {
  console.log(`Server running at http://localhost:${appPort}/`);
});