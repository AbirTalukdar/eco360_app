import bcrypt from 'bcrypt';

const plainPassword = '1234'; // Input password from Postman
const storedHash = '$2b$10$gNc.kFR3NmvK3kPf7VJzY.n2.dGhPKofm8xz3I3.TS5IbklrfhTnO'; // Hash from DB

bcrypt.compare(plainPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else if (result) {
    console.log('Password matches!'); // Expected output
  } else {
    console.log('Invalid credentials!');
  }
});