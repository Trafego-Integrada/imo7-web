# Utilizar imagem base
FROM node:20

# Instalar dependências do sistema necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libnspr4 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcb1 \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package.json ./

# Instalar dependências com cache otimizado
RUN yarn install --frozen-lockfile

# Copiar todo o código
COPY . .

# Copiar variáveis de ambiente, se necessário
# COPY .env.production .env

# Compilar Next.js
RUN yarn build

# Expor a porta padrão do Next.js
EXPOSE 3000

# Comando de inicialização
CMD ["yarn", "start"]
