FROM node:23-alpine AS build

WORKDIR /usr/src/app

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY . .

RUN npm install

RUN npx vite build

FROM nginx:latest AS prod

WORKDIR /usr/share/nginx/html

COPY --from=build ./usr/src/app/dist ./

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80