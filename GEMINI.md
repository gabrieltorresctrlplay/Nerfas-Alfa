# 📘 GEMINI.md - Manual do Projeto Nerfas-Alfa

> **Status do Projeto:** Ativo & Em Desenvolvimento 🚀
> **Data de Atualização:** 04/12/2025
> **Idioma:** Português (BR)

Este documento reflete a arquitetura, stack e processos **atuais** do projeto. É a fonte da verdade para qualquer Agente ou Dev que for mexer aqui.

---

## 1. 🏗️ Stack Tecnológico

O projeto é um **Frontend Moderno (SPA)** hospedado em múltiplas plataformas.

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Framework** | **Vite 7 + React 19** | TypeScript (`strict: true`). Performance máxima. |
| **Estilização** | **Tailwind CSS v4** | Variáveis CSS via `@theme`. Design System "shadcn-like". |
| **Ícones** | **Lucide React** | Biblioteca padrão de ícones. |
| **Roteamento** | **React Router v7** | Rotas protegidas e públicas (`AuthLayout`, `Dashboard`, `Login`). |
| **Backend (BaaS)** | **Firebase v12** | Auth (Email/Senha), Firestore (Database), Hosting. |
| **Gerenciamento** | **npm** | Gerenciador de pacotes padrão. |

---

## 2. 🚀 Infraestrutura & Deploy (CI/CD)

O projeto possui **Deploy Unificado e Automático** para dois destinos simultâneos.

### Destinos de Hospedagem
1.  **Firebase Hosting (Produção Real):**
    *   URL: [https://nerfas.web.app](https://nerfas.web.app)
    *   Pasta de Build: `dist/`
    *   Rota Base: `/`
2.  **GitHub Pages (Documentação/Preview):**
    *   URL: [https://gabrieltorresctrlplay.github.io/Nerfas-Alfa/](https://gabrieltorresctrlplay.github.io/Nerfas-Alfa/)
    *   Pasta de Build: `docs/`
    *   Rota Base: `/Nerfas-Alfa/`

### Workflow do GitHub Actions
O arquivo `.github/workflows/deploy-all.yml` gerencia tudo.
*   **Gatilho:** Push na branch `main`.
*   **Autenticação:** Usa `FIREBASE_TOKEN` (Secret do GitHub) para evitar bloqueios de permissão de organização.
*   **Processo:**
    1.  Builda versão Docs -> Comita na pasta `docs/` da `main`.
    2.  Builda versão Firebase -> Faz upload para o Firebase Hosting.

---

## 3. 🛡️ Segurança & Autenticação

*   **Método:** Firebase Auth (Email/Senha).
*   **Contexto:** `AuthContext.tsx` gerencia o estado global do usuário (`user`, `loading`, `error`).
*   **Proteção:** Componente `<AuthLayout>` redireciona usuários não logados para `/login`.
*   **Fallback:** O sistema verifica `isFirebaseConfigured` para não quebrar a tela se as chaves de API estiverem faltando (modo "ConfigError").

---

## 4. 🧪 Desenvolvimento Local & Testes (Pre-Flight)

**REGRA DE OURO:** Antes de "tacar" código na main, **teste o build localmente** para evitar Tela Branca da Morte.

### Comandos Essenciais

| Comando | O que faz? | Quando usar? |
| :--- | :--- | :--- |
| `npm run dev` | Roda servidor de desenvolvimento. | Enquanto você coda. |
| `npm run preview:firebase` | **CRÍTICO.** Gera o build real e simula o Firebase. | **Antes do Push.** Garante que o site vai abrir. |
| `npm run preview:docs` | **CRÍTICO.** Gera o build e simula o GitHub Pages. | **Antes do Push.** Testa caminhos relativos. |
| `npm run build:all` | Compila os dois formatos (dist e docs). | Para verificar erros de TypeScript/Build. |

---

## 5. 📂 Estrutura de Pastas (Mental Model)

```
/src
  ├── /components    # Blocos de UI (Botões, Forms, Sidebar)
  │   ├── /ui        # Componentes atômicos (Button, Input, Card)
  │   └── /auth      # Formulários de Login/Registro
  ├── /contexts      # Estados Globais (Auth, Theme)
  ├── /lib           # Configurações (firebase.ts, utils.ts)
  ├── /pages         # Telas completas (Dashboard, Login)
  └── main.tsx       # Ponto de entrada
/docs                # (Gerado) Build para GitHub Pages (NÃO EDITE MANUALMENTE)
/.github             # Workflows do Actions
```

---

## 6. 📝 Notas do Desenvolvedor (Gabriel)

*   **Filosofia:** "Funciona na minha máquina" não serve. Tem que funcionar no Build.
*   **Abordagem:** Testar builds localmente (`preview`) antes de comitar.
*   **Estética:** Interface limpa, responsiva e com tema Dark/Light.
*   **Objetivo:** Aprendizado prático de React + Firebase + CI/CD.

> **Lembrete para IA:** Sempre verifique `package.json` para scripts atuais e nunca assuma que bibliotecas extras estão instaladas sem checar.
