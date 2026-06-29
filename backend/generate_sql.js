const { execSync } = require('child_process');
require('dotenv').config();

const url = process.env.DATABASE_URL;

try {
  const sql = execSync(`npx prisma migrate diff --from-url "${url}" --to-schema-datamodel prisma/schema.prisma --script`).toString();
  require('fs').writeFileSync('migration.sql', sql);
  console.log('SQL generated successfully.');
} catch (e) {
  console.error(e.stdout.toString());
  console.error(e.stderr.toString());
}
