FROM node:8.12

COPY . .

RUN npm install --production --registry=https://registry.npm.taobao.org && npm cache clear --force

ENTRYPOINT ["node", "."]
