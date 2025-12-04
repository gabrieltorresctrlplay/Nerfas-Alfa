#!/bin/bash

# scripts/setup.sh
# Script de configuração inicial do ambiente de desenvolvimento

echo "🚀 Iniciando setup do ambiente Nerfas-Alfa..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale-o antes de continuar."
    exit 1
fi
echo "✅ Node.js detectado: $(node -v)"

# 2. Instalar Dependências
echo "📦 Instalando dependências..."
npm install

# 3. Configurar Variáveis de Ambiente (.env)
if [ ! -f .env ]; then
    echo "⚠️ Arquivo .env não encontrado!"
    if [ -f .env.example ]; then
        echo "📄 Criando .env a partir de .env.example..."
        cp .env.example .env
        echo "✅ .env criado. POR FAVOR, EDITE O ARQUIVO .env COM SUAS CHAVES DO FIREBASE AGORA."
    else
        echo "❌ .env.example não encontrado. Crie um arquivo .env manualmente com as chaves VITE_FIREBASE_*."
    fi
else
    echo "✅ Arquivo .env já existe."
fi

# 4. Build Inicial (Opcional)
echo "🏗️ Tentando build de verificação..."
npm run build:docs

echo "🎉 Setup concluído! Rode 'npm run dev' para iniciar o servidor."
