# Guia de Configuração: Projeto Alfa Nerf

E aí, Nerf! Bem-vindo ao Projeto Alfa Nerf. Para deixar sua máquina pronta para desenvolver, siga estes passos:

## 1. Pré-requisitos Essenciais

- **Node.js e npm:** Certifique-se de ter o Node.js (versão 18.x ou superior) e o npm instalados. Você pode baixar em [nodejs.org](https://nodejs.org/).
- **Visual Studio Code:** Nosso editor de código padrão. Baixe em [code.visualstudio.com](https://code.visualstudio.com/).
- **Conta Google:** Necessária para autenticação no Firebase.

## 2. Configuração do Projeto

1.  **Obter o Código:**

    - Se seu amigo te mandou um ZIP: Descompacte a pasta `chat bot supremo!` em um local de sua preferência.
    - _Se estiver usando Git (Recomendado):_ Clone o repositório para sua máquina.
      ```bash
      git clone <URL_DO_SEU_REPOSITORIO_AQUI>
      cd <nome-da-pasta-do-projeto>
      ```

2.  **Instalar Dependências:**
    Abra o terminal na raiz do projeto (`chat bot supremo!`) e rode:

    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente (`.env`):**
    - Crie um arquivo chamado `.env` na raiz do projeto (se já não existir).
    - Copie o conteúdo de `.env.example` para dentro dele.
    - **Peça ao <seu_amigo> as chaves do Firebase** para preencher essas variáveis. Exemplo (substitua pelos valores reais):
      ```
      VITE_FIREBASE_API_KEY=AIzaSyA...
      VITE_FIREBASE_AUTH_DOMAIN=nerfas.firebaseapp.com
      VITE_FIREBASE_PROJECT_ID=nerfas
      VITE_FIREBASE_STORAGE_BUCKET=nerfas.firebasestorage.app
      VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
      VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
      VITE_FIREBASE_MEASUREMENT_ID=G-E39FQNH5MT
      ```

## 3. Configuração do Firebase CLI

Para poder fazer deploy e interagir com o Firebase, você precisará da ferramenta de linha de comando:

1.  **Instalar Firebase Tools:**
    ```bash
    npm install -g firebase-tools
    ```
2.  **Fazer Login no Firebase:**
    ```bash
    firebase login
    ```
    _Este comando abrirá uma janela no seu navegador. Faça login com a sua conta Google que tem acesso ao projeto `nerfas`._

## 4. Extensões Recomendadas para VS Code

Para uma experiência de desenvolvimento completa, instale estas extensões:

- **Gemini Code Assist:** A melhor extensão de AI para te auxiliar (se você tiver acesso).
- **ESLint:** Para garantir a qualidade e padronização do código.
- **Prettier:** Para formatação automática do código.
- **Tailwind CSS Intellisense:** Auto-completar e dicas para classes Tailwind.
- **React Developer Tools:** Ferramentas para inspecionar componentes React no navegador.

## 5. Rodando o Projeto

1.  **Modo Desenvolvimento:**

    ```bash
    npm run dev
    ```

    _Isso iniciará o servidor de desenvolvimento local (geralmente em `http://localhost:5173`)._

2.  **Fazer Deploy (Publicar o Site):**
    ```bash
    npm run deploy
    ```
    _Este comando fará o build do projeto e o enviará para o Firebase Hosting (https://nerfas.web.app)._

## 6. Credenciais de Teste

Para testar o Login e Dashboard, use esta conta:

- **Email:** `admin@teste.com`
- **Senha:** `123456`

---

Pronto para codar! Qualquer dúvida, pergunte ao <seu_amigo> ou à AI mais próxima. 😉
