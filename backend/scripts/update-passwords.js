const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const updates = [
  { username: 'superadmin', newPassword: 'Super@Admin#2026' },
  { username: 'cse_admin', newPassword: 'Cse#SecureAdmin!99' },
  { username: 'ece_admin', newPassword: 'Ece#SecureAdmin!88' },
  { username: 'aiml_admin', newPassword: 'Aiml#SecureAdmin!77' },
  { username: 'mca_admin', newPassword: 'Mca#SecureAdmin!66' },
  { username: 'placement_admin', newPassword: 'Placements#Secure!55' },
  { username: 'faculty_editor', newPassword: 'Faculty#Secure!44' },
];

async function main() {
  for (const { username, newPassword } of updates) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { username },
        data: { passwordHash },
      });
      console.log(`Updated password for ${username}`);
    } else {
      console.log(`User ${username} not found`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
