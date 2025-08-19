import { error } from 'console';
import express from 'express';
import mysql from 'mysql2';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        
    database: 'produtos',
    port: 3306
});

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
});

app.post('/cadastrar/produto', (req, res) => {
    console.log('Dados recebidos:', req.body);

    const { nome, preco, quantidade } = req.body;

    if (!nome || !preco || !quantidade) {
        console.error('Dados incompletos:', req.body);
        return res.status(400).send('Por favor, preencha todos os campos.');
    }

    const sql = "INSERT INTO produto (nome, preco, quantidade) VALUES (?, ?, ?)";
    db.query(sql, [nome, preco, quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).send('Erro ao inserir dados.');
        }

        console.log('Dados inseridos com sucesso:', result);
        return res.redirect('/');
        
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});