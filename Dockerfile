FROM node:23.11.0
WORKDIR /dist
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
CMD [ "node", "--env-file", ".env", "dist/src/index.js"]