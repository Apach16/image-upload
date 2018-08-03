# ---- base Node ----
FROM node:carbon as base
# create app folder
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
# copy package* files
COPY package*.json ./
# install app dependencies
RUN npm install

# ---- Build ----
FROM dependencies AS build
WORKDIR /app
COPY src /app

# ---- Release ----
FROM node:8.11.3-alpine as release
# create /app directory
WORKDIR /app
COPY --from=dependencies /app/package.json ./
# install app dependencies
RUN npm install
COPY --from=build /app ./
CMD [ "node", "app.js"]