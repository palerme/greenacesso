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
git clone https://github.com/palerme/greenacesso
cd green-acesso-backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o `.env`

Crie um arquivo `.env` na raiz do projeto e adicione:

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

---

## 📆 Funcionalidades implementadas

### ▪ Atividade 1 – Upload CSV

**Endpoint:** `POST /importacao/csv`

- Recebe um arquivo `.csv` com os boletos
- Mapeia `unidade` → `lotes.nome`
- Salva os boletos com `id_lote` correto

### ▪ Atividade 2 – Mapeamento de Unidade

- O CSV contém a coluna `unidade` (ex: `17`)
- O sistema busca na tabela `lotes` por `nome = '0017'` para obter o `id` real do lote

### ▪ Atividade 3 – Upload de PDF dos boletos

**Endpoint:** `POST /importacao/pdf`

- Recebe um PDF com várias páginas
- Divide o PDF em arquivos individuais (1 por página)
- Salva os arquivos como:
  - `boletos-pdf/1-marcia-carvalho.pdf`
  - `boletos-pdf/2-jose-da-silva.pdf`

### ▪ Atividade 4 – Listagem e filtros

**Endpoint:** `GET /boletos`

Com filtros opcionais:
```http
GET /boletos?nome=JOSE&id_lote=2&valor_inicial=100&valor_final=200
```

### ▪ Atividade 5 – Geração de Relatório PDF

**Endpoint:** `GET /boletos?relatorio=1`

- Retorna um objeto com o PDF do relatório dos boletos filtrados:
```json
{
  "base64": "JVBERi0xLjQKJ..."
}
```

---

## 🗃️ Estrutura de pastas

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
```

---

## 📓 Observações

- O projeto **não precisa ser publicado**, apenas entregue via Git.
- A estrutura do banco é criada automaticamente pelo TypeORM (`synchronize: true`).
- A pasta de uploads e PDFs gerados pode ser configurada via `.env`.

---

## 💡 Extras que poderiam ser implementados

- Paginação nos boletos (`limit`, `offset`)
- Download direto do PDF via `GET /boletos/relatorio.pdf`
- Interface Web com upload e visualização dos arquivos

---

## ✨ Desenvolvido por

João Guilherme — [linkedin.com/in/seu-usuario](https://linkedin.com/in/joaogfagundes)
