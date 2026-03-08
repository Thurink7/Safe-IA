# Safe IA — MVP de proteção contra violência digital

Safe IA é um protótipo funcional de plataforma web voltada para proteção contra violência digital, deepfakes e chantagem online, com foco em mulheres vítimas de abuso digital.  
O objetivo é transformar ameaças em **evidências digitais organizadas**, com hash criptográfico e carimbo de data.

## Stack utilizada

- **Frontend**: HTML5, CSS3, JavaScript (sem framework)
- **Backend**: Node.js + Express
- **Banco de dados**: SQLite (arquivo local)
- **Outros**:
  - Upload de arquivos com Multer
  - Geração de hash SHA-256 (criptografia) para prova digital
  - Validação e sanitização de inputs (express-validator)

## Estrutura de pastas

```text
.
├─ backend
│  ├─ server.js          # Servidor Express e configuração geral
│  └─ src
│     ├─ db.js           # Conexão e inicialização do SQLite
│     └─ routes
│        ├─ upload.js    # Rotas de verificador de deepfake e registro de casos
│        └─ cases.js     # Rotas de listagem/consulta de casos (dashboard)
├─ public
│  ├─ index.html         # Home
│  ├─ deepfake.html      # Verificador de Deepfake
│  ├─ registrar.html     # Registro de caso / evidência
│  ├─ apoio.html         # Central de apoio e orientação
│  ├─ sobre.html         # Sobre a plataforma
│  ├─ dashboard.html     # Dashboard simples de casos
│  └─ assets
│     ├─ css
│     │  └─ style.css    # Estilos globais e componentes de UI
│     └─ js
│        ├─ main.js      # Utilitários globais (API base, formatação de data, badges)
│        ├─ deepfake.js  # Lógica do verificador de deepfake (simulado)
│        ├─ registrar.js # Lógica de registro de casos e relatório
│        └─ dashboard.js # Lógica de listagem de casos
├─ package.json
└─ README.md
```

## Instalação e execução

### 1. Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

O backend (e o frontend estático) ficará disponível em:

- `http://localhost:3000`

### 4. Acessar as páginas principais

- **Home**: `http://localhost:3000/index.html`
- **Verificador de Deepfake**: `http://localhost:3000/deepfake.html`
- **Registrar Caso**: `http://localhost:3000/registrar.html`
- **Central de Apoio**: `http://localhost:3000/apoio.html`
- **Sobre**: `http://localhost:3000/sobre.html`
- **Dashboard de casos**: `http://localhost:3000/dashboard.html`

> A navbar em todas as páginas permite navegar entre essas seções.

## Funcionalidades

### 1. Verificador de Deepfake (simulado)

Página: `deepfake.html`

- Upload de **imagem**, **vídeo** ou **PDF** (até 10MB).
- Backend calcula o **hash SHA-256** do arquivo.
- Com base no hash, uma lógica determinística gera um nível de risco **simulado**:
  - **Seguro (verde)** — baixo risco aparente
  - **Suspeito (amarelo)** — indícios que merecem atenção
  - **Possível manipulação (vermelho)** — alto risco simulado
- A interface mostra:
  - Nome do arquivo
  - Hash SHA-256
  - Nível de risco (com badge colorido)
  - Próximos passos recomendados

> Importante: este verificador **não é** um detector real de deepfakes. Serve apenas para demonstrar o fluxo de análise e tomada de decisão.

### 2. Registro de caso e relatório de evidência digital

Página: `registrar.html`

Formulário com:

- Nome (opcional)
- E-mail (opcional)
- Descrição do caso (mínimo de caracteres)
- Upload de evidência (imagem, vídeo ou PDF, até 10MB)

Ao enviar:

- Backend valida os campos e o arquivo.
- Gera **hash SHA-256** do arquivo.
- Gera **timestamp** (`created_at` em ISO).
- Salva os metadados no SQLite:
  - nome, e-mail, descrição
  - caminho do arquivo
  - nome original
  - tipo MIME
  - hash
  - data de criação
  - origem (`source`)
- Retorna para o frontend um **relatório de evidência digital** com:
  - ID do caso
  - Data de registro
  - Hash SHA-256
  - Nome do arquivo

A página exibe esses dados em um card de relatório, com orientações sobre como utilizar essas informações em contextos jurídicos ou de denúncia.

### 3. Central de Apoio

Página: `apoio.html`

- Conteúdo educativo organizado em **cards** sobre:
  - Como agir em caso de chantagem digital
  - Como denunciar crimes digitais
  - Direitos digitais e proteção de dados
- Layout em grid, responsivo, com foco em leitura clara e acolhedora.

### 4. Dashboard de Casos

Página: `dashboard.html`

- Tabela com os últimos casos registrados (até 100).
- Exibe:
  - **ID do caso**
  - **Data**
  - **Tipo de conteúdo** (Imagem, Vídeo, PDF, Outro)
  - **Nome do arquivo**
  - **Origem** (por exemplo, `evidence`)
- Atualização manual via botão “Atualizar lista”.
- Útil para demonstração de como as evidências podem ser organizadas em um painel simples.

## Segurança e cuidados implementados

- **Hash de arquivo**: SHA-256 gerado para cada evidência enviada.
- **Validação de upload**:
  - Tipos permitidos: imagens (`image/*`), vídeos (`video/*`) e PDF.
  - Tamanho máximo: **10MB**.
- **Sanitização de inputs** com `express-validator` (nome, e-mail, descrição).
- **Limitação de escopo**: dados são armazenados somente em um **arquivo SQLite local**, sem envio para serviços externos.

> Em um ambiente de produção, seria necessário adicionar camadas como autenticação, criptografia em repouso, políticas de retenção de dados e revisão jurídica/ética completa.

## Rotas de API

### `POST /api/deepfake-check`

Recebe um arquivo (`evidence`) e retorna:

- `hash`: hash SHA-256 do arquivo
- `analysis`: objeto com:
  - `status`: `seguro`, `suspeito` ou `possivel-manipulacao` (simulado)
  - `label`: descrição amigável
  - `level`: `low`, `medium` ou `high`
  - `color`: cor em hex (para UI)

### `POST /api/cases`

Recebe:

- `name` (opcional)
- `email` (opcional, validado)
- `description` (obrigatório, tamanho mínimo)
- `evidence` (arquivo obrigatório)

Retorna, em sucesso (`201`):

- `report` com:
  - `caseId`
  - `hash`
  - `createdAt`
  - `fileName`
  - `mimeType`

### `GET /api/cases`

Retorna lista de casos para o dashboard:

- `id`, `created_at`, `file_mime_type`, `file_original_name`, `source`

### `GET /api/cases/:id`

Retorna detalhes de um caso específico (metadados, sem conteúdo do arquivo).

## UX e design

- Paleta de cores usada conforme especificação:
  - **Primary**: `#0A1F44`
  - **Secondary**: `#6C5CE7`
  - **Accent**: `#FF4D8D`
  - **Background**: `#F4F6F8`
  - **Text**: `#1A1A1A`
- Estados do sistema:
  - Seguro → badge verde
  - Suspeito → badge amarela
  - Risco → badge vermelha
- Layout responsivo com:
  - Navbar fixa
  - Hero section na Home
  - Cards informativos
  - Botões arredondados e acessíveis
  - Tabela do dashboard com foco em legibilidade

## Observações finais

- Este projeto é um **MVP educativo/demonstrativo**, não um produto pronto para produção.
- Use como base para pesquisas, testes de UX, provas de conceito e discussões sobre violência digital e proteção de mulheres em ambientes online.

