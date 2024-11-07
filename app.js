const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

const dbConfig = {
    user: 'appUser',
    password: '12345',
    server: '127.0.0.1',
    database: 'ProdutosDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

app.post('/adicionar-produto', async (req, res) => {
    const { nome, descricao, preco, categoria } = req.body;

    try {
        await sql.connect(dbConfig);
        const query = `
            INSERT INTO Produtos (Nome, Descricao, Preco, Categoria)
            VALUES (@nome, @descricao, @preco, @categoria)
        `;
        const request = new sql.Request();
        request.input('nome', sql.NVarChar, nome);
        request.input('descricao', sql.NVarChar, descricao);
        request.input('preco', sql.Decimal(10, 2), preco);
        request.input('categoria', sql.NVarChar, categoria);
        await request.query(query);

        res.send('Produto adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar produto: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});