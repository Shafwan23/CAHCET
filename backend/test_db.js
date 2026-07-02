const prisma = require('./src/config/database');
const bcrypt = require('bcrypt');

async function testPasswordComparison() {
  const applicant = await prisma.applicant.findFirst({
    where: { email: 'test@gmail.com' }
  });

  if (!applicant) {
    console.log('Applicant test@gmail.com not found');
    return;
  }

  const isMatchCorrect = await bcrypt.compare('SecurePassword123!', applicant.passwordHash); // guess/placeholder
  const isMatchWrong = await bcrypt.compare('wrong_password', applicant.passwordHash);

  console.log(`Email: ${applicant.email}`);
  console.log(`Password Hash: ${applicant.passwordHash}`);
  console.log(`Comparison with 'wrong_password': ${isMatchWrong}`);
}

testPasswordComparison().catch(console.error).finally(() => prisma.$disconnect());
