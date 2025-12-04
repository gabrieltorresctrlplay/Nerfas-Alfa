# GEMINI.md

Este arquivo serve como memória de longo prazo e contexto para o agente Gemini neste projeto.

## 🗣️ Comunicação

**Idioma:** Português do Brasil (PT-BR). O agente deve interagir sempre neste idioma, mantendo um tom prestativo e direto.

## 🚀 Sobre o Projeto: "Alfa Nerf" (Antigo Chat Bot Supremo)

**Status Atual:** Pivotado. O projeto agora é um **Painel Administrativo Sério e Funcional**.

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
2. **Deploy** (`npm run deploy`). _Nota: Este script é a fonte única de verdade para deploy e já inclui a etapa de build automaticamente._
3. **Testar** abrindo o site no navegador automatizado, **SEMPRE realizando um "hard refresh" (Ctrl+F5 ou Shift+F5)** para evitar problemas de cache.
4. **Validar** se a alteração está refletida em produção.
5. **Autoaprovação para Comandos Interativos:** Em cenários de configuração (como `shadcn-ui init`), se o comando CLI é interativo, o agente DEVE tentar auto-aprovar as opções padrão ou as mais lógicas (ex: usar flags `-y`, ou alimentar as respostas via `echo` / `here-string`). Caso não seja possível a autoaprovação e o comando exija interação manual, o agente DEVE informar o usuário e esperar sua ação.

## ⚠️ Mensagem para o "Eu do Futuro" (Troca de PC)

Se você está lendo isso em uma nova máquina, siga este checklist:

1. **Dependências:** Rode `npm install`.
2. **Ambiente (.env):** O arquivo `.env` **deve** estar na raiz com as chaves do Firebase (`VITE_FIREBASE_...`). Se não existir, crie-o a partir de `.env.example` e preencha com as suas chaves **reais** do console do Firebase. Certifique-se de que **NÃO há aspas** em torno dos valores das variáveis (ex: `VITE_FIREBASE_API_KEY=SUA_CHAVE_AQUI`, _não_ `VITE_FIREBASE_API_KEY="SUA_CHAVE_AQUI"`).
3. **Autenticação CLI:** Rode `npx firebase login` para conectar sua conta Google ao terminal.
4. **Limpeza:** O código antigo do "Counter" e do "Chat" foi removido, mas mantenha a vigilância. Se vir algo "divertido", remova. O foco é um dashboard administrativo.

## 📂 Estrutura Chave

- `src/pages/Login.tsx`: Login e Registro (Visual Dark/Glass).
- `src/pages/Dashboard.tsx`: Painel com abas "Visão Geral" (Status) e "Configurações" (Toggles funcionais com LocalStorage).
- `src/lib/firebase.ts`: Configuração central do Firebase.

## ⚠️ Troubleshooting: Erros de Autenticação/API Key do Firebase

Se você encontrar erros como `auth/api-key-not-valid` ou `auth/invalid-api-key` no frontend (aplicativo web), especialmente após atualizar as chaves do Firebase ou fazer um novo deploy, siga estes passos para depurar:

1. **Verifique a Validade da API Key (Localmente):**

   - Crie um script Node.js temporário para inicializar o Firebase e tentar criar ou logar um usuário usando a mesma API Key.
   - Se o script Node.js funcionar, a API Key é válida e o problema é como ela é usada no navegador.
   - _Comando de exemplo para rodar o script:_ `node seu_script_de_teste.js`

2. **Confirme o Carregamento das Variáveis de Ambiente (Vite):**

   - No frontend (se estiver usando Vite), a API Key deve ser carregada via `import.meta.env.VITE_FIREBASE_API_KEY` a partir do arquivo `.env`.
   - **Verifique a existência e o conteúdo do `.env`:** A causa mais comum é a ausência do arquivo `.env` ou o uso de chaves incorretas/desatualizadas. Crie o `.env` a partir de `.env.example` e preencha-o com suas chaves **reais** do Firebase.
   - **Remova aspas do `.env`:** Certifique-se de que **NÃO há aspas** em torno dos valores das variáveis no seu arquivo `.env` (ex: `VITE_FIREBASE_API_KEY=SUA_CHAVE_AQUI`, _não_ `VITE_FIREBASE_API_KEY="SUA_CHAVE_AQUI"`).
   - **Verifique se a variável está sendo embutida no bundle final:** Após um `npm run build`, inspecione o arquivo JavaScript principal em `dist/assets/*.js`. Procure pela sua API Key (parcialmente, por segurança) para confirmar que ela está lá. Se não estiver, o Vite não está embutindo-a.

3. **Ajuste as Restrições da API Key (Google Cloud Console):**

   - Vá para [https://console.cloud.google.com/apis/credentials](https://console.cloud.com/apis/credentials).
   - Encontre a chave de API (aquela que começa com `AIzaSyD...`).
   - Edite as restrições:
     - **"Referenciadores HTTP (sites)"**: Adicione `https://nerfas.web.app/*` e `https://localhost:*/*`.
     - **TESTE RÁPIDO**: Remova temporariamente _todas_ as restrições (`Nenhum`) para isolar se o problema é a restrição de domínio. Se funcionar, adicione as restrições novamente de forma mais granular.

4. **Limpe o Cache e Redeply (Persistência de Cache):**

   - Mesmo após corrigir, o navegador ou o CDN do Firebase podem servir versões antigas.
   - Sempre faça um **"hard reload" (Ctrl+F5 ou Shift+F5)** no navegador.
   - Se as alterações não aparecerem, faça um novo `npm run deploy` para forçar uma nova versão no servidor.

5. **Debug Detalhado no Frontend:**
   - Se o erro persistir, adicione um `console.error` detalhado no bloco `catch` da sua função de login, para logar o objeto de erro completo do Firebase no console do navegador.
   - _Exemplo:_ `console.error('ERRO DETALHADO DO FIREBASE:', erroCompleto);`
