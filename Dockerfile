# ---- Build ImageUpload ----
FROM node:10-alpine as build_imageupload
WORKDIR /opt/imageupload

COPY ./ ./
COPY package-lock.json package.json ./
RUN npm ci || npm install

# ---- Build ImageUpload final image ----
FROM node:10-alpine as imageupload
COPY ./.env.example ./.env
EXPOSE 3000
CMD [ "node", "./app.js"]