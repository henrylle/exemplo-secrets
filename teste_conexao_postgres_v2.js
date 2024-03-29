const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { Client } = require('pg');

// Configurações do AWS Secrets Manager
const region = 'us-east-1';
const secretName = 'SECRET';

// Configurações de conexão padrão para evitar erros antes de recuperar as credenciais
const dbConfig = {
  user: 'default',
  host: 'HOST',
  database: 'postgres',
  password: 'default',
  port: '5432',
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};



// Cria um novo client do AWS Secrets Manager
const secretsManagerClient = new SecretsManagerClient({ region });

async function imprimirSecrets(){
  var secrets = await getSecrets();
  console.log(secrets);
}

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

    const client = new Client({
        user: mergedConfig.username,
        host: dbConfig.host,
        database: dbConfig.database,
        password: mergedConfig.password,
        port: dbConfig.port,
        ssl: dbConfig.ssl
      });
    console.log(mergedConfig);
    // Conecta ao banco de dados
    await client.connect();
    console.log('Conexão bem-sucedida!');

    // Exemplo de execução de uma consulta
    const queryResult = await client.query('SELECT schema_name FROM information_schema.schemata');
    console.log('Resultado da consulta:', queryResult.rows[0]);

    // Fecha a conexão com o banco de dados
    await client.end();
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
}

// Chama a função principal
main();