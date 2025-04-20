FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY package.json yarn.lock ./
RUN yarn install

COPY docker-entrypoint.sh ./

RUN chmod +x /app/docker-entrypoint.sh

COPY . .

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["./docker-entrypoint.sh yarn start:local"]