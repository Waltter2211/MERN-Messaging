FROM node:23-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx tsc

EXPOSE 3000

CMD ["node","dist/index.js"]