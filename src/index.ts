import cors from 'cors';
import express from 'express';
import { main } from './db';
const router = require('./router/router');

const app = express();
const port = 3000;

//conecta ao banco de dados
main();

app.use('/api', router);
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})