//Importando as bibliotecas
const express = require('express');
const {MongoClient,ObjectId} = require('mongodb');

//Utilizando a biblioteca express
const app = express();
app.use(express.json());

//Conectando ao Cluster
const client = new MongoClient(process.env.MONGO_URI);

//Conectando ao Banco e a coleção específica
const produtos = client.db('loja').collection('produtos');

//Criando os métodos HTTP

//Método POST para inserir novos produtos
app.post('/produtos',async (req,res)=>{
    const novo_produto = await produtos.insertOne(req.body);
res.status(201).json(novo_produto); 
});

//Método GET para visualizar todos os produtos
app.get('/produtos',async (req,res)=>{
    const lista = await produtos.find().toArray();
    res.json(lista);
});

//Método GET para visualizar um produto específico
app.get('/produtos/:id',async (req,res)=>{
    const resultado = await produtos.findOne({_id:new ObjectId(req.params.id)});
    res.json(resultado);
});

//Método PUT para atualizar um produto específico 
app.put('/produtos/:id', async (req,res)=>{
    const resultado = await produtos.updateOne({_id:new ObjectId(req.params.id)},
    {$set:req.body});
    res.json(resultado);
});

//Método DELETE para apagar um produto em específico
app.delete('/produtos/:id', async (req,res)=>{
    const resultado = await produtos.deleteOne({_id:new ObjectId(req.params.id)});
    res.json(resultado);
});

//Inicializando o servidor
client.connect()
    .then(()=>{
        console.log('Conectado ao MONGODB');
        app.listen(3000,()=>console.log('API rodando na porta 3000'));
    })
    .catch((erro)=>console.log('Erro ao conectar',erro.message));





