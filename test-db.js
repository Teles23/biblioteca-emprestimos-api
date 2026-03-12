const { Client } = require('pg');

const directUrl = "postgresql://postgres:/ZaGKRHH2YazsEF@db.uucrfmsimrzrhesfmjsh.supabase.co:5432/postgres";
const poolerUrl = "postgresql://postgres.uucrfmsimrzrhesfmjsh:/ZaGKRHH2YazsEF@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

async function testConnection(name, url) {
  console.log(`\n--- Testando ${name} ---`);
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log(`✅ Conexão com ${name} bem-sucedida!`);
    const res = await client.query('SELECT current_database(), current_user, version()');
    console.log('Resultado:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error(`❌ Falha na conexão com ${name}:`, err.message);
  }
}

async function run() {
  await testConnection('Direct Connection (5432)', directUrl);
  await testConnection('Transaction Pooler (6543)', poolerUrl);
}

run();
