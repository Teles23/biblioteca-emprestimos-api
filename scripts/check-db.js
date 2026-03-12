const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query("select to_regclass('public.\"Author\"') as author_table");
  const resCategory = await client.query("select to_regclass('public.\"Category\"') as category_table");
  const resBook = await client.query("select to_regclass('public.\"Book\"') as book_table");
  const resUser = await client.query("select to_regclass('public.\"User\"') as user_table");
  const authorColumns = await client.query(
    "select column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'Author' order by ordinal_position"
  );
  console.log({
    author: res.rows[0],
    category: resCategory.rows[0],
    book: resBook.rows[0],
    user: resUser.rows[0],
    authorColumns: authorColumns.rows,
  });
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
