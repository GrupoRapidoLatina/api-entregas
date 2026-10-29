# Rapido Entregas API (Node / NestJS)

API mobile do app **Rápido Entregas**, reescrita do `ApiController` PHP (CodeIgniter) em NestJS + Prisma + MySQL.

## Objetivo

Manter o mesmo contrato do legado (`application/x-www-form-urlencoded` + `multipart`) e os mesmos paths relativos, para o Flutter só trocar a `baseUrl`.

## Regra do banco (obrigatória)

**HML/PROD:** só conectar ao MySQL já existente.

- ❌ `prisma migrate` / `migrate dev` / `migrate deploy`
- ❌ `prisma db push` / `db pull` em HML/PROD
- ❌ CREATE / ALTER / DROP de tabelas ou colunas em HML/PROD
- ✅ `DATABASE_URL` + `prisma generate` (client local)
- ✅ SELECT/INSERT/UPDATE/DELETE da aplicação

**Local (Docker):** `npm run local:setup` pode usar `db push` só no MySQL do `docker compose`.

## Stack

- Node 20+
- NestJS + TypeScript
- Prisma 5 + MySQL (`mysql2`)
- Upload de imagens (`FileUploadService` via DigitalOcean Spaces)
- FCM (`firebase-admin`) para push

## Setup local (Docker — recomendado)

```bash
npm run docker:up
```

Sobe **MySQL + API** em `http://localhost:3000` com logs no terminal (`db push` no start).

```bash
npm run docker:up:detach   # sobe em segundo plano
npm run docker:logs        # só logs da API
npm run docker:down        # parar
npm run docker:reset       # apagar volume e subir limpo
```

Detalhes: [docs/LOCAL.md](docs/LOCAL.md)

### Alternativa: API no host + MySQL no Docker

```bash
# configure o .env (DATABASE_URL, SPACES_*, FCM_*, COMPROVANTE_*, etc.)
npm install
npm run local:setup
npm run start:dev
```

## Setup HML/PROD

```bash
# configure o .env com DATABASE_URL real, SPACES_* (upload) e FCM_*

npm install
npx prisma generate   # só gera client local — não altera o MySQL
npm run start:dev
```

Push (FCM): código já integrado; sem `.env` o push é no-op. Quando criar o projeto Firebase → [docs/FCM.md](docs/FCM.md).

Healthcheck: `GET /health`

Prefixo das rotas do app: `/ApiController/<endpoint>`

Exemplo de `baseUrl` no Flutter:

```text
https://SEU-HOST/ApiController/
```

## Endpoints portados (v1)

Auth/perfil: `login`, `registration`, `forgetPassword`, `changePassword`, `logout`, `profileinfo`, `editProfile`

Leituras: `deliveryDetail`, `getNearByDeliveries`, `getNearByDeliveryBoys`, `get_driver_deliveries`, `get_user_deliveries`, `driverOrderHistory`, `customerOrderHistory`, `notifications`, `getSettings`, `versaoAtual`, `locParceiro`

Motorista: `acceptDeliveryRequest`, `pickupdelivery`, `deliverOrder`, `reportProblem`, `changeReportproblemstatus`, `review`, `cancelDelivery`

Pedidos: `create_order`, `rescheduleOrder`

Auth: login devolve JWT em `data.token`. Rotas protegidas exigem header `Authorization: Bearer <jwt>` (validado no Guard antes do use case). Público: `login`, `registration`, `forgetPassword`, `reset_password`, `verifyemail`, `health`.

Recuperação de senha: `forgetPassword` grava `forget_timestamp` e envia e-mail com deep link do app (`APP_RESET_DEEP_LINK`). O app chama `POST reset_password` com `{ token, password }`. Gaps PHP×Nest: [docs/PHP_NEST_GAP.md](docs/PHP_NEST_GAP.md).

Também portados: `verifyemail`.

Env: `JWT_SECRET`, `JWT_EXPIRES_IN` (ex.: `7d`).

## Ambientes

| Env | Uso |
|-----|-----|
| HML | `APP_ENV=hml` + `DATABASE_URL` do MySQL de homologação |
| PROD | `APP_ENV=prod` + `DATABASE_URL` de produção |

## Cutover Flutter

1. Deploy HML desta API
2. Em `ApiConfig`, ajustar URLs Node e `useNodeApi = true`
3. Validar login + listas + ciclo motorista
4. Cutover PROD

## Estrutura (por features, como o mobile)

```text
src/
  main.ts
  app.module.ts
  core/                 # compartilhado
    common/             # token app, resposta legado
    database/           # Prisma
    infra/file-upload|fcm
    shared/             # mappers compartilhados
  health/
  features/             # 1 responsabilidade por pasta
    login/
    register/
    forgot_password/
    change_password/
    profile/
    create_order/
    delivery_detail/
    nearby_deliveries/
    current_deliveries/
    driver_history/
    customer_history/
    accept_delivery/
    pickup_delivery/
    deliver_order/
    report_problem/
    review/
    cancel_delivery/
    notifications/
    settings_prices/
    partners/
```

Cada feature: `*.module.ts` + `*.controller.ts` + `dto/*.dto.ts` + `use-cases/*.use-case.ts` (`call`).

Exemplo (`login`):

```text
features/login/
  login.module.ts
  login.controller.ts
  dto/
    login.dto.ts
    logout.dto.ts
  use-cases/
    login.use-case.ts
    logout.use-case.ts
```

Fluxo: Controller (DTO) → UseCase.call(dto) → Repository → Prisma (+ FileUpload/FCM no use case).

Extras locais:
- Auth de sessão: `user_id` ativo (`user_status=1`) nos endpoints sensíveis
- Logs HTTP com `requestId` (senha/`code` redigidos)
- Erros Prisma/upload/FCM → JSON legado (sem stack)
- `/health` pinga o MySQL (`db: up|down`)
