// Configurações de conexão padrão para evitar erros antes de recuperar as credenciais
const dbConfig = {
  user: 'postgres',
  host: 'HOST',
  database: 'postgres',
  password: 'default',
  port: '5432',
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

// Função principal para conectar ao banco de dados
async function main() {
  try {
    // Obtém as credenciais do Secrets Manager
    
    const client = new Client(dbConfig);
    
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