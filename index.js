import express from "express";
import { MONGODB_CNX_STR } from "./config/dbConnect.js";
import mongoose from "mongoose";
import router from "./routes/authRoute.js";
import productRouter from "./routes/productRoute.js"
import bodyParser from "body-parser";
import notFound from "./middlewares/errorHandler.js"
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import couponRouter from "./routes/couponRoute.js"
const PORT = process.env.PORT || 4000;
const app = express();


await mongoose.connect(MONGODB_CNX_STR)

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use(cookieParser())
app.use('/api/user',router)
app.use("/api/coupon", couponRouter);
app.use('/api/product',productRouter);

app.use(notFound)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`El servidor está funcionando en PORT ${PORT}`);
})