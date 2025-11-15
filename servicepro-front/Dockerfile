FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM alpine:3.18

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["sh"]
