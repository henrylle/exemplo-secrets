secret_string=$(aws secretsmanager get-secret-value --secret-id rds!db-e8cb0dc4-d321-4af4-854a-2b1e75cb55d9 --version-stage AWSCURRENT --query SecretString --output text --profile secrets)
username=$(echo $secret_string | jq -r '.username')
password=$(echo $secret_string | jq -r '.password')
echo $username
echo $password
#authenticate postgresql

psql -U $username -d postgres -h db-com-secret.chqwgcm08bm6.us-east-1.rds.amazonaws.com -p 5432 -c "SELECT 1;"