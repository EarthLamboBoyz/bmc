
const bcrypt = require('bcryptjs');

async function hash() {
    const h = await bcrypt.hash('123456', 10);
    console.log('HASH:', h);
}
hash();
