# teste6-nest

um sistema de padaria completo

## Estrutura

- `backend/` — API NestJS
- `frontend/` — App React

## Deploy no PDC Deploy

O único `docker-compose.yml`, na raiz do monorepo, sobe toda a stack sem publicar portas no host.
Na criação do projeto, selecione o serviço público `web` e a porta `80`.
Antes do primeiro deploy, cadastre as variáveis de `.env.example` no ambiente.
O Nginx público encaminha `/api` para o backend e `/auth` para o Keycloak pela rede interna.
