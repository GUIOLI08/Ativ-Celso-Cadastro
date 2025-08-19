import { error } from 'console';
import express from 'express';
import mysql from 'mysql2';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(process.cwd(), 'client')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        
    database: 'produtos',
    port: 3306
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd() + '/index.html'));
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

app.get('/mostrar/produtos', (req, res) => {

    console.log('Requisição recebida para mostrar produtos');

    const sql = "SELECT * FROM produto";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).send('Erro ao buscar produtos.');
        }

        console.log('Produtos encontrados:', results);
        res.json(results);
    });
});

app.delete('/deletar/produto:id', (req, res) => {
    
    const productId = req.params.id;
    console.log(`Requisição recebida para deletar produto com ID: ${productId}`);

    if (!productId) {
        return res.status(400).send('ID do produto não fornecido.');
    }

    const sql = "DELETE FROM produto WHERE id = ?";
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            return res.status(500).send('Erro ao deletar produto.');
        }

        console.log(`Produto com ID ${productId} deletado com sucesso.`);
        res.sendStatus(204);
    });

});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});