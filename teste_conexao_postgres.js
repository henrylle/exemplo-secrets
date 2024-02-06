const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { Client } = require('pg');

// Configurações do AWS Secrets Manager
const region = 'us-east-1';
const secretName = 'rds!db-e8cb0dc4-d321-4af4-854a-2b1e75cb55d9';

// Configurações de conexão padrão para evitar erros antes de recuperar as credenciais
const dbConfig = {
  user: 'default',
  host: 'db-com-secret.chqwgcm08bm6.us-east-1.rds.amazonaws.com',
  database: 'default',
  password: 'default',
  port: '5432',
};

// Cria um novo cliente do AWS Secrets Manager
const secretsManagerClient = new SecretsManagerClient({ region });

// Função para obter as credenciais do Secrets Manager
async function getSecrets() {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await secretsManagerClient.send(command);

    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      return Buffer.from(data.SecretBinary, 'base64');
    }
  } catch (err) {
    console.error('Erro ao recuperar as credenciais do Secrets Manager:', err);
    throw err;
  }
}

// Função principal para conectar ao banco de dados
async function main() {
  try {
    // Obtém as credenciais do Secrets Manager
    const credentials = await getSecrets();

    // Mescla as credenciais recuperadas com as configurações padrão
    const mergedConfig = { ...dbConfig, ...credentials };

    // Cria uma nova instância do cliente do PostgreSQL
    const client = new Client(mergedConfig);

    // Conecta ao banco de dados
    await client.connect();
    console.log('Conexão bem-sucedida!');

    // Exemplo de execução de uma consulta
    const queryResult = await client.query('SELECT NOW()');
    console.log('Resultado da consulta:', queryResult.rows[0]);

    // Fecha a conexão com o banco de dados
    await client.end();
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
}

// Chama a função principal
main();