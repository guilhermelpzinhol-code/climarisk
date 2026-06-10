# Climarisk — Agri-Intelligence Prime

MVP **web responsivo** de gestão de risco climático paramétrico para o agronegócio.
Foco regional do MVP: **Oeste da Bahia** (Luís Eduardo Magalhães / Barreiras), cultura principal **Soja**.

> A Climarisk é provedora de dados e infraestrutura tecnológica — **não é uma seguradora**.

## Stack
- Vite + React + TypeScript
- Tailwind CSS (paleta extraída do protótipo)
- React Router (rotas com code-splitting / `React.lazy`)
- lucide-react · dados mockados (localStorage), sem backend

## Telas
Landing · Login por perfil · Dashboard · Map View · Propriedades · Mitigação de Risco (Insurance) ·
Central de Laudos (Alerts) · Configurações · Perfil.

## Requisitos Funcionais
- **RF01** — cadastro/login de usuários por perfil (`/login`)
- **RF02** — inserção de coordenadas lat/long ao cadastrar propriedade (`/properties`)
- **RF03** — exportar laudo em PDF (`/alerts`)
- **RF04** — alertas de gatilho climático (`/alerts`)
- **RF05** — simulador de gatilhos paramétricos (`/insurance`)

## Rodar localmente
```bash
npm install
npm run dev
```

## Deploy (Vercel)
Importe o repositório na Vercel. O `vercel.json` já contém o rewrite de SPA.
Framework detectado: **Vite** · Build: `npm run build` · Output: `dist`.
