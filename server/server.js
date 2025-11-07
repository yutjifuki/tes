const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const config = require("./config");
const applySecurityMiddleware = require("./middleware/securityMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const respondentRoutes = require("./routes/respondentRoutes");

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SECRET));

applySecurityMiddleware(app);

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("Request cookies:", req.cookies);
    next();
  });
}

app.get("/", (req, res) => {
  res.status(200).send(`
    success
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/respondents", respondentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = config.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`)
);
