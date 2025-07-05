# Utilizar uma imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho na imagem Docker
WORKDIR /app

# Copiar os arquivos package.json e yarn.lock
COPY package.json ./

# Instalar as dependências usando Yarn
RUN yarn install

# Copiar o restante do código da aplicação
COPY . .

# Compilar a aplicação Next.js
RUN yarn build

# Expor a porta que o Next.js irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
