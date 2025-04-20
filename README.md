# User management Application

This repository contains a NestJS application to manage users

## Local Development

### Prerequisites
- Node.js and Yarn installed
- Docker and Docker Compose installed

### Setup Steps

1. Create a `.test.env` file with the following variables:

   ```env
   POSTGRES_PORT=5456
   POSTGRES_USER=stroka01
   POSTGRES_PASSWORD=admin
   POSTGRES_DB=exchange
   POSTGRES_HOST=localhost
   NODE_ENV=test
   ```

2. Install dependencies:
   ```bash
   yarn
   ```

3. Start the database in Docker:
   ```bash
   docker compose -f docker-compose-test.yml -p exchange-local up -d
   ```
   *This starts a PostgreSQL container named `exchange_test` on port 5456 under the project name `exchange-local`.*

4. Start the application:
   ```bash
   yarn start:local
   ```
   *This script will run database migrations and start the NestJS application.*

   After starting, the application will be available at:
   - Base URL: `http://localhost:3000`
   - Swagger API Documentation: `http://localhost:3000/api/docs`

## Docker Deployment

### Setup Steps

1. Create a `.local.env` file with the following variables:
   ```env
   POSTGRES_PORT=5432
   POSTGRES_USER=stroka01
   POSTGRES_PASSWORD=admin
   POSTGRES_DB=exchange
   POSTGRES_HOST=exchange_prod
   NODE_ENV=test
   ```

2. Start the application and database in Docker containers:
   ```bash
   docker compose -p exchange-prod up -d
   ```
   *This will run the application and database in separate Docker containers named `nestjs-api-prod` and `exchange_prod` under the project name `exchange-prod`.*

   After starting, the application will be available at:
   - Base URL: `http://localhost:8000`
   - Swagger API Documentation: `http://localhost:8000/api/docs`

### Important Note

The Docker and local development environments have been configured to use different project names, container names, and data volumes to prevent conflicts:

- **Local Development**:
  - Project name: `exchange-local`
  - Container: `exchange_test` on port 5456
  - Data volume: `./exchange_test`

- **Docker Deployment**:
  - Project name: `exchange-prod`
  - Containers: `nestjs-api-prod` and `exchange_prod` on port 5455
  - Data volume: `./exchange_prod`

Using different project names ensures that Docker Compose treats these as completely separate environments, preventing any conflicts or orphaned containers when switching between them.

### Stopping Containers

To stop the containers, use the same project name flag:

```bash
# Stop local development containers
docker compose -p exchange-local down

# Stop Docker deployment containers
docker compose -p exchange-prod down
```

## Deployment Information

The deployed version of this application is available at:
- Base URL: `https://nestjs-api-three.vercel.app`
- Swagger API Documentation: `https://nestjs-api-three.vercel.app/api/docs`

For `.dev.env` variables, please contact: oleg14ua71@gmail.com

## Author Information

- **Email**: oleg14ua71@gmail.com
- **GitHub**: [https://github.com/olegstrokan](https://github.com/olegstrokan)

---

**Happy coding!**
