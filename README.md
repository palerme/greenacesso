# 🟢 Desafio Técnico - Backend NodeJS (Green Acesso)

Este projeto é a solução do desafio técnico proposto pela Green Acesso para a vaga de desenvolvedor backend com Node.js e PostgreSQL.

---

## ✅ Tecnologias utilizadas

- NestJS
- TypeORM
- PostgreSQL
- PDFKit
- csv-parser
- Multer

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/palerme/greenacesso.git
cd greenacesso
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env`

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`. Exemplo:

```env
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=sua_senha
TYPEORM_DATABASE=greenacesso
FILE_UPLOAD_PATH=./uploads
```

> 💡 Você pode alterar `FILE_UPLOAD_PATH` para salvar os arquivos em qualquer diretório desejado.

### 4. Rode o projeto

```bash
npm run start:dev
```

A aplicação será iniciada em: `http://localhost:3000`

---

## 📦 Funcionalidades implementadas

### ▪️ Atividade 1 – Upload CSV

**Endpoint:** `POST /importacao/csv`

- Recebe um arquivo `.csv` com os boletos
- Mapeia `unidade` → `lotes.nome`
- Salva os boletos com `id_lote` correto

### ▪️ Atividade 2 – Mapeamento de Unidade

- O CSV contém a coluna `unidade` (ex: `17`)
- O sistema busca na tabela `lotes` por `nome = '0017'` para obter o `id` real do lote

### ▪️ Atividade 3 – Upload de PDF dos boletos

**Endpoint:** `POST /importacao/pdf`

- Recebe um PDF com várias páginas (uma por boleto)
- Divide o PDF em arquivos individuais
- Salva os arquivos como:
  - `boletos-pdf/1-jose-da-silva.pdf`
  - `boletos-pdf/2-marcos-roberto.pdf`
  - `boletos-pdf/3-marcia-carvalho.pdf`

### ▪️ Atividade 4 – Listagem e filtros

**Endpoint:** `GET /boletos`

Parâmetros opcionais:

```
GET /boletos?nome=JOSE&id_lote=2&valor_inicial=100&valor_final=200
```

- Filtros:
  - `nome`: busca insensível a maiúsculas/minúsculas
  - `valor_inicial` e `valor_final`
  - `id_lote`

### ▪️ Atividade 5 – Geração de relatório em PDF (base64)

**Endpoint:** `GET /boletos?relatorio=1`

- Retorna um PDF com os boletos filtrados (ou todos, se sem filtros)
- Retorno:

```json
{
  "base64": "JVBERi0xLjQKJ..."
}
```

Para visualizar, converta o base64 para arquivo `.pdf`.

---

## 🗂 Estrutura de pastas

```
src/
├── boletos/
│   ├── boleto.entity.ts
│   ├── boletos.controller.ts
│   ├── boletos.module.ts
│   └── boletos.service.ts
├── importacao/
│   ├── importacao.controller.ts
│   ├── importacao.module.ts
│   └── importacao.service.ts
├── config/
│   └── typeorm.config.ts
├── main.ts
└── app.module.ts

uploads/           # arquivos enviados (CSV e PDF originais)
boletos-pdf/       # PDFs divididos por ID
```

---

## 📌 Observações

- O banco de dados é criado automaticamente (`synchronize: true`)
- Os arquivos são salvos no caminho definido por `FILE_UPLOAD_PATH`
- O sistema usa PDFKit para gerar relatórios no formato base64

---

## ✨ Desenvolvido por

João Guilherme — [linkedin.com/in/joaogfagundes](https://linkedin.com/in/joaogfagundes)
