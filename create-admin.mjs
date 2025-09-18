// Create default admin user
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('Hashed Password:', hashedPassword);
  
  console.log('\nSQL to insert admin user:');
  console.log(`INSERT OR REPLACE INTO admin_users (id, username, email, password_hash, created_at) VALUES (1, 'admin', 'admin@example.com', '${hashedPassword}', datetime('now'));`);
}

createAdmin();