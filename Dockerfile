FROM node:17-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
RUN npm -g install fastify-cli
CMD [ "npm", "run", "start" ]