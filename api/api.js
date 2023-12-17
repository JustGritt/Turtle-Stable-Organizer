const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors())

// ====================================
// Functions
// ====================================

// ====================================
// Database
// ====================================
const connectDB = async () => {
    console.log("Connecting to the database...");
    mongoose.Promise = global.Promise;
    mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err) => {
            console.error("Could not connect to the database. Error...", err);
            process.exit();
        });
};

// ====================================
// Express routes
// ====================================
// require("./app/routes/report.routes.js")(app);

// Test route
app.get("/", (_, res) => {
    res.json({ message: "Server is running :D" });
});

// ====================================
// Server start and database connection
// ====================================
app.listen(process.env.SERVER_PORT, async() => {
    await connectDB();
    console.log(`Server is running on port ${process.env.SERVER_PORT}.`);
});