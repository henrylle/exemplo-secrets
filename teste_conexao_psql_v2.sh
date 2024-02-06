#!/bin/sh

# Variáveis de conexão
DB_HOST="RDS_ENDPOINT"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER=$username
DB_PASSWORD=$password

# Comando psql para se conectar e executar uma consulta SQL
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -c "SELECT schema_name FROM information_schema.schemata"
