FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite за замовчуванням юзає 5173, але ми мапимо 3000
EXPOSE 3000

# --host робить сервер доступним ззовні контейнера
# --port 3000 змушує Vite слухати порт 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]