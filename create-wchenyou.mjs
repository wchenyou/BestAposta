// Create wchenyou admin user
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const username = 'wchenyou';
  const password = 'Aaron12345678';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Hashed Password:', hashedPassword);
  
  console.log('\nSQL to insert admin user:');
  console.log(`UPDATE admin_users SET username = '${username}', password_hash = '${hashedPassword}' WHERE id = 2;`);
  console.log(`INSERT OR REPLACE INTO admin_users (id, username, email, password_hash, created_at) VALUES (3, '${username}', 'wchenyou@gmail.com', '${hashedPassword}', datetime('now'));`);
}

createAdmin();