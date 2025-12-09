FROM node:18-alpine
RUN apk add --no-cache sqlite
WORKDIR /app
RUN npm install -g prisma
COPY ./prisma /app/prisma
EXPOSE 5432
CMD ["prisma", "studio"]