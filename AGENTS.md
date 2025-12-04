# AGENTS.md

Este arquivo serve como o manual definitivo para Agentes de IA que manipulam este repositório. O objetivo é manter a consistência, evitar erros recorrentes e acelerar o desenvolvimento.

## 🗣️ Diretrizes de Comunicação
*   **Idioma:** Português do Brasil (PT-BR).
*   **Tom:** Profissional, direto e técnico ("Engenheiro Sênior").

## 🚀 Contexto do Projeto: "Alfa Nerf"
*   **Tipo:** Painel Administrativo / Dashboard.
*   **Stack:** Vite + React (TypeScript) + Tailwind CSS v4.
*   **Backend:** Firebase (Auth, Firestore, Hosting).
*   **Hosting:**
    *   **Firebase Hosting:** (`/dist`) em `https://nerfas.web.app`
    *   **GitHub Pages:** (`/docs`) em `https://[user].github.io/Nerfas-Alfa/`

## 🛡️ Regras de Ouro (Core Directives)

### 1. 🔑 Segurança e Configuração (Firebase)
*   **O Problema:** O ambiente de CI/CD (GitHub Actions) ou sandboxes de agentes geralmente **NÃO** possuem o arquivo `.env` com as chaves secretas. Isso faz o build falhar ou o app crashar (Tela Branca).
*   **A Solução:**
    *   Nunca assuma que `import.meta.env.VITE_FIREBASE_*` existe.
    *   Use a verificação `isFirebaseConfigured` em `src/lib/firebase.ts`.
    *   O `AuthContext` deve sempre tratar a falta de configuração renderizando uma `ConfigErrorScreen` amigável, nunca permitindo que o React tente montar componentes que dependam do Firebase.
    *   **Setup Script:** Ao configurar o ambiente, verifique se `.env` existe. Se não, oriente o usuário a criá-lo baseando-se em um `.env.example`.

### 2. 📦 Workflow de Deploy (Duplo Build)
*   **Build para GitHub Pages (Pasta `docs/`):**
    *   O usuário exige que artefatos de build sejam commitados na pasta `docs/`.
    *   Comando Obrigatório: `npm run build:docs`
    *   Isso gera o build com `base: /Nerfas-Alfa/` e cria o arquivo `404.html` (cópia de `index.html`) necessário para roteamento SPA no GitHub Pages.
*   **Build para Firebase (Pasta `dist/`):**
    *   Comando: `npm run build:firebase` (ou `npm run deploy` que faz build + upload).
    *   Base: `/`.

### 3. 🎨 Padrões de UI/UX
*   **Sidebar "GPT-Style":**
    *   A Sidebar deve ser colapsável.
    *   **Estado Expandido:** Ícone + Texto.
    *   **Estado Colapsado:** Apenas Ícones centralizados numa coluna estreita (w-16 ou similar).
    *   **Mobile:** Drawer (overlay) sobre o conteúdo.
*   **Autenticação:**
    *   **Fluxo Híbrido:** O login aceita "Usuário" ou "Email". O código resolve o email via Firestore antes de autenticar no Firebase Auth.
    *   **Validação:** Sempre valide o formato de email no cliente (Regex) antes de enviar para o Firebase para evitar erros `auth/invalid-email`.
    *   **Robustez:** Envolva chamadas ao Firestore (como criação de perfil) em `try/catch` para detectar bloqueios de rede (AdBlockers) e avisar o usuário.

## 🧪 Testes e Verificação
*   **Playwright em Sandbox:** Testes E2E (Playwright) costumam falhar em ambientes sandbox devido a timeouts de rede ou falta de `.env`.
*   **Recomendação:** Priorize **análise estática** (Lint, TSC) e **verificação de lógica** (ler o código). Se precisar testar UI, use scripts simples que verifiquem a *existência* de elementos no DOM estático ou use screenshots parciais, mas não dependa de fluxos completos de Auth sem `.env`.

## 📂 Estrutura de Pastas Importante
*   `src/components/auth/`: Componentes de Login, Registro, Onboarding.
*   `src/components/Sidebar.tsx`: Lógica complexa de navegação e resize.
*   `src/lib/firebase.ts`: Inicialização segura do SDK.
*   `src/contexts/AuthContext.tsx`: Gerenciamento de estado global de usuário e Tela de Erro de Configuração.

---
*Atualizado por Jules em: Dezembro 2025*
