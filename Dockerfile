
FROM node:18.19.1 AS runner
WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

CMD ["npm", "run", "dev"]