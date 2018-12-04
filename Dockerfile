FROM node:8.12

COPY . .

RUN npm install --production && npm cache clear --force

ENTRYPOINT ["node", "."]
