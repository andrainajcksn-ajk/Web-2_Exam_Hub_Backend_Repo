import 'dotenv/config';
import { pool } from '../config/db';
import { hashPassword } from '../security/password';

const seedAdmin = async (): Promise<void> => {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
        throw new Error('ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env');
    }

    const passwordHash = await hashPassword(password);
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
        [name, email, passwordHash]
    );

    if (result.rowCount === 0) {
        console.log(`Un compte existe déjà avec l'email ${email}, aucun changement.`);
    } else {
        console.log(`Compte admin créé avec succès (id=${result.rows[0].id}).`);
    }
};

seedAdmin().catch((err) => {
        console.error('Erreur lors du seed admin :', err);
        process.exitCode = 1;
    }).finally(() => {
        void pool.end();
    });