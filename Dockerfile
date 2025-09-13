FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Eski node_modules ve esbuild cache'i sil
RUN rm -rf node_modules && rm -rf /root/.esbuild

# Doğru sürümü yükle
RUN npm install esbuild@0.25.9 --save-dev

RUN npm install

COPY . .

COPY public ./public

EXPOSE 5173

CMD [ "npm","run","dev" ]