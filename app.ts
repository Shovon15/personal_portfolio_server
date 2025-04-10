import express, { NextFunction, Request, Response } from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import { clientOrigin } from "./secret";
import userRouter from "./routes/userRoutes";
import { ErrorHandler } from "./utils/error";
import categoryRouter from "./routes/categoryRoutes";
import projectRouter from "./routes/projectRouters";
import contactRouter from "./routes/contactRoutes";
import cvRouter from "./routes/cvRoutes";

export const app = express();

// middleware--------------------
app.use(express.json({ limit: "100mb" }));
app.use(cors({
    origin: clientOrigin,
    credentials: true,
}));
// app.use(cors());
app.use(cookieParser());

//routes
app.use("/api/v1", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/cv", cvRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        success: true,
        message: "Welcome to Shovon portfolio server!!!",
    });
});

app.use(ErrorHandler);
