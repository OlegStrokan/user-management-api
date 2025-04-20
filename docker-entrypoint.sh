set -e

echo "Waiting for database to be ready..."

until nc -z exchange_prod 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing migrations"

echo "Running database migrations..."
yarn migration:test:run

echo "Starting the application..."
exec "$@"
