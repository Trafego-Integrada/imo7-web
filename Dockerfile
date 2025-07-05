# Utilizar imagem base
FROM node:20

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
