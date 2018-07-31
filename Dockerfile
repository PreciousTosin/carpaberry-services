#FROM node:8-slim
FROM node:8.11.0

WORKDIR /carpaberry
ENV NODE_ENV development

COPY package.json /carpaberry/package.json

RUN npm install
#RUN npm install --production

COPY .env.example /carpaberry/.env.example
COPY . /carpaberry

CMD ["npm","start"]

EXPOSE 8080
