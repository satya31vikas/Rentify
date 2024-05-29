import express from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';
import colors from 'colors';

import connectDB from './utils/connectDB.js';
import errorHandler from './middlewares/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

const app = express();

connectDB();

app.use(cors(
    {
        origin: ['https://rentify-satyavikas.vercel.app','http://localhost:5173'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
))

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(`Server is running on port:`,`${port}`.yellow.bold);
})