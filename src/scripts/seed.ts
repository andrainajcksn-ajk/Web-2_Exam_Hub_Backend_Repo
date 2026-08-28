import { query } from '../config/db';
import { hashPassword } from '../security/password';

// RG-01 : premier compte administrateur via ce script
async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@examhub.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrateur';

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log('Admin already exists, skipping.');
    return;
  }

  await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
    [name, email, hashPassword(password)]
  );
  console.log(`Admin created: ${email} / ${password}`);

  // Étudiants de test
  const students = [
    { name: 'Jean Rakoto', email: 'jean.rakoto@examhub.local' },
    { name: 'Miora Andry', email: 'miora.andry@examhub.local' },
  ];
  for (const s of students) {
    const ex = await query('SELECT id FROM users WHERE email = $1', [s.email]);
    if (ex.rows.length === 0) {
      await query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'student')",
        [s.name, s.email, hashPassword('student123')]
      );
      console.log(`Student created: ${s.email} / student123`);
    }
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
