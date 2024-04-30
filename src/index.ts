require('dotenv').config();
import cors from 'cors';
import express from 'express';
import { main } from './db';
import { ErrorHandlingMiddleware } from './middlewares/errorMiddleware';
import "express-async-errors";
import cookieParser from 'cookie-parser';


const router = require('./router/router');
const app = express();
const port = process.env.PORT || 3000;

//conecta ao banco de dados
main();

app.use(express.json());
app.use(cookieParser());

//cors
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

//router
app.use('/api', router);

//error handling
app.use(ErrorHandlingMiddleware);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})