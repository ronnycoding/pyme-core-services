FROM node:10
EXPOSE 3000
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
CMD ["yarn", "start"]
