// server/testBcrypt.js
const bcrypt = require('bcryptjs');

async function testHash() {
  const plainPassword = 'admin123';
  const hashed = await bcrypt.hash(plainPassword, 12); // Salt 12 như model
  console.log('Generated hash:', hashed);

  const isMatch = await bcrypt.compare(plainPassword, hashed);
  console.log('Match test:', isMatch); // Phải true
}

testHash();