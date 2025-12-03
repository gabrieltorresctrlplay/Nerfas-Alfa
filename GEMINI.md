# GEMINI.md

Este arquivo serve como memória de longo prazo e contexto para o agente Gemini neste projeto.

## 🚀 Sobre o Projeto: "Alfa Nerf" (Antigo Chat Bot Supremo)
**Status Atual:** Pivotado. O projeto agora é um **Painel Administrativo Sério e Funcional**.
**Estética:** Dark Mode, sóbrio ("triste"), sem funcionalidades de chat ou "alegrias". Foco em configurações e controle.

## 🛠 Stack & Infraestrutura
- **Frontend:** Vite + React + TypeScript.
- **Estilo:** Tailwind CSS v4 (Configurado com plugin nativo do Vite `@tailwindcss/vite`).
- **Backend/Serviços:** Firebase (Authentication, Firestore, Hosting).
- **Hosting URL:** `https://nerfas.web.app`

## 🔑 Credenciais de Teste
Utilize esta conta para testar fluxos de login e dashboard sem precisar criar novas contas sempre:
- **Login:** `admin@teste.com`
- **Senha:** `123456`

## 📜 Workflow Obrigatório (Regra de Ouro)
Sempre que uma alteração for implementada, siga este ritual:
1. **Implementar** a mudança.
2. **Deploy** (`npm run deploy`). *Nota: O script já faz o build.*
3. **Testar** abrindo o site no navegador automatizado.
4. **Validar** se a alteração está refletida em produção.

## ⚠️ Mensagem para o "Eu do Futuro" (Troca de PC)
Se você está lendo isso em uma nova máquina, siga este checklist:

1.  **Dependências:** Rode `npm install`.
2.  **Ambiente (.env):** Verifique se o arquivo `.env` está na raiz com as chaves do Firebase (`VITE_FIREBASE_...`). Se não estiver, recupere do console do Firebase.
3.  **Autenticação CLI:** Rode `npx firebase login` para conectar sua conta Google ao terminal.
4.  **Limpeza:** O código antigo do "Counter" e do "Chat" foi removido, mas mantenha a vigilância. Se vir algo "divertido", remova. O foco é um dashboard administrativo.
5.  **Context7:** A ferramenta de docs estava com erro de API na sessão anterior. Se precisar de docs, use Google Search.

## 📂 Estrutura Chave
- `src/pages/Login.tsx`: Login e Registro (Visual Dark/Glass).
- `src/pages/Dashboard.tsx`: Painel com abas "Visão Geral" (Status) e "Configurações" (Toggles funcionais com LocalStorage).
- `src/lib/firebase.ts`: Configuração central do Firebase.
