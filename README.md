# Alô UESPI — MVP de Ouvidoria Universitária

MVP baseado na proposta do projeto Alô UESPI: uma plataforma digital para registrar, acompanhar e gerenciar manifestações de ouvidoria universitária.

## Funcionalidades do MVP

- Registro de manifestação anônima ou identificada
- Tipos: reclamação, denúncia, sugestão, solicitação e elogio
- Geração automática de protocolo
- Definição automática de prioridade por tipo
- Encaminhamento para setor responsável
- Consulta pública por protocolo
- Painel administrativo simples
- Atualização de status da manifestação
- Estrutura pronta para integração futura com Google Login, Telegram e assistente virtual

## Tecnologias

- Backend: Node.js + TypeScript + Express
- Frontend: React + TypeScript + Vite
- Banco: MariaDB
- Infra local: Docker Compose

## Como executar

### 1. Subir o banco MariaDB

```bash
docker compose up -d
```

### 2. Criar as tabelas

```bash
docker exec -i alo_uespi_mariadb mariadb -u root -proot alo_uespi < database/schema.sql
```

### 3. Rodar o backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend: http://localhost:3333

### 4. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Próximos passos sugeridos

1. Criar autenticação real para administradores.
2. Implementar login opcional com Google.
3. Adicionar envio de e-mail ou Telegram quando uma manifestação for criada.
4. Criar filtros no painel administrativo.
5. Melhorar acessibilidade e responsividade.
6. Criar testes automatizados.
