const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/auth.routes');
const prouter = require('./routes/post.routes');
const chatrouter = require('./routes/chatRoutes');
const projectRoutes = require("./routes/projectRoutes");
const historyRoutes = require("./routes/historyRoutes");
const posterRoutes = require("./routes/posterRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const ragRoutes = require("./routes/ragRoutes");
const cors = require("cors");

const path = require("path");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use('/api/auth', router);
app.use('/api/posts', prouter);
app.use('/api/chat', chatrouter);
app.use("/api/projects", projectRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/poster",posterRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/rag", ragRoutes);
app.use("/uploads",express.static(
        path.join(__dirname, "../uploads")
    ));


module.exports = app;