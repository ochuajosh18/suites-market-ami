FROM node:12.12.0-alpine
WORKDIR "/app"
COPY ./package.json ./
COPY ./yarn.lock ./
RUN npm install
RUN yarn
RUN yarn run build-staging
COPY ./ ./
CMD ["npm", "run", "start"]