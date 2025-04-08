FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY uploads ./uploads

EXPOSE 3000

CMD [ "node", "express.js" ]