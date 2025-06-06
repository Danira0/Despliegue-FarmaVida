FROM node:18

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

CMD ["npm", "start"]

