import cors from "cors";
import express from "express";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// pega o nome do diretório atual

let idCount = 0;

function criarId() {
  idCount += 1;
  return idCount;
}

const produtos = [];

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// cors proteção do navegador, bloquear requisições que estão sendo feitas, 
// nesse caso estamos liberando o uso dele para liberação de requisições

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// rota de aplicação que vai servir o nosso html sem precisar de usar o Open Live Server

app.get("/produtos", (req, res) => {
  res.json(produtos);
});
// retorna a lista de produtos
app.post("/produtos", (req, res) => {
  const data = req.body;
  // cadastra a lista de produtos

  if (!data.nome) {
    return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
  }

  if (!data.categoria) {
    return res
      .status(400)
      .json({ message: "O campo 'categoria' é obrigatório." });
  }

  if (!data.preco) {
    return res.status(400).json({ message: "O campo 'preco' é obrigatório." });
  }

  const produto = {
    id: criarId(),
    nome: data.nome,
    categoria: data.categoria,
    preco: Number(data.preco),
  };

  if (isNaN(produto.preco)) {
    return res
      .status(400)
      .json({ message: "O campo 'preco' deve ser um numero." });
  }

  produtos.push(produto);
  res.json({ message: "Produto cadastrado com sucesso." });
});

app.get("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const produto = produtos.find((p) => p.id == id);

  if (!produto) {
    res.json({ message: "Produto não encontrado" });
    return;
  }

  res.json(produto);
});

app.listen(8080, () =>
  console.log("Server is running at http://localhost:8080/")
);