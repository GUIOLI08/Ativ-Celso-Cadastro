import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});