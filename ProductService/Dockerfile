FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY firebaseConfig.json ./firebaseConfig.json
EXPOSE 8003
CMD ["node", "index.js"]