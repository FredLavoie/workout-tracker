FROM node:20-alpine

WORKDIR /client_src

COPY ./ /client_src/
RUN npm install
RUN npm run build
