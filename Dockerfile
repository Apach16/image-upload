# ---- base Node ----
FROM node:10-alpine as base
WORKDIR /imageupload
RUN apk update --no-cache

# ---- Dependencies ----
FROM base as node_modules
COPY package-lock.json package.json ./
RUN npm ci || npm install

# ---- Copy projects ----
FROM node_modules as copy_project
COPY ./src ./src
RUN rm package-lock.json package.json

# ---- Local ----
FROM copy_project as local
COPY ./.env.local ./.env
EXPOSE 3000
CMD [ "node", "./src/app.js"]

# ---- Production ----
FROM copy_project as production
COPY ./.env.production ./.env
EXPOSE 3000
CMD [ "node", "./src/app.js"]