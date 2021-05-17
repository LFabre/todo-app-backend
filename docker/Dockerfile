FROM node:alpine
WORKDIR /usr/src/app

COPY . .

COPY package*.json ./
RUN npm ci --only=production

ENV IS_DOCKER true
ENV NODE_ENV production
ENV PORT 3001

EXPOSE 3001

CMD [ "node", "./src/server.js" ]