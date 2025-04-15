require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const users = require("./routes/users");
const games = require("./routes/games");
const admin = require("./routes/admin");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"]
}));
app.use(cookieParser());
app.use(express.json());

// const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'strict'} })

//routes
app.use("/api/auth/", auth);
app.use("/api/users/", users);
app.use("/api/games/", games);
app.use("/api/admin/", admin);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

