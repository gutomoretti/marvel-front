# Marvel Heroes — Frontend (Vue 3)

Interface web para o desafio full stack: CRUD de super-heróis consumindo a API .NET Core 8. Feito para ser direto de testar e avaliar.

## Visão rápida
- Vue 3 + Vite + TypeScript, roteamento com Vue Router.
- UI escura com layout responsivo e mensagens de loading/erro.
- Páginas: Listagem, Detalhes, Cadastro/Edição (com seleção de superpoderes) e Exclusão.
- Tipagens e payloads seguem o contrato OpenAPI fornecido.

## Como rodar em 2 minutos
1) Configure o endpoint da API (Swagger indica `http://localhost:5000` por padrão):
```env
# .env
VITE_API_BASE_URL=http://localhost:5000
```

2) Instale e suba o dev server:
```bash
npm install
npm run dev
# abre em http://localhost:5173
```

3) Build de produção (opcional):
```bash
npm run build
npm run preview
```

## Funcionalidades entregues
- **Listar heróis:** tabela com superpoderes, links para detalhes/edição e ação de excluir com confirmação.
- **Criar/editar:** formulário com validações (mínimo de caracteres, ranges de altura/peso, data, obrigatório pelo menos um superpoder). Seleção múltipla de superpoderes trazidos da API.
- **Detalhar:** página com atributos, data formatada e chips de superpoderes.
- **Exclusão:** ação inline na tabela com feedback de carregamento.
- **Estados resilientes:** indicadores de carregando, vazios e mensagens de erro para chamadas HTTP.

## Arquitetura front
- `src/api` — client REST (`client.ts`) e tipos (`types.ts`) alinhados ao esquema OpenAPI.
- `src/views` — `HeroListView`, `HeroFormView` (create/edit), `HeroDetailsView`.
- `src/router` — rotas declarativas (`/`, `/heroes/new`, `/heroes/:id`, `/heroes/:id/edit`).
- `src/assets` — estilos globais e tema.
- `src/App.vue` — shell com header, navegação e container principal.

## Sobre o consumo da API
- Base URL lida de `VITE_API_BASE_URL`.
- Endpoints usados: `/api/Heroes` (GET/POST) e `/api/Heroes/{id}` (GET/PUT/DELETE), `/api/Superpowers` (GET).
- Tratamento de erro: exibe `message` retornada pelo backend (fallback para statusText).

## O que observar na avaliação
- Código enxuto em script setup + Composition API.
- Validações do front espelham constraints do contrato (mínimos, máximos, obrigatórios).
- UI amigável para o fluxo de testes rápidos do CRUD.

## Próximos passos sugeridos
- Conectar ao backend real para verificar mensagens de erro e ajustar cópias se necessário.
- Adicionar testes de componente (ex. Vitest) se desejado no processo de avaliação.
