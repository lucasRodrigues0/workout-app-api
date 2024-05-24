"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
require("express-async-errors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router = require('./router/router');
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
//conecta ao banco de dados
(0, db_1.main)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//cors
app.use((0, cors_1.default)({
    origin: [`${process.env.BASE_URL}`],
    credentials: true
}));
//router
app.use('/api', router);
//error handling
app.use(errorMiddleware_1.ErrorHandlingMiddleware);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
