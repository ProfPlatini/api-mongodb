# API de Produtos: CRUD com Node.js e MongoDB

API REST simples para **cadastrar, listar, buscar, alterar e apagar produtos**, desenvolvida em **Node.js** com **Express** e o **driver oficial do MongoDB**.

Projeto didático da disciplina de **Banco de Dados** do curso **Técnico em Desenvolvimento de Sistemas**, para introduzir bancos de dados **não relacionais (NoSQL)** e a integração com uma API.

O banco de dados pode ser usado de duas formas:

- **MongoDB Atlas:** banco na nuvem (gratuito no plano M0).
- **MongoDB Community Server:** banco instalado no próprio computador.

O código é o mesmo nas duas opções. **Só muda a linha do arquivo `.env`.**

---

## Tecnologias

| Tecnologia | Para que serve |
|---|---|
| [Node.js](https://nodejs.org) (20.6 ou superior) | Executa o JavaScript fora do navegador |
| [Express](https://expressjs.com) | Cria o servidor e as rotas HTTP |
| [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/) | Conecta a API ao banco de dados |
| [MongoDB Atlas](https://www.mongodb.com/atlas) **ou** [MongoDB Community Server](https://www.mongodb.com/try/download/community) | Banco de dados |
| [Thunder Client](https://www.thunderclient.com) ou [Postman](https://www.postman.com) | Testa as requisições |

---

## Estrutura do projeto

```
api-produtos/
├── .env            ← string de conexão com o banco (NÃO vai para o GitHub)
├── .gitignore
├── index.js        ← código da API
├── package.json
└── README.md
```

---

## 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/SEU_USUARIO/api-produtos.git
cd api-produtos
npm install
```

O `npm install` lê o `package.json` e baixa o `express` e o `mongodb` para a pasta `node_modules`.

> Se for criar o projeto do zero:
>
> ```bash
> mkdir api-produtos
> cd api-produtos
> npm init -y
> npm install express mongodb
> ```

---

## 2. Configurar o banco de dados

Escolha **uma** das duas opções abaixo.

### Opção A: MongoDB Atlas (nuvem)

> **Atenção:** o Atlas usa a porta **TCP 27017**, e algumas redes (escolas, empresas) bloqueiam essa porta. Se a conexão der *timeout*, use a **Opção B**.

1. Crie uma conta em [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Crie um cluster **Free (M0)**.
3. Em **Database Access**, crie um usuário e uma senha.
   - Use uma senha **só com letras e números**. Caracteres como `@`, `:`, `/` e `#` quebram a string de conexão.
4. Em **Network Access**, clique em **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) e espere o status ficar **Active**.
   - Isso é adequado para estudo. Em produção, libere apenas os IPs necessários.
5. No cluster, clique em **Connect** → **Drivers** → **Node.js** e copie a string de conexão:

   ```
   mongodb+srv://<db_username>:<db_password>@cluster0.xxxxx.mongodb.net/
   ```

6. Troque `<db_username>` e `<db_password>` pelo seu usuário e pela sua senha, **removendo os `< >`**.

Arquivo `.env`:

```
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/
```

### Opção B: MongoDB Community Server (local)

O banco roda no próprio computador. Como a conexão não sai da máquina, **não é afetada por bloqueios de rede**.

#### B1. Com instalador (precisa de administrador)

1. Acesse [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
2. Escolha **Windows x64** e **msi**.
3. Na instalação, escolha **Complete** e deixe marcados **Install MongoD as a Service** e **Install MongoDB Compass**.

O banco liga sozinho junto com o Windows.

#### B2. Com ZIP (sem administrador)

1. No mesmo site, escolha **Package: zip** e faça o download.
2. Extraia e renomeie a pasta para `C:\Users\SEU_USUARIO\mongodb`.
3. Crie a pasta de dados `C:\Users\SEU_USUARIO\mongodb-data`.
4. No PowerShell, ligue o servidor:

   ```powershell
   & "$HOME\mongodb\bin\mongod.exe" --dbpath "$HOME\mongodb-data"
   ```

5. Espere aparecer `Waiting for connections` e **deixe essa janela aberta**: fechar a janela desliga o banco. Para rodar a API, abra outro terminal.

Arquivo `.env` (para B1 e B2):

```
MONGO_URI=mongodb://127.0.0.1:27017
```

> **Use `127.0.0.1` e não `localhost`.** O Node tenta primeiro o endereço IPv6 (`::1`), mas o MongoDB, por padrão, só escuta no IPv4. Com `localhost`, aparece o erro `ECONNREFUSED ::1:27017`.

### Diferença entre as strings de conexão

| | Atlas | Community (local) |
|---|---|---|
| Protocolo | `mongodb+srv://` | `mongodb://` |
| Usuário e senha | Obrigatórios | Não tem (o banco local vem sem autenticação) |
| Endereço | `cluster0.xxxxx.mongodb.net` | `127.0.0.1` (o próprio computador) |
| Porta | Implícita (27017) | `27017` |

### Criação do banco e da coleção

Não é preciso criar nada antes. O banco **`loja`** e a coleção **`produtos`** são criados automaticamente no **primeiro POST**: o MongoDB cria o que faltar quando recebe o primeiro documento.

---

## 3. Arquivo `.gitignore`

```
node_modules
.env
```

- `node_modules`: são milhares de arquivos que o `npm install` recria a qualquer momento.
- `.env`: contém a senha do banco e **nunca** deve ir para o GitHub.

---

## 4. Executar a API

```bash
node --watch --env-file=.env index.js
```

| Opção | Função |
|---|---|
| `--env-file=.env` | Carrega a `MONGO_URI` do arquivo `.env` para `process.env` (Node 20.6+) |
| `--watch` | Reinicia o servidor sozinho ao salvar o `index.js` (não observa o `.env`: se alterá-lo, pare com **Ctrl+C** e rode de novo) |

Saída esperada:

```
Conectado ao MONGODB
API rodando na porta 3000
```

---

## 5. Rotas da API

URL base: `http://localhost:3000`

| Método | Rota | Ação | Comando no MongoDB | Status |
|---|---|---|---|---|
| `POST` | `/produtos` | Cadastra um produto | `insertOne` | 201 |
| `GET` | `/produtos` | Lista todos os produtos | `find().toArray()` | 200 |
| `GET` | `/produtos/:id` | Busca um produto pelo id | `findOne` | 200 |
| `PUT` | `/produtos/:id` | Altera os campos enviados | `updateOne` + `$set` | 200 |
| `DELETE` | `/produtos/:id` | Apaga um produto | `deleteOne` | 200 |

### POST /produtos

Requisição:

```json
{ "nome": "Mouse", "preco": 50, "categoria": "Informática" }
```

Resposta (`201 Created`):

```json
{ "acknowledged": true, "insertedId": "6721a3f0c8e4b2a1d9f3e456" }
```

### GET /produtos

Resposta (`200 OK`):

```json
[
  { "_id": "6721a3f0c8e4b2a1d9f3e456", "nome": "Mouse", "preco": 50, "categoria": "Informática" }
]
```

> A rota GET também pode ser testada direto no navegador: `http://localhost:3000/produtos`.

### GET /produtos/:id

```
GET http://localhost:3000/produtos/6721a3f0c8e4b2a1d9f3e456
```

Resposta (`200 OK`): um único objeto `{ }`, e não uma lista.

### PUT /produtos/:id

Requisição (só os campos que vão mudar):

```json
{ "preco": 80 }
```

Resposta (`200 OK`):

```json
{ "acknowledged": true, "matchedCount": 1, "modifiedCount": 1, "upsertedId": null, "upsertedCount": 0 }
```

- `matchedCount`: quantos documentos foram encontrados.
- `modifiedCount`: quantos documentos foram alterados (0 se o valor enviado já era o mesmo).

### DELETE /produtos/:id

Resposta (`200 OK`):

```json
{ "acknowledged": true, "deletedCount": 1 }
```

---

## 6. Visualizar os dados

| Banco | Ferramenta |
|---|---|
| Atlas | No site do Atlas, em **Browse Collections** (ou **Data Explorer**) |
| Community | **MongoDB Compass** ou extensão **MongoDB for VS Code**, conectando em `mongodb://127.0.0.1:27017` |

No Compass, a barra **`>_ MONGOSH`**, na parte de baixo, abre um terminal do MongoDB:

```js
use loja
db.produtos.find()
db.produtos.find({ preco: { $gt: 30 } })
```

---

## 7. Erros comuns

| Mensagem | Causa provável | Solução |
|---|---|---|
| `Cannot read properties of undefined (reading 'startsWith')` | A `MONGO_URI` não foi lida | Salvar o `.env`, conferir o nome da variável e a codificação **UTF-8**, e rodar com `--env-file=.env` |
| `bad auth : authentication failed` | Usuário ou senha errados (Atlas) | Conferir a string, sem os `< >` |
| `Server selection timed out` | IP não liberado no Atlas ou porta 27017 bloqueada pela rede | Conferir o **Network Access** ou usar a **Opção B** |
| `querySrv ECONNREFUSED` | A rede não resolve o endereço `+srv` | Usar a **Legacy URI String** do Atlas ou a **Opção B** |
| `ECONNREFUSED ::1:27017` | Uso de `localhost` no banco local | Trocar por `127.0.0.1` |
| `ECONNREFUSED 127.0.0.1:27017` | O servidor local (`mongod`) não está rodando | Ligar o `mongod` (Opção B2) ou o serviço (Opção B1) |
| `Cannot GET /produtos` (404) | Erro de digitação na rota ou na URL | Comparar o caminho da rota com a URL |
| `BSONError` no GET, PUT ou DELETE por id | O id não é um ObjectId válido | Copiar o `_id` completo (24 caracteres) |

---

## Autor

**Prof. Luiz Henrique Gonçalves Platini**
Escola SENAI "Prof. João Baptista Salles da Silva", Americana/SP
GitHub: [@ProfPlatini](https://github.com/ProfPlatini)