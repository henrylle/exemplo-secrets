#!/bin/sh

secret_string=$(aws secretsmanager get-secret-value --secret-id rds!db-e8cb0dc4-d321-4af4-854a-2b1e75cb55d9 --version-stage AWSCURRENT --query SecretString --output text --profile secrets)
username=$(echo $secret_string | jq -r '.username')
password=$(echo $secret_string | jq -r '.password')

# Variáveis de conexão
DB_HOST="db-com-secret.chqwgcm08bm6.us-east-1.rds.amazonaws.com"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER=$username
DB_PASSWORD=$password

# Comando psql para se conectar e executar uma consulta SQL
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -c "SUA_QUERY_SQL_AQUI"
