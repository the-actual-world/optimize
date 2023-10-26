FROM node:alpine

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]

EXPOSE 8080