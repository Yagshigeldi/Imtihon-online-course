import express from "express";
import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import courseRouter from "./routes/course.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import cookieParser from "cookie-parser";
import logger from "./utils/logger/logger.js";
config();

const app = express();
const PORT = +process.env.PORT;

app.use(express.json());
app.use(cookieParser());
await connectDB();

app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/course', courseRouter);
app.use('/enrollment', enrollmentRouter);
app.use('/review', reviewRouter);

process.on('uncaughtException', (err) => {
    if (err) console.log(`Uncaught exception: ${err}`);
    process.exit(1);
});

process.on('unhandledRejection', (reasion, promise) => {
    console.log(`Unhandled rejection: ${reasion}`);
});

app.use((err, req, res, next) => {
    if (err) {
        return res.status(500).json({
            error: err.message || "Internal server error"
        });
    } else {
        return next();
    }
});

app.listen(PORT, logger.info(`Server running on port ${PORT}`));